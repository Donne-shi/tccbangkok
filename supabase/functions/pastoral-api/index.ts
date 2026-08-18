import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

type Role = 'admin' | 'visit' | 'public';

// Actions the visitation portal (visit password) may call.
const VISIT_ACTIONS = new Set([
  'verify',
  'staff.list',
  'households.search',
  'households.members',
  'people.search',
  'visits.create',
]);

// Actions reachable without a password, guarded by a secret profile token.
const PUBLIC_ACTIONS = new Set(['profile.get', 'profile.submit']);

const HH_APP_STATUSES = new Set([
  'pending',
  'reviewing',
  'approved_pending_profile',
  'active',
  'on_hold',
  'rejected',
]);
const HH_STATUSES = new Set(['pending_profile', 'active', 'inactive', 'transferred', 'removed']);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } },
);

const str = (v: unknown, max = 4000) =>
  typeof v === 'string' ? v.slice(0, max) : null;
const nullableDate = (v: unknown) => (typeof v === 'string' && v ? v : null);
const like = (s: string) => `%${s.replace(/[%,]/g, '')}%`;

/* ---------- 年龄与人员分类 ---------- */
type AgeCfg = { child_max: number; youth_max: number };
let ageCfgCache: AgeCfg | null = null;

async function ageConfig(force = false): Promise<AgeCfg> {
  if (ageCfgCache && !force) return ageCfgCache;
  const { data } = await supabase.from('app_settings').select('value').eq('key', 'age_groups').maybeSingle();
  const v = (data?.value ?? {}) as Partial<AgeCfg>;
  ageCfgCache = { child_max: Number(v.child_max ?? 11), youth_max: Number(v.youth_max ?? 17) };
  return ageCfgCache;
}

function ageOf(birth?: string | null): number | null {
  if (!birth) return null;
  const b = new Date(birth);
  if (Number.isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getUTCFullYear() - b.getUTCFullYear();
  const m = now.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

function groupOf(age: number | null, cfg: AgeCfg): 'child' | 'youth' | 'adult' | null {
  if (age === null) return null;
  if (age <= cfg.child_max) return 'child';
  if (age <= cfg.youth_max) return 'youth';
  return 'adult';
}

function decoratePerson<T extends Record<string, any>>(p: T, cfg: AgeCfg) {
  const age = ageOf(p.birth_date);
  return { ...p, age, age_group: groupOf(age, cfg) };
}

/** People 查重：手机 → 邮箱 → 姓名+生日；命中则补全资料，否则创建。 */
async function findOrCreatePerson(fields: Record<string, unknown>, knownId?: string) {
  const clean: Record<string, unknown> = {};
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') clean[k] = v;
  });
  let existingId = knownId ?? null;
  if (!existingId && fields.phone) {
    const { data } = await supabase.from('people').select('id').eq('phone', fields.phone as string).limit(1);
    existingId = data?.[0]?.id ?? null;
  }
  if (!existingId && fields.email) {
    const { data } = await supabase.from('people').select('id').eq('email', fields.email as string).limit(1);
    existingId = data?.[0]?.id ?? null;
  }
  if (!existingId && fields.birth_date) {
    const { data } = await supabase
      .from('people')
      .select('id')
      .eq('full_name', fields.full_name as string)
      .eq('birth_date', fields.birth_date as string)
      .limit(1);
    existingId = data?.[0]?.id ?? null;
  }
  if (existingId) {
    const { error } = await supabase.from('people').update(clean).eq('id', existingId);
    if (error) throw error;
    return existingId;
  }
  const { data, error } = await supabase.from('people').insert(clean).select('id').single();
  if (error) throw error;
  return data.id as string;
}

async function personSummaries(ids: string[]) {
  if (!ids.length) return [];
  const { data } = await supabase
    .from('people')
    .select('id, full_name, gender, birth_date, phone')
    .in('id', ids);
  return data ?? [];
}


async function visitsForPersonIds(personIds: string[], householdIds: string[]) {
  const visitIds = new Set<string>();
  if (personIds.length) {
    const [{ data: vp }, { data: direct }] = await Promise.all([
      supabase.from('visit_people').select('visit_id').in('person_id', personIds),
      supabase.from('visits').select('id').in('primary_person_id', personIds),
    ]);
    vp?.forEach((r) => visitIds.add(r.visit_id));
    direct?.forEach((r) => visitIds.add(r.id));
  }
  if (householdIds.length) {
    const { data } = await supabase.from('visits').select('id').in('household_id', householdIds);
    data?.forEach((r) => visitIds.add(r.id));
  }
  if (!visitIds.size) return [];
  return await loadVisits([...visitIds]);
}

async function loadVisits(ids: string[]) {
  const { data: visits } = await supabase
    .from('visits')
    .select('*')
    .in('id', ids)
    .order('visit_date', { ascending: false });
  if (!visits?.length) return [];
  return await decorateVisits(visits);
}

async function decorateVisits(visits: Record<string, unknown>[]) {
  const ids = visits.map((v) => v.id as string);
  const [{ data: vps }, { data: vvs }, { data: exps }, { data: hhs }] = await Promise.all([
    supabase.from('visit_people').select('visit_id, person_id').in('visit_id', ids),
    supabase.from('visit_visitors').select('visit_id, visitor_id, visitor_name').in('visit_id', ids),
    supabase.from('visit_expenses').select('*').in('visit_id', ids),
    supabase.from('households').select('id, household_name'),
  ]);
  const people = await personSummaries([
    ...new Set([
      ...(vps ?? []).map((r) => r.person_id),
      ...visits.map((v) => v.primary_person_id as string).filter(Boolean),
    ]),
  ]);
  const pMap = new Map(people.map((p) => [p.id, p]));
  const hMap = new Map((hhs ?? []).map((h) => [h.id, h.household_name]));
  return visits.map((v) => {
    const vid = v.id as string;
    const expenses = (exps ?? []).filter((e) => e.visit_id === vid);
    return {
      ...v,
      household_name: v.household_id ? hMap.get(v.household_id as string) ?? null : null,
      primary_person: v.primary_person_id ? pMap.get(v.primary_person_id as string) ?? null : null,
      people: (vps ?? [])
        .filter((r) => r.visit_id === vid)
        .map((r) => pMap.get(r.person_id))
        .filter(Boolean),
      visitors: (vvs ?? []).filter((r) => r.visit_id === vid),
      expenses,
      expense_total: expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    };
  });
}

async function handle(action: string, payload: Record<string, unknown>, role: Role) {
  switch (action) {
    case 'verify':
      return { role };

    /* ---------- 探访同工名单 ---------- */
    case 'staff.list': {
      const { data, error } = await supabase
        .from('visit_staff')
        .select('*')
        .order('sort_order')
        .order('created_at');
      if (error) throw error;
      return { staff: role === 'visit' ? (data ?? []).filter((s) => s.active) : data };
    }
    case 'staff.save': {
      const row = {
        name: str(payload.name, 120) ?? '',
        role_title: str(payload.role_title, 120),
        active: payload.active !== false,
        sort_order: Number(payload.sort_order ?? 0),
      };
      if (!row.name) throw new Error('姓名不能为空');
      const q = payload.id
        ? supabase.from('visit_staff').update(row).eq('id', payload.id as string)
        : supabase.from('visit_staff').insert(row);
      const { error } = await q;
      if (error) throw error;
      return { ok: true };
    }
    case 'staff.delete': {
      const { error } = await supabase.from('visit_staff').delete().eq('id', payload.id as string);
      if (error) throw error;
      return { ok: true };
    }

    /* ---------- 人员 ---------- */
    case 'people.search': {
      const q = str(payload.q, 80) ?? '';
      let query = supabase.from('people').select('*').order('full_name').limit(role === 'visit' ? 20 : 500);
      if (q) query = query.or(`full_name.ilike.${like(q)},phone.ilike.${like(q)},email.ilike.${like(q)}`);
      const { data, error } = await query;
      if (error) throw error;
      if (role === 'visit') {
        return { people: (data ?? []).map((p) => ({ id: p.id, full_name: p.full_name, phone: p.phone, gender: p.gender })) };
      }
      const ids = (data ?? []).map((p) => p.id);
      const [{ data: members }, { data: hms }, { data: hhs }] = await Promise.all([
        supabase.from('members').select('person_id, member_status, joined_at, member_number').in('person_id', ids),
        supabase.from('household_members').select('person_id, household_id, relationship').in('person_id', ids),
        supabase.from('households').select('id, household_name'),
      ]);
      const mMap = new Map((members ?? []).map((m) => [m.person_id, m]));
      const hMap = new Map((hhs ?? []).map((h) => [h.id, h.household_name]));
      return {
        people: (data ?? []).map((p) => {
          const hm = (hms ?? []).find((h) => h.person_id === p.id);
          return {
            ...p,
            member: mMap.get(p.id) ?? null,
            household_id: hm?.household_id ?? null,
            household_name: hm ? hMap.get(hm.household_id) ?? null : null,
          };
        }),
      };
    }
    case 'people.save': {
      const row = {
        full_name: str(payload.full_name, 120) ?? '',
        gender: str(payload.gender, 20),
        birth_date: nullableDate(payload.birth_date),
        phone: str(payload.phone, 40),
        wechat: str(payload.wechat, 80),
        email: str(payload.email, 160),
        occupation: str(payload.occupation, 120),
        marital_status: str(payload.marital_status, 40),
        address: str(payload.address, 400),
        notes: str(payload.notes, 4000),
        photo_url: str(payload.photo_url, 500),
        group_id: (payload.group_id as string) || null,
      };
      if (!row.full_name) throw new Error('姓名不能为空');
      if (payload.id) {
        const { error } = await supabase.from('people').update(row).eq('id', payload.id as string);
        if (error) throw error;
        return { ok: true, id: payload.id };
      }
      const { data, error } = await supabase.from('people').insert(row).select('id').single();
      if (error) throw error;
      return { ok: true, id: data.id };
    }
    case 'people.detail': {
      const id = payload.id as string;
      const { data: person, error } = await supabase.from('people').select('*').eq('id', id).single();
      if (error) throw error;
      const [{ data: member }, { data: hms }] = await Promise.all([
        supabase.from('members').select('*').eq('person_id', id).maybeSingle(),
        supabase.from('household_members').select('*, households(*)').eq('person_id', id),
      ]);
      let history: unknown[] = [];
      if (member) {
        const { data } = await supabase
          .from('member_status_history')
          .select('*')
          .eq('member_id', member.id)
          .order('effective_date', { ascending: false });
        history = data ?? [];
      }
      const visits = await visitsForPersonIds([id], (hms ?? []).map((h) => h.household_id));
      return { person, member, households: hms ?? [], history, visits };
    }
    case 'people.delete': {
      const { error } = await supabase.from('people').delete().eq('id', payload.id as string);
      if (error) throw error;
      return { ok: true };
    }

    /* ---------- 家庭 ---------- */
    case 'households.search': {
      const q = str(payload.q, 80) ?? '';
      const { data: hhs, error } = await supabase
        .from('households')
        .select('*')
        .order('household_name')
        .limit(500);
      if (error) throw error;
      const { data: hms } = await supabase.from('household_members').select('*');
      const people = await personSummaries([...new Set((hms ?? []).map((h) => h.person_id))]);
      const pMap = new Map(people.map((p) => [p.id, p]));
      let rows = (hhs ?? []).map((h) => ({
        ...h,
        members: (hms ?? [])
          .filter((m) => m.household_id === h.id)
          .map((m) => ({ ...m, person: pMap.get(m.person_id) ?? null })),
      }));
      if (q) {
        const needle = q.toLowerCase();
        rows = rows.filter(
          (h) =>
            h.household_name?.toLowerCase().includes(needle) ||
            h.members.some(
              (m) =>
                m.person?.full_name?.toLowerCase().includes(needle) ||
                (m.person?.phone ?? '').includes(q),
            ),
        );
      }
      if (role === 'visit') rows = rows.slice(0, 20);
      return { households: rows };
    }
    case 'households.members': {
      const { data: hms, error } = await supabase
        .from('household_members')
        .select('*')
        .eq('household_id', payload.id as string);
      if (error) throw error;
      const people = await personSummaries((hms ?? []).map((h) => h.person_id));
      const pMap = new Map(people.map((p) => [p.id, p]));
      return { members: (hms ?? []).map((m) => ({ ...m, person: pMap.get(m.person_id) ?? null })) };
    }
    case 'households.detail': {
      const id = payload.id as string;
      const cfg = await ageConfig();
      const { data: household, error } = await supabase.from('households').select('*').eq('id', id).single();
      if (error) throw error;
      const { data: hms } = await supabase.from('household_members').select('*').eq('household_id', id);
      const personIds = (hms ?? []).map((h) => h.person_id);
      const [{ data: fullPeople }, { data: youth }, { data: history }, { data: groups }] = await Promise.all([
        personIds.length ? supabase.from('people').select('*').in('id', personIds) : Promise.resolve({ data: [] }),
        personIds.length
          ? supabase.from('youth_members').select('id, person_id, group_id, mentor, growth_stage').in('person_id', personIds)
          : Promise.resolve({ data: [] }),
        supabase
          .from('household_membership_status_history')
          .select('*')
          .eq('household_id', id)
          .order('effective_date', { ascending: false }),
        supabase.from('youth_groups').select('id, name'),
      ]);
      const pMap = new Map((fullPeople ?? []).map((p) => [p.id, decoratePerson(p, cfg)]));
      const yMap = new Map((youth ?? []).map((y) => [y.person_id, y]));
      const visits = await visitsForPersonIds([], [id]);
      const members = (hms ?? []).map((m) => ({
        ...m,
        person: pMap.get(m.person_id) ?? null,
        youth: yMap.get(m.person_id) ?? null,
      }));
      const gMap = new Map((groups ?? []).map((g) => [g.id, g.name]));
      return {
        household: {
          ...household,
          group_name: household.group_id ? gMap.get(household.group_id) ?? null : null,
        },
        members,
        youth_candidates: members.filter((m) => m.person?.age_group === 'youth' && !m.youth),
        history: history ?? [],
        visits,
        follow_ups: visits.filter((v) => v.follow_up_required && v.follow_up_status !== 'completed'),
      };
    }

    case 'households.save': {
      const row = {
        household_name: str(payload.household_name, 160) ?? '',
        primary_contact_id: (payload.primary_contact_id as string) || null,
        address: str(payload.address, 400),
        group_id: (payload.group_id as string) || null,
        notes: str(payload.notes, 4000),
      };
      if (!row.household_name) throw new Error('家庭名称不能为空');
      if (payload.id) {
        const { error } = await supabase.from('households').update(row).eq('id', payload.id as string);
        if (error) throw error;
        return { ok: true, id: payload.id };
      }
      const { data, error } = await supabase.from('households').insert(row).select('id').single();
      if (error) throw error;
      return { ok: true, id: data.id };
    }
    case 'households.delete': {
      const { error } = await supabase.from('households').delete().eq('id', payload.id as string);
      if (error) throw error;
      return { ok: true };
    }
    case 'households.addMember': {
      const { error } = await supabase.from('household_members').upsert(
        {
          household_id: payload.household_id as string,
          person_id: payload.person_id as string,
          relationship: str(payload.relationship, 40) ?? '其他',
          is_primary_contact: payload.is_primary_contact === true,
        },
        { onConflict: 'household_id,person_id' },
      );
      if (error) throw error;
      if (payload.is_primary_contact === true) {
        await supabase
          .from('households')
          .update({ primary_contact_id: payload.person_id as string })
          .eq('id', payload.household_id as string);
      }
      return { ok: true };
    }
    case 'households.removeMember': {
      const { error } = await supabase.from('household_members').delete().eq('id', payload.id as string);
      if (error) throw error;
      return { ok: true };
    }

    /* ---------- 会友申请 ---------- */
    case 'applications.list': {
      let query = supabase.from('member_applications').select('*').order('created_at', { ascending: false });
      const status = str(payload.status, 20);
      if (status && status !== 'all') query = query.eq('status', status);
      const q = str(payload.q, 80);
      if (q) query = query.or(`full_name.ilike.${like(q)},phone.ilike.${like(q)},email.ilike.${like(q)}`);
      const { data, error } = await query;
      if (error) throw error;
      return { applications: data ?? [] };
    }
    case 'applications.update': {
      const patch: Record<string, unknown> = {};
      const status = str(payload.status, 20);
      if (status) {
        patch.status = status;
        patch.reviewed_at = new Date().toISOString();
        patch.reviewed_by = str(payload.reviewed_by, 120);
      }
      if (payload.internal_notes !== undefined) patch.internal_notes = str(payload.internal_notes, 4000);
      const { error } = await supabase
        .from('member_applications')
        .update(patch)
        .eq('id', payload.id as string);
      if (error) throw error;
      return { ok: true };
    }
    case 'applications.approve': {
      const id = payload.id as string;
      const reviewer = str(payload.reviewed_by, 120) ?? '管理员';
      const { data: app, error } = await supabase
        .from('member_applications')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;

      // 人员去重：优先手机号，其次 Email，再次同名
      let personId = app.person_id as string | null;
      if (!personId && app.phone) {
        const { data } = await supabase.from('people').select('id').eq('phone', app.phone).limit(1);
        personId = data?.[0]?.id ?? null;
      }
      if (!personId && app.email) {
        const { data } = await supabase.from('people').select('id').eq('email', app.email).limit(1);
        personId = data?.[0]?.id ?? null;
      }
      if (!personId && payload.person_id) personId = payload.person_id as string;
      if (!personId) {
        const { data, error: insErr } = await supabase
          .from('people')
          .insert({
            full_name: app.full_name,
            gender: app.gender,
            birth_date: app.birth_date,
            phone: app.phone,
            wechat: app.wechat,
            email: app.email,
            marital_status: app.marital_status,
            occupation: app.occupation,
          })
          .select('id')
          .single();
        if (insErr) throw insErr;
        personId = data.id;
      }

      const joinedAt = nullableDate(payload.joined_at) ?? new Date().toISOString().slice(0, 10);
      const { data: existing } = await supabase
        .from('members')
        .select('*')
        .eq('person_id', personId)
        .maybeSingle();
      let memberId = existing?.id as string | undefined;
      if (existing) {
        const { error: upErr } = await supabase
          .from('members')
          .update({
            member_status: 'active',
            joined_at: existing.joined_at ?? joinedAt,
            approved_by: reviewer,
            approved_at: new Date().toISOString(),
            application_id: id,
          })
          .eq('id', existing.id);
        if (upErr) throw upErr;
      } else {
        const { data, error: mErr } = await supabase
          .from('members')
          .insert({
            person_id: personId,
            member_status: 'active',
            joined_at: joinedAt,
            baptism_status: app.is_baptized,
            baptism_date: app.baptism_date,
            baptism_church: app.baptism_church,
            faith_date: app.faith_date,
            application_id: id,
            approved_by: reviewer,
            approved_at: new Date().toISOString(),
          })
          .select('id')
          .single();
        if (mErr) throw mErr;
        memberId = data.id;
      }
      await supabase.from('member_status_history').insert({
        member_id: memberId,
        previous_status: existing?.member_status ?? null,
        new_status: 'active',
        effective_date: joinedAt,
        reason: '会友申请审核通过',
        changed_by: reviewer,
      });
      const { error: appErr } = await supabase
        .from('member_applications')
        .update({
          status: 'approved',
          person_id: personId,
          reviewed_by: reviewer,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (appErr) throw appErr;
      return { ok: true, person_id: personId, member_id: memberId };
    }

    /* ---------- 会友 ---------- */
    case 'members.list': {
      let query = supabase.from('members').select('*').order('joined_at', { ascending: false });
      const status = str(payload.status, 20);
      if (status && status !== 'all') query = query.eq('member_status', status);
      const { data: members, error } = await query;
      if (error) throw error;
      const personIds = (members ?? []).map((m) => m.person_id);
      const [{ data: people }, { data: hms }, { data: hhs }, { data: groups }] = await Promise.all([
        personIds.length ? supabase.from('people').select('*').in('id', personIds) : Promise.resolve({ data: [] }),
        supabase.from('household_members').select('person_id, household_id'),
        supabase.from('households').select('id, household_name'),
        supabase.from('youth_groups').select('id, name'),
      ]);
      const pMap = new Map((people ?? []).map((p) => [p.id, p]));
      const hMap = new Map((hhs ?? []).map((h) => [h.id, h.household_name]));
      const gMap = new Map((groups ?? []).map((g) => [g.id, g.name]));
      const q = (str(payload.q, 80) ?? '').toLowerCase();
      const groupId = str(payload.group_id, 60);
      const year = payload.year ? Number(payload.year) : null;
      let rows = (members ?? []).map((m) => {
        const p = pMap.get(m.person_id);
        const hm = (hms ?? []).find((h) => h.person_id === m.person_id);
        return {
          ...m,
          person: p ?? null,
          household_id: hm?.household_id ?? null,
          household_name: hm ? hMap.get(hm.household_id) ?? null : null,
          group_name: p?.group_id ? gMap.get(p.group_id) ?? null : null,
        };
      });
      if (q) {
        rows = rows.filter(
          (r) =>
            r.person?.full_name?.toLowerCase().includes(q) ||
            (r.person?.phone ?? '').includes(q) ||
            (r.person?.email ?? '').toLowerCase().includes(q),
        );
      }
      if (groupId && groupId !== 'all') rows = rows.filter((r) => r.person?.group_id === groupId);
      if (year) rows = rows.filter((r) => r.joined_at && new Date(r.joined_at).getFullYear() === year);
      return { members: rows };
    }
    case 'members.save': {
      const row = {
        member_number: str(payload.member_number, 60),
        joined_at: nullableDate(payload.joined_at),
        baptism_status: str(payload.baptism_status, 40),
        baptism_date: nullableDate(payload.baptism_date),
        baptism_church: str(payload.baptism_church, 160),
        faith_date: nullableDate(payload.faith_date),
      };
      const { error } = await supabase.from('members').update(row).eq('id', payload.id as string);
      if (error) throw error;
      return { ok: true };
    }
    case 'members.create': {
      const personId = payload.person_id as string;
      if (!personId) throw new Error('请先选择人员');
      const { data: existing } = await supabase
        .from('members')
        .select('id')
        .eq('person_id', personId)
        .maybeSingle();
      if (existing) throw new Error('该人员已经是会友');
      const joinedAt = nullableDate(payload.joined_at) ?? new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('members')
        .insert({ person_id: personId, member_status: 'active', joined_at: joinedAt, approved_by: str(payload.changed_by, 120) })
        .select('id')
        .single();
      if (error) throw error;
      await supabase.from('member_status_history').insert({
        member_id: data.id,
        new_status: 'active',
        effective_date: joinedAt,
        reason: '后台直接建立会友身份',
        changed_by: str(payload.changed_by, 120),
      });
      return { ok: true, id: data.id };
    }
    case 'members.changeStatus': {
      const id = payload.id as string;
      const newStatus = str(payload.new_status, 20);
      if (!newStatus) throw new Error('请选择新状态');
      const { data: member, error } = await supabase.from('members').select('*').eq('id', id).single();
      if (error) throw error;
      const effective = nullableDate(payload.effective_date) ?? new Date().toISOString().slice(0, 10);
      const { error: upErr } = await supabase
        .from('members')
        .update({ member_status: newStatus })
        .eq('id', id);
      if (upErr) throw upErr;
      const { error: hErr } = await supabase.from('member_status_history').insert({
        member_id: id,
        previous_status: member.member_status,
        new_status: newStatus,
        effective_date: effective,
        reason: str(payload.reason, 500),
        note: str(payload.note, 4000),
        changed_by: str(payload.changed_by, 120),
      });
      if (hErr) throw hErr;
      return { ok: true };
    }
    case 'members.history': {
      const { data, error } = await supabase
        .from('member_status_history')
        .select('*')
        .eq('member_id', payload.member_id as string)
        .order('effective_date', { ascending: false });
      if (error) throw error;
      return { history: data ?? [] };
    }

    /* ================= 家庭会友申请（以家庭为单位） ================= */
    case 'hhapps.list': {
      let query = supabase
        .from('household_membership_applications')
        .select('*')
        .order('created_at', { ascending: false });
      const status = str(payload.status, 40);
      if (status && status !== 'all') query = query.eq('status', status);
      const q = str(payload.q, 80);
      if (q)
        query = query.or(
          `household_name.ilike.${like(q)},applicant_name.ilike.${like(q)},phone.ilike.${like(q)},email.ilike.${like(q)}`,
        );
      const { data, error } = await query;
      if (error) throw error;
      return { applications: data ?? [] };
    }
    case 'hhapps.update': {
      const patch: Record<string, unknown> = {};
      const status = str(payload.status, 40);
      if (status) {
        if (!HH_APP_STATUSES.has(status)) throw new Error('状态无效');
        patch.status = status;
        patch.reviewed_at = new Date().toISOString();
        patch.reviewed_by = str(payload.reviewed_by, 120);
      }
      if (payload.internal_notes !== undefined) patch.internal_notes = str(payload.internal_notes, 4000);
      const { error } = await supabase
        .from('household_membership_applications')
        .update(patch)
        .eq('id', payload.id as string);
      if (error) throw error;
      return { ok: true };
    }
    /** 审核通过 → 进入「待完善家庭成员资料」，不直接成为会友家庭 */
    case 'hhapps.approve': {
      const id = payload.id as string;
      const { data, error } = await supabase
        .from('household_membership_applications')
        .update({
          status: 'approved_pending_profile',
          reviewed_by: str(payload.reviewed_by, 120),
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('profile_token')
        .single();
      if (error) throw error;
      return { ok: true, profile_token: data.profile_token };
    }

    /* ---------- 家庭成员资料填写（公开安全链接 / 后台协助） ---------- */
    case 'profile.get': {
      const token = str(payload.token, 80) ?? '';
      if (!token) throw new Error('链接无效');
      const { data, error } = await supabase
        .from('household_membership_applications')
        .select('id, household_name, applicant_name, phone, wechat, email, address, current_group, status, profile_submitted_at')
        .eq('profile_token', token)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('链接无效或已失效');
      const { data: groups } = await supabase.from('youth_groups').select('id, name').order('sort_order');
      return { application: data, groups: groups ?? [] };
    }
    case 'profile.submit': {
      const token = str(payload.token, 80) ?? '';
      const { data: app, error: appErr } = await supabase
        .from('household_membership_applications')
        .select('*')
        .eq('profile_token', token)
        .maybeSingle();
      if (appErr) throw appErr;
      if (!app) throw new Error('链接无效或已失效');
      if (!['approved_pending_profile', 'active'].includes(app.status))
        throw new Error('该申请当前不可填写家庭成员资料');

      const rawMembers = Array.isArray(payload.members) ? (payload.members as Record<string, unknown>[]) : [];
      const members = rawMembers.filter((m) => str(m.full_name, 120));
      if (!members.length) throw new Error('请至少填写一位家庭成员');

      const householdPatch = {
        household_name: str(payload.household_name, 160) || app.household_name,
        address: str(payload.address, 400) ?? app.address,
        group_id: (payload.group_id as string) || null,
        phone: app.phone,
        wechat: app.wechat,
        email: app.email,
        attending_since: app.attending_duration,
        application_id: app.id,
      };

      // 1) 建立或更新 Household
      let householdId = app.household_id as string | null;
      if (householdId) {
        const { error } = await supabase.from('households').update(householdPatch).eq('id', householdId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('households').insert(householdPatch).select('id').single();
        if (error) throw error;
        householdId = data.id;
      }

      // 2) 逐一进行 People 查重 / 创建，并建立家庭关系
      let primaryContactId: string | null = null;
      for (const m of members) {
        const personFields = {
          full_name: str(m.full_name, 120)!,
          gender: str(m.gender, 20),
          birth_date: nullableDate(m.birth_date),
          phone: str(m.phone, 40),
          wechat: str(m.wechat, 80),
          email: str(m.email, 160),
          occupation: str(m.occupation, 120),
          marital_status: str(m.marital_status, 40),
          address: householdPatch.address,
          is_believer: str(m.is_believer, 20),
          faith_date: nullableDate(m.faith_date),
          is_baptized: str(m.is_baptized, 20),
          baptism_date: nullableDate(m.baptism_date),
          baptism_church: str(m.baptism_church, 160),
          is_serving: m.is_serving === true,
          serving_notes: str(m.serving_notes, 1000),
          school: str(m.school, 160),
          grade: str(m.grade, 60),
          notes: str(m.notes, 2000),
          group_id: (m.group_id as string) || householdPatch.group_id,
        };
        const personId = await findOrCreatePerson(personFields, m.person_id as string | undefined);
        const isPrimary = m.is_primary_contact === true;
        if (isPrimary) primaryContactId = personId;
        const { error: hmErr } = await supabase.from('household_members').upsert(
          {
            household_id: householdId,
            person_id: personId,
            relationship: str(m.relationship, 40) ?? '其他',
            is_primary_contact: isPrimary,
          },
          { onConflict: 'household_id,person_id' },
        );
        if (hmErr) throw hmErr;
      }

      // 3) Household 获得正式会友身份 + 状态历史
      const effective = new Date().toISOString().slice(0, 10);
      const { data: before } = await supabase
        .from('households')
        .select('membership_status')
        .eq('id', householdId)
        .single();
      const { error: upErr } = await supabase
        .from('households')
        .update({
          primary_contact_id: primaryContactId,
          membership_status: 'active',
          membership_date: effective,
          approved_by: app.reviewed_by,
          approved_at: new Date().toISOString(),
        })
        .eq('id', householdId);
      if (upErr) throw upErr;
      if (before?.membership_status !== 'active') {
        await supabase.from('household_membership_status_history').insert({
          household_id: householdId,
          previous_status: before?.membership_status ?? null,
          new_status: 'active',
          effective_date: effective,
          reason: '家庭成员资料完成，正式成为会友家庭',
          changed_by: app.reviewed_by ?? '系统',
        });
      }
      await supabase
        .from('household_membership_applications')
        .update({ status: 'active', household_id: householdId, profile_submitted_at: new Date().toISOString() })
        .eq('id', app.id);

      return { ok: true, household_id: householdId };
    }

    /* ---------- 会友名册（家庭） ---------- */
    case 'roster.list': {
      const cfg = await ageConfig();
      let query = supabase.from('households').select('*').order('membership_date', { ascending: false }).limit(1000);
      const status = str(payload.membership_status, 40);
      if (status && status !== 'all') query = query.eq('membership_status', status);
      const { data: hhs, error } = await query;
      if (error) throw error;
      const [{ data: hms }, { data: groups }] = await Promise.all([
        supabase.from('household_members').select('*'),
        supabase.from('youth_groups').select('id, name'),
      ]);
      const pids = [...new Set((hms ?? []).map((r) => r.person_id))];
      const { data: ppl } = pids.length
        ? await supabase.from('people').select('*').in('id', pids)
        : { data: [] as Record<string, any>[] };
      const pMap = new Map((ppl ?? []).map((p) => [p.id, decoratePerson(p, cfg)]));
      const gMap = new Map((groups ?? []).map((g) => [g.id, g.name]));
      let rows = (hhs ?? []).map((h) => {
        const mems = (hms ?? [])
          .filter((m) => m.household_id === h.id)
          .map((m) => ({ ...m, person: pMap.get(m.person_id) ?? null }));
        const counts = { adult: 0, youth: 0, child: 0 };
        mems.forEach((m) => {
          const g = m.person?.age_group;
          if (g && g in counts) counts[g as keyof typeof counts]++;
        });
        const primary = mems.find((m) => m.is_primary_contact)?.person ?? mems[0]?.person ?? null;
        return {
          ...h,
          group_name: h.group_id ? gMap.get(h.group_id) ?? null : null,
          members: mems,
          member_count: mems.length,
          counts,
          primary_contact: primary,
          contact_phone: primary?.phone ?? h.phone ?? null,
        };
      });
      const q = (str(payload.q, 80) ?? '').toLowerCase();
      if (q) {
        rows = rows.filter(
          (h) =>
            (h.household_name ?? '').toLowerCase().includes(q) ||
            (h.contact_phone ?? '').includes(q) ||
            h.members.some(
              (m) =>
                (m.person?.full_name ?? '').toLowerCase().includes(q) || (m.person?.phone ?? '').includes(q),
            ),
        );
      }
      const groupId = str(payload.group_id, 60);
      if (groupId && groupId !== 'all') rows = rows.filter((h) => h.group_id === groupId);
      const year = payload.year ? Number(payload.year) : null;
      if (year) rows = rows.filter((h) => h.membership_date && Number(h.membership_date.slice(0, 4)) === year);
      return { households: rows };
    }
    case 'roster.changeStatus': {
      const id = payload.id as string;
      const newStatus = str(payload.new_status, 40);
      if (!newStatus || !HH_STATUSES.has(newStatus)) throw new Error('状态无效');
      const { data: h, error } = await supabase
        .from('households')
        .select('membership_status')
        .eq('id', id)
        .single();
      if (error) throw error;
      const effective = nullableDate(payload.effective_date) ?? new Date().toISOString().slice(0, 10);
      const patch: Record<string, unknown> = { membership_status: newStatus };
      if (newStatus === 'active') patch.membership_date = effective;
      const { error: upErr } = await supabase.from('households').update(patch).eq('id', id);
      if (upErr) throw upErr;
      const { error: hErr } = await supabase.from('household_membership_status_history').insert({
        household_id: id,
        previous_status: h.membership_status,
        new_status: newStatus,
        effective_date: effective,
        reason: str(payload.reason, 500),
        internal_note: str(payload.internal_note, 4000),
        changed_by: str(payload.changed_by, 120) ?? '管理员',
      });
      if (hErr) throw hErr;
      return { ok: true };
    }
    case 'roster.history': {
      const { data, error } = await supabase
        .from('household_membership_status_history')
        .select('*')
        .eq('household_id', payload.household_id as string)
        .order('effective_date', { ascending: false });
      if (error) throw error;
      return { history: data ?? [] };
    }

    /* ---------- 青少年事工联动（关联，不复制） ---------- */
    case 'youth.link': {
      const ids = Array.isArray(payload.person_ids)
        ? (payload.person_ids as string[])
        : [payload.person_id as string].filter(Boolean);
      if (!ids.length) throw new Error('请选择人员');
      const linked: string[] = [];
      for (const pid of ids) {
        const { data: existing } = await supabase
          .from('youth_members')
          .select('id')
          .eq('person_id', pid)
          .maybeSingle();
        if (existing) { linked.push(pid); continue; }
        const { data: person, error } = await supabase.from('people').select('*').eq('id', pid).single();
        if (error) throw error;
        // 先尝试与现有青少年档案（尚未关联）匹配，避免重复创建
        let match: { id: string } | null = null;
        const { data: candidates } = await supabase
          .from('youth_members')
          .select('id, full_name, birth_date, person_id')
          .is('person_id', null)
          .eq('full_name', person.full_name);
        if (candidates?.length) {
          match =
            candidates.find((c) => person.birth_date && c.birth_date === person.birth_date) ?? candidates[0];
        }
        if (match) {
          const { error: linkErr } = await supabase
            .from('youth_members')
            .update({ person_id: pid })
            .eq('id', match.id);
          if (linkErr) throw linkErr;
        } else {
          const { error: insErr } = await supabase.from('youth_members').insert({
            person_id: pid,
            full_name: person.full_name,
            gender: person.gender,
            birth_date: person.birth_date,
            contact: person.phone,
            school: person.school,
            grade: person.grade,
            faith_status: person.is_baptized === '是' ? '已受洗' : person.is_believer === '是' ? '已信主' : null,
            group_id: person.group_id,
            profile_status: 'active',
            interests: [],
            service_interests: [],
            guardian_consent: false,
            contact_consent: false,
            first_attended_date: new Date().toISOString().slice(0, 10),
          });
          if (insErr) throw insErr;
        }
        linked.push(pid);
      }
      return { ok: true, linked };
    }

    /* ---------- 年龄分段设置 ---------- */
    case 'settings.get': {
      const cfg = await ageConfig(true);
      return { age_groups: cfg };
    }
    case 'settings.saveAgeGroups': {
      const childMax = Number(payload.child_max);
      const youthMax = Number(payload.youth_max);
      if (!Number.isFinite(childMax) || !Number.isFinite(youthMax) || childMax >= youthMax)
        throw new Error('年龄范围无效：儿童上限须小于青少年上限');
      const { error } = await supabase
        .from('app_settings')
        .upsert({ key: 'age_groups', value: { child_max: childMax, youth_max: youthMax } }, { onConflict: 'key' });
      if (error) throw error;
      ageCfgCache = null;
      return { ok: true };
    }

    /* ---------- 探访 ---------- */

    case 'visits.create': {
      const visitType = payload.visit_type === 'person' ? 'person' : 'household';
      const householdId = visitType === 'household' ? (payload.household_id as string) || null : null;
      const primaryPersonId = visitType === 'person' ? (payload.primary_person_id as string) || null : null;
      if (visitType === 'household' && !householdId) throw new Error('请选择探访家庭');
      if (visitType === 'person' && !primaryPersonId) throw new Error('请选择探访对象');
      const notes = str(payload.notes, 8000) ?? '';
      const { data: visit, error } = await supabase
        .from('visits')
        .insert({
          visit_type: visitType,
          household_id: householdId,
          primary_person_id: primaryPersonId,
          visit_date: nullableDate(payload.visit_date) ?? new Date().toISOString().slice(0, 10),
          visit_time: str(payload.visit_time, 10),
          visit_method: str(payload.visit_method, 30) ?? 'home',
          notes,
          recorder_id: (payload.recorder_id as string) || null,
          recorder_name: str(payload.recorder_name, 120),
          follow_up_required: payload.follow_up_required === true,
          follow_up_date: payload.follow_up_required === true ? nullableDate(payload.follow_up_date) : null,
          follow_up_note: payload.follow_up_required === true ? str(payload.follow_up_note, 4000) : null,
          follow_up_status: payload.follow_up_required === true ? 'pending' : 'none',
        })
        .select('id')
        .single();
      if (error) throw error;

      const personIds = Array.isArray(payload.person_ids)
        ? (payload.person_ids as string[]).filter((x) => typeof x === 'string')
        : [];
      const contacted = visitType === 'person' && primaryPersonId ? [...new Set([primaryPersonId, ...personIds])] : personIds;
      if (contacted.length) {
        const { error: pErr } = await supabase
          .from('visit_people')
          .insert(contacted.map((pid) => ({ visit_id: visit.id, person_id: pid })));
        if (pErr) throw pErr;
      }
      const visitors = Array.isArray(payload.visitors) ? (payload.visitors as Record<string, unknown>[]) : [];
      if (visitors.length) {
        const { error: vErr } = await supabase.from('visit_visitors').insert(
          visitors.map((v) => ({
            visit_id: visit.id,
            visitor_id: (v.visitor_id as string) || null,
            visitor_name: str(v.visitor_name, 120) ?? '',
          })),
        );
        if (vErr) throw vErr;
      }
      const expenses = Array.isArray(payload.expenses) ? (payload.expenses as Record<string, unknown>[]) : [];
      const validExpenses = expenses.filter((e) => Number(e.amount) > 0 || str(e.description, 200));
      if (validExpenses.length) {
        const { error: eErr } = await supabase.from('visit_expenses').insert(
          validExpenses.map((e) => ({
            visit_id: visit.id,
            expense_type: str(e.expense_type, 40),
            description: str(e.description, 300) ?? '',
            amount: Number(e.amount) || 0,
            paid_by: str(e.paid_by, 120),
          })),
        );
        if (eErr) throw eErr;
      }
      return { ok: true, id: visit.id };
    }
    case 'visits.list': {
      let query = supabase.from('visits').select('*').order('visit_date', { ascending: false }).limit(500);
      if (payload.from) query = query.gte('visit_date', payload.from as string);
      if (payload.to) query = query.lte('visit_date', payload.to as string);
      if (payload.household_id) query = query.eq('household_id', payload.household_id as string);
      const method = str(payload.visit_method, 30);
      if (method && method !== 'all') query = query.eq('visit_method', method);
      if (payload.follow_up === 'yes') query = query.eq('follow_up_required', true);
      if (payload.follow_up === 'no') query = query.eq('follow_up_required', false);
      const { data, error } = await query;
      if (error) throw error;
      let rows = await decorateVisits(data ?? []);
      const visitorId = str(payload.visitor_id, 60);
      if (visitorId && visitorId !== 'all') {
        rows = rows.filter((r) => r.visitors.some((v: Record<string, unknown>) => v.visitor_id === visitorId));
      }
      const personId = str(payload.person_id, 60);
      if (personId) {
        rows = rows.filter(
          (r) => r.primary_person_id === personId || r.people.some((p: Record<string, unknown>) => p!.id === personId),
        );
      }
      if (payload.has_expense === 'yes') rows = rows.filter((r) => r.expense_total > 0);
      if (payload.has_expense === 'no') rows = rows.filter((r) => r.expense_total === 0);
      const q = (str(payload.q, 80) ?? '').toLowerCase();
      if (q) {
        rows = rows.filter(
          (r) =>
            (r.household_name ?? '').toLowerCase().includes(q) ||
            (r.primary_person?.full_name ?? '').toLowerCase().includes(q) ||
            r.people.some((p: Record<string, unknown>) => String(p!.full_name).toLowerCase().includes(q)),
        );
      }
      return { visits: rows };
    }
    case 'visits.detail': {
      const rows = await loadVisits([payload.id as string]);
      return { visit: rows[0] ?? null };
    }
    case 'visits.followUps': {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('follow_up_required', true)
        .neq('follow_up_status', 'completed')
        .order('follow_up_date', { ascending: true });
      if (error) throw error;
      return { visits: await decorateVisits(data ?? []) };
    }
    case 'visits.completeFollowUp': {
      const { error } = await supabase
        .from('visits')
        .update({
          follow_up_status: 'completed',
          follow_up_completed_by: str(payload.completed_by, 120),
          follow_up_completed_at: nullableDate(payload.completed_at) ?? new Date().toISOString().slice(0, 10),
          follow_up_completed_note: str(payload.completed_note, 4000),
        })
        .eq('id', payload.id as string);
      if (error) throw error;
      return { ok: true };
    }
    case 'visits.updateFollowUp': {
      const { error } = await supabase
        .from('visits')
        .update({
          follow_up_required: payload.follow_up_required === true,
          follow_up_date: nullableDate(payload.follow_up_date),
          follow_up_note: str(payload.follow_up_note, 4000),
          follow_up_status: payload.follow_up_required === true ? 'pending' : 'none',
        })
        .eq('id', payload.id as string);
      if (error) throw error;
      return { ok: true };
    }

    /* ---------- Dashboard（以家庭为单位） ---------- */
    case 'dashboard': {
      const now = new Date();
      const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10);
      const cfg = await ageConfig();
      const [
        { data: activeHouseholds },
        { count: pendingApps },
        { count: pendingProfiles },
        { data: monthVisits },
        { data: recentApps },
        { data: recentVisitRows },
        { data: recentHistory },
        { data: followUpRows },
        { data: recentHouseholds },
      ] = await Promise.all([
        supabase.from('households').select('id, household_name, membership_date').eq('membership_status', 'active'),
        supabase
          .from('household_membership_applications')
          .select('id', { count: 'exact', head: true })
          .in('status', ['pending', 'reviewing']),
        supabase
          .from('household_membership_applications')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'approved_pending_profile'),
        supabase.from('visits').select('id, household_id').gte('visit_date', monthStart),
        supabase
          .from('household_membership_applications')
          .select('id, household_name, applicant_name, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.from('visits').select('*').order('visit_date', { ascending: false }).limit(5),
        supabase
          .from('household_membership_status_history')
          .select('*, households(household_name)')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('visits')
          .select('*')
          .eq('follow_up_required', true)
          .neq('follow_up_status', 'completed')
          .order('follow_up_date', { ascending: true })
          .limit(5),
        supabase
          .from('households')
          .select('id, household_name, membership_date, membership_status')
          .eq('membership_status', 'active')
          .order('membership_date', { ascending: false })
          .limit(5),
      ]);

      const activeIds = (activeHouseholds ?? []).map((h) => h.id);
      let totals = { people: 0, adult: 0, youth: 0, child: 0 };
      if (activeIds.length) {
        const { data: hms } = await supabase.from('household_members').select('person_id').in('household_id', activeIds);
        const pids = [...new Set((hms ?? []).map((r) => r.person_id))];
        if (pids.length) {
          const { data: ppl } = await supabase.from('people').select('id, birth_date').in('id', pids);
          totals.people = (ppl ?? []).length;
          (ppl ?? []).forEach((p) => {
            const g = groupOf(ageOf(p.birth_date), cfg);
            if (g === 'adult') totals.adult++;
            else if (g === 'youth') totals.youth++;
            else if (g === 'child') totals.child++;
          });
        }
      }

      const monthVisitIds = (monthVisits ?? []).map((v) => v.id);
      let monthExpense = 0;
      if (monthVisitIds.length) {
        const { data } = await supabase.from('visit_expenses').select('amount').in('visit_id', monthVisitIds);
        monthExpense = (data ?? []).reduce((s, e) => s + Number(e.amount || 0), 0);
      }

      return {
        stats: {
          member_households: activeIds.length,
          member_people: totals.people,
          adults: totals.adult,
          youths: totals.youth,
          children: totals.child,
          pending_applications: pendingApps ?? 0,
          pending_profiles: pendingProfiles ?? 0,
          new_households_this_month: (activeHouseholds ?? []).filter(
            (h) => h.membership_date && h.membership_date >= monthStart,
          ).length,
          visits_this_month: monthVisitIds.length,
          visit_households_this_month: new Set((monthVisits ?? []).map((v) => v.household_id).filter(Boolean)).size,
          visit_expense_this_month: monthExpense,
          pending_follow_ups: (followUpRows ?? []).length,
        },
        recent_applications: recentApps ?? [],
        recent_households: recentHouseholds ?? [],
        recent_visits: await decorateVisits(recentVisitRows ?? []),
        upcoming_follow_ups: await decorateVisits(followUpRows ?? []),
        recent_status_changes: (recentHistory ?? []).map((h: Record<string, any>) => ({
          ...h,
          household_name: h.households?.household_name ?? '',
        })),
      };
    }


    /* ---------- 小组（复用现有小组表） ---------- */
    case 'groups.list': {
      const { data, error } = await supabase.from('youth_groups').select('id, name').order('sort_order');
      if (error) throw error;
      return { groups: data ?? [] };
    }

    default:
      throw new Error(`未知操作: ${action}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const password = typeof body.password === 'string' ? body.password : '';
    const action = typeof body.action === 'string' ? body.action : '';
    const payload = (body.payload ?? {}) as Record<string, unknown>;

    if (!action) return json({ error: '缺少操作' }, 400);

    // 公开动作：仅凭安全链接 token 访问自己家庭的资料填写
    if (PUBLIC_ACTIONS.has(action)) {
      const result = await handle(action, payload, 'public');
      return json({ role: 'public', ...(result as Record<string, unknown>) });
    }

    const adminPassword = Deno.env.get('ADMIN_PASSWORD');
    const visitPassword = Deno.env.get('VISIT_PASSWORD');
    if (!adminPassword) return json({ error: '服务端未配置密码' }, 500);

    let role: Role | null = null;
    if (password && password === adminPassword) role = 'admin';
    else if (visitPassword && password && password === visitPassword) role = 'visit';

    if (!role) return json({ error: '密码错误' }, 401);
    if (role === 'visit' && !VISIT_ACTIONS.has(action)) return json({ error: '无权限执行此操作' }, 403);

    const result = await handle(action, payload, role);
    return json({ role, ...(result as Record<string, unknown>) });
  } catch (e) {
    const message = e instanceof Error ? e.message : '请求失败';
    return json({ error: message }, 400);
  }
});

