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

type Role = 'admin' | 'visit';

// Actions the visitation portal (visit password) may call.
const VISIT_ACTIONS = new Set([
  'verify',
  'staff.list',
  'households.search',
  'households.members',
  'people.search',
  'visits.create',
]);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } },
);

const str = (v: unknown, max = 4000) =>
  typeof v === 'string' ? v.slice(0, max) : null;
const nullableDate = (v: unknown) => (typeof v === 'string' && v ? v : null);
const like = (s: string) => `%${s.replace(/[%,]/g, '')}%`;

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
      const { data: household, error } = await supabase.from('households').select('*').eq('id', id).single();
      if (error) throw error;
      const { data: hms } = await supabase.from('household_members').select('*').eq('household_id', id);
      const personIds = (hms ?? []).map((h) => h.person_id);
      const [{ data: fullPeople }, { data: members }] = await Promise.all([
        personIds.length ? supabase.from('people').select('*').in('id', personIds) : Promise.resolve({ data: [] }),
        personIds.length
          ? supabase.from('members').select('*').in('person_id', personIds)
          : Promise.resolve({ data: [] }),
      ]);
      const pMap = new Map((fullPeople ?? []).map((p) => [p.id, p]));
      const mMap = new Map((members ?? []).map((m) => [m.person_id, m]));
      const visits = await visitsForPersonIds([], [id]);
      return {
        household,
        members: (hms ?? []).map((m) => ({
          ...m,
          person: pMap.get(m.person_id) ?? null,
          member: mMap.get(m.person_id) ?? null,
        })),
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

    /* ---------- Dashboard ---------- */
    case 'dashboard': {
      const now = new Date();
      const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10);
      const [
        { count: activeMembers },
        { count: households },
        { count: newMembers },
        { count: pendingApps },
        { data: monthVisits },
        { data: recentApps },
        { data: recentVisitRows },
        { data: recentHistory },
        { data: followUpRows },
      ] = await Promise.all([
        supabase.from('members').select('id', { count: 'exact', head: true }).eq('member_status', 'active'),
        supabase.from('households').select('id', { count: 'exact', head: true }),
        supabase
          .from('members')
          .select('id', { count: 'exact', head: true })
          .eq('member_status', 'active')
          .gte('joined_at', monthStart),
        supabase
          .from('member_applications')
          .select('id', { count: 'exact', head: true })
          .in('status', ['pending', 'reviewing']),
        supabase.from('visits').select('id').gte('visit_date', monthStart),
        supabase
          .from('member_applications')
          .select('id, full_name, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.from('visits').select('*').order('visit_date', { ascending: false }).limit(5),
        supabase.from('member_status_history').select('*').order('created_at', { ascending: false }).limit(5),
        supabase
          .from('visits')
          .select('*')
          .eq('follow_up_required', true)
          .neq('follow_up_status', 'completed')
          .order('follow_up_date', { ascending: true })
          .limit(5),
      ]);
      const monthVisitIds = (monthVisits ?? []).map((v) => v.id);
      let monthExpense = 0;
      if (monthVisitIds.length) {
        const { data } = await supabase.from('visit_expenses').select('amount').in('visit_id', monthVisitIds);
        monthExpense = (data ?? []).reduce((s, e) => s + Number(e.amount || 0), 0);
      }
      const historyMemberIds = [...new Set((recentHistory ?? []).map((h) => h.member_id))];
      let historyNames: Record<string, string> = {};
      if (historyMemberIds.length) {
        const { data: ms } = await supabase.from('members').select('id, person_id').in('id', historyMemberIds);
        const people = await personSummaries((ms ?? []).map((m) => m.person_id));
        const pMap = new Map(people.map((p) => [p.id, p.full_name]));
        historyNames = Object.fromEntries((ms ?? []).map((m) => [m.id, pMap.get(m.person_id) ?? '']));
      }
      return {
        stats: {
          active_members: activeMembers ?? 0,
          households: households ?? 0,
          new_members_this_month: newMembers ?? 0,
          pending_applications: pendingApps ?? 0,
          visits_this_month: monthVisitIds.length,
          visit_expense_this_month: monthExpense,
          pending_follow_ups: (followUpRows ?? []).length,
        },
        recent_applications: recentApps ?? [],
        recent_visits: await decorateVisits(recentVisitRows ?? []),
        upcoming_follow_ups: await decorateVisits(followUpRows ?? []),
        recent_status_changes: (recentHistory ?? []).map((h) => ({ ...h, person_name: historyNames[h.member_id] ?? '' })),
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

