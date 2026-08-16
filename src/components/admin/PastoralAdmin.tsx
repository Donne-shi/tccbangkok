import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  pastoralApi, APPLICATION_STATUS_LABELS, MEMBER_STATUS_LABELS,
  VISIT_METHOD_LABELS, EXPENSE_TYPE_LABELS, RELATIONSHIP_OPTIONS,
} from '@/lib/pastoral';

const sel = 'h-10 rounded-md border border-input bg-background px-3 text-sm';
const today = () => new Date().toISOString().slice(0, 10);

/* ───────── 概览 ───────── */
function Overview() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { pastoralApi('dashboard').then(setData).catch(() => {}); }, []);
  if (!data) return <Loader2 className="h-5 w-5 animate-spin" />;
  const s = data.stats;
  const cards = [
    ['在册会友', s.active_members], ['家庭数', s.households],
    ['本月新增会友', s.new_members_this_month], ['待处理申请', s.pending_applications],
    ['本月探访', s.visits_this_month], ['待跟进', s.pending_follow_ups],
    ['本月探访支出', `฿${Number(s.visit_expense_this_month).toFixed(2)}`],
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map(([label, value]) => (
          <Card key={label as string}><CardContent className="pt-5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold">{value as any}</p>
          </CardContent></Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-base">最近申请</CardTitle></CardHeader><CardContent className="space-y-1 text-sm">
          {data.recent_applications.map((a: any) => (
            <p key={a.id}>{a.full_name} · {APPLICATION_STATUS_LABELS[a.status] ?? a.status} · {a.created_at.slice(0, 10)}</p>
          ))}
          {!data.recent_applications.length && <p className="text-muted-foreground">暂无</p>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">待跟进探访</CardTitle></CardHeader><CardContent className="space-y-1 text-sm">
          {data.upcoming_follow_ups.map((v: any) => (
            <p key={v.id}>{v.household_name || v.primary_person?.full_name} · {v.follow_up_date || '未定日期'}</p>
          ))}
          {!data.upcoming_follow_ups.length && <p className="text-muted-foreground">暂无</p>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">最近探访</CardTitle></CardHeader><CardContent className="space-y-1 text-sm">
          {data.recent_visits.map((v: any) => (
            <p key={v.id}>{v.visit_date} · {v.household_name || v.primary_person?.full_name} · {VISIT_METHOD_LABELS[v.visit_method] ?? v.visit_method}</p>
          ))}
          {!data.recent_visits.length && <p className="text-muted-foreground">暂无</p>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">最近会籍变动</CardTitle></CardHeader><CardContent className="space-y-1 text-sm">
          {data.recent_status_changes.map((h: any) => (
            <p key={h.id}>{h.person_name} · {MEMBER_STATUS_LABELS[h.new_status] ?? h.new_status} · {h.effective_date}</p>
          ))}
          {!data.recent_status_changes.length && <p className="text-muted-foreground">暂无</p>}
        </CardContent></Card>
      </div>
    </div>
  );
}

/* ───────── 会友申请 ───────── */
function Applications() {
  const { toast } = useToast();
  const [status, setStatus] = useState('pending');
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows((await pastoralApi('applications.list', { status, q })).applications); }
    catch (e: any) { toast({ title: '加载失败', description: e.message, variant: 'destructive' }); }
    setLoading(false);
  }, [status, q, toast]);
  useEffect(() => { load(); }, [load]);

  const act = async (action: string, payload: any) => {
    try {
      await pastoralApi(action, { ...payload, reviewed_by: '管理员' });
      toast({ title: '已更新' }); setOpen(null); load();
    } catch (e: any) { toast({ title: '操作失败', description: e.message, variant: 'destructive' }); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">全部</option>
          {Object.entries(APPLICATION_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Input className="max-w-xs" placeholder="姓名/电话/邮箱" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="outline" onClick={load}><Search className="h-4 w-4" /></Button>
      </div>
      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
      <div className="space-y-2">
        {rows.map((a) => (
          <Card key={a.id}><CardContent className="pt-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-medium">{a.full_name} <span className="text-sm text-muted-foreground">{a.phone}</span></p>
              <p className="text-xs text-muted-foreground">
                {APPLICATION_STATUS_LABELS[a.status] ?? a.status} · 提交于 {a.created_at.slice(0, 10)} · 聚会时长：{a.attending_duration || '—'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setOpen(a)}>查看</Button>
              {a.status !== 'approved' && (
                <Button size="sm" onClick={() => act('applications.approve', { id: a.id, joined_at: today() })}>通过入会</Button>
              )}
            </div>
          </CardContent></Card>
        ))}
        {!rows.length && !loading && <p className="text-sm text-muted-foreground">暂无申请</p>}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-auto p-4" onClick={() => setOpen(null)}>
          <Card className="w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{open.full_name} 的申请</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setOpen(null)}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ['性别', open.gender], ['出生日期', open.birth_date], ['电话', open.phone], ['微信/Line', open.wechat],
                ['邮箱', open.email], ['婚姻', open.marital_status], ['职业', open.occupation],
                ['已信主', open.is_believer], ['信主日期', open.faith_date], ['已受洗', open.is_baptized],
                ['受洗日期', open.baptism_date], ['受洗教会', open.baptism_church],
                ['聚会时长', open.attending_duration], ['团契小组', open.current_group],
                ['认同信仰告白', open.agrees_confession], ['同意会友之约', open.agrees_covenant ? '是' : '否'],
              ].map(([k, v]) => <p key={k as string}><span className="text-muted-foreground">{k}：</span>{(v as any) || '—'}</p>)}
              <div><p className="text-muted-foreground">信仰经历与申请原因：</p><p className="whitespace-pre-wrap">{open.reason || '—'}</p></div>
              <div>
                <Label>内部备注（面谈记录）</Label>
                <Textarea rows={3} defaultValue={open.internal_notes ?? ''} onBlur={(e) => act('applications.update', { id: open.id, internal_notes: e.target.value })} />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {['pending', 'reviewing', 'rejected'].map((s) => (
                  <Button key={s} size="sm" variant="outline" onClick={() => act('applications.update', { id: open.id, status: s })}>
                    标记为{APPLICATION_STATUS_LABELS[s]}
                  </Button>
                ))}
                <Button size="sm" onClick={() => act('applications.approve', { id: open.id, joined_at: today() })}>通过并建立会友档案</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ───────── 人员库 ───────── */
const emptyPerson = { full_name: '', gender: '', birth_date: '', phone: '', wechat: '', email: '', occupation: '', marital_status: '', address: '', notes: '' };

function People() {
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);

  const load = useCallback(async () => {
    try { setRows((await pastoralApi('people.search', { q })).people); }
    catch (e: any) { toast({ title: '加载失败', description: e.message, variant: 'destructive' }); }
  }, [q, toast]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    try {
      await pastoralApi('people.save', editing);
      toast({ title: '已保存' }); setEditing(null); load();
    } catch (e: any) { toast({ title: '保存失败', description: e.message, variant: 'destructive' }); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="姓名/电话/邮箱" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="outline" onClick={load}><Search className="h-4 w-4" /></Button>
        <Button onClick={() => setEditing({ ...emptyPerson })}><Plus className="h-4 w-4 mr-1" />新增人员</Button>
      </div>
      <div className="space-y-2">
        {rows.map((p) => (
          <Card key={p.id}><CardContent className="pt-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-medium">{p.full_name} <span className="text-sm text-muted-foreground">{p.phone}</span></p>
              <p className="text-xs text-muted-foreground">
                {p.member ? MEMBER_STATUS_LABELS[p.member.member_status] ?? p.member.member_status : '慕道友/未入会'}
                {p.household_name ? ` · ${p.household_name}` : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={async () => setDetail(await pastoralApi('people.detail', { id: p.id }))}>档案</Button>
              <Button size="sm" variant="outline" onClick={() => setEditing({ ...p })}>编辑</Button>
              <Button size="sm" variant="ghost" onClick={async () => {
                if (!confirm(`删除 ${p.full_name}？相关记录也会一并删除。`)) return;
                await pastoralApi('people.delete', { id: p.id }); load();
              }}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardContent></Card>
        ))}
        {!rows.length && <p className="text-sm text-muted-foreground">暂无人员</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-auto p-4" onClick={() => setEditing(null)}>
          <Card className="w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <CardHeader><CardTitle>{editing.id ? '编辑人员' : '新增人员'}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                {[['full_name', '姓名'], ['phone', '电话'], ['wechat', '微信/Line'], ['email', '邮箱'], ['occupation', '职业'], ['address', '地址']].map(([k, label]) => (
                  <div key={k}><Label>{label}</Label><Input value={editing[k] ?? ''} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} /></div>
                ))}
                <div><Label>性别</Label>
                  <select className={`${sel} w-full`} value={editing.gender ?? ''} onChange={(e) => setEditing({ ...editing, gender: e.target.value })}>
                    <option value="">—</option><option value="male">男</option><option value="female">女</option>
                  </select>
                </div>
                <div><Label>出生日期</Label><Input type="date" value={editing.birth_date ?? ''} onChange={(e) => setEditing({ ...editing, birth_date: e.target.value })} /></div>
              </div>
              <div><Label>备注</Label><Textarea rows={3} value={editing.notes ?? ''} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
              <div className="flex gap-2"><Button onClick={save}>保存</Button><Button variant="outline" onClick={() => setEditing(null)}>取消</Button></div>
            </CardContent>
          </Card>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-auto p-4" onClick={() => setDetail(null)}>
          <Card className="w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{detail.person.full_name} · 个人档案</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setDetail(null)}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>电话：{detail.person.phone || '—'} · 邮箱：{detail.person.email || '—'}</p>
              <p>会籍：{detail.member ? `${MEMBER_STATUS_LABELS[detail.member.member_status]}（入会 ${detail.member.joined_at || '—'}）` : '非会友'}</p>
              <div>
                <p className="font-medium">家庭</p>
                {detail.households.length
                  ? detail.households.map((h: any) => <p key={h.id}>{h.households?.household_name} · {h.relationship}</p>)
                  : <p className="text-muted-foreground">未归属家庭</p>}
              </div>
              <div>
                <p className="font-medium">会籍变动</p>
                {detail.history.length
                  ? detail.history.map((h: any) => <p key={h.id}>{h.effective_date} · {MEMBER_STATUS_LABELS[h.new_status] ?? h.new_status} · {h.reason || ''}</p>)
                  : <p className="text-muted-foreground">暂无</p>}
              </div>
              <div>
                <p className="font-medium">探访记录（{detail.visits.length}）</p>
                {detail.visits.map((v: any) => (
                  <div key={v.id} className="border rounded-md p-2 mt-1">
                    <p className="text-xs text-muted-foreground">{v.visit_date} · {VISIT_METHOD_LABELS[v.visit_method] ?? v.visit_method} · {v.visitors.map((x: any) => x.visitor_name).join('、')}</p>
                    <p className="whitespace-pre-wrap">{v.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ───────── 家庭 ───────── */
function Households() {
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [personQuery, setPersonQuery] = useState('');
  const [personResults, setPersonResults] = useState<any[]>([]);

  const load = useCallback(async () => {
    try { setRows((await pastoralApi('households.search', { q })).households); }
    catch (e: any) { toast({ title: '加载失败', description: e.message, variant: 'destructive' }); }
  }, [q, toast]);
  useEffect(() => { load(); }, [load]);

  const openDetail = async (id: string) => setDetail(await pastoralApi('households.detail', { id }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="家庭名称或成员" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="outline" onClick={load}><Search className="h-4 w-4" /></Button>
        <Button onClick={() => setEditing({ household_name: '', address: '', notes: '' })}><Plus className="h-4 w-4 mr-1" />新增家庭</Button>
      </div>
      <div className="space-y-2">
        {rows.map((h) => (
          <Card key={h.id}><CardContent className="pt-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-medium">{h.household_name}</p>
              <p className="text-xs text-muted-foreground">
                {h.members.map((m: any) => `${m.person?.full_name}（${m.relationship}）`).join('、') || '暂无成员'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openDetail(h.id)}>家庭档案</Button>
              <Button size="sm" variant="outline" onClick={() => setEditing({ ...h })}>编辑</Button>
              <Button size="sm" variant="ghost" onClick={async () => {
                if (!confirm('删除该家庭？')) return;
                await pastoralApi('households.delete', { id: h.id }); load();
              }}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardContent></Card>
        ))}
        {!rows.length && <p className="text-sm text-muted-foreground">暂无家庭</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4" onClick={() => setEditing(null)}>
          <Card className="w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
            <CardHeader><CardTitle>{editing.id ? '编辑家庭' : '新增家庭'}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>家庭名称</Label><Input value={editing.household_name} onChange={(e) => setEditing({ ...editing, household_name: e.target.value })} /></div>
              <div><Label>地址</Label><Input value={editing.address ?? ''} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></div>
              <div><Label>备注</Label><Textarea rows={3} value={editing.notes ?? ''} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
              <div className="flex gap-2">
                <Button onClick={async () => {
                  try {
                    await pastoralApi('households.save', editing);
                    toast({ title: '已保存' }); setEditing(null); load();
                  } catch (e: any) { toast({ title: '保存失败', description: e.message, variant: 'destructive' }); }
                }}>保存</Button>
                <Button variant="outline" onClick={() => setEditing(null)}>取消</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-auto p-4" onClick={() => setDetail(null)}>
          <Card className="w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{detail.household.household_name} · 家庭档案</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setDetail(null)}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>地址：{detail.household.address || '—'}</p>
              <div className="space-y-1">
                <p className="font-medium">家庭成员</p>
                {detail.members.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between border rounded-md px-2 py-1">
                    <span>
                      {m.person?.full_name} · {m.relationship}
                      {m.member ? ` · ${MEMBER_STATUS_LABELS[m.member.member_status] ?? ''}` : ''}
                      {m.is_primary_contact ? ' · 主要联系人' : ''}
                    </span>
                    <Button size="sm" variant="ghost" onClick={async () => {
                      await pastoralApi('households.removeMember', { id: m.id });
                      openDetail(detail.household.id); load();
                    }}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="font-medium">添加成员</p>
                <div className="flex gap-2">
                  <Input placeholder="搜索人员" value={personQuery} onChange={(e) => setPersonQuery(e.target.value)} />
                  <Button variant="outline" onClick={async () => setPersonResults((await pastoralApi('people.search', { q: personQuery })).people)}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {personResults.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span className="flex-1">{p.full_name} {p.phone}</span>
                    <select id={`rel-${p.id}`} className={sel} defaultValue="其他">
                      {RELATIONSHIP_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <Button size="sm" onClick={async () => {
                      const relationship = (document.getElementById(`rel-${p.id}`) as HTMLSelectElement)?.value ?? '其他';
                      await pastoralApi('households.addMember', { household_id: detail.household.id, person_id: p.id, relationship });
                      setPersonResults([]); setPersonQuery(''); openDetail(detail.household.id); load();
                    }}>加入</Button>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-medium">探访记录（{detail.visits.length}）</p>
                {detail.visits.map((v: any) => (
                  <div key={v.id} className="border rounded-md p-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {v.visit_date} · {VISIT_METHOD_LABELS[v.visit_method] ?? v.visit_method} · 同工：{v.visitors.map((x: any) => x.visitor_name).join('、') || '—'}
                    </p>
                    <p className="whitespace-pre-wrap">{v.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ───────── 会友名册 ───────── */
function Members() {
  const { toast } = useToast();
  const [status, setStatus] = useState('active');
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [changing, setChanging] = useState<any>(null);
  const [form, setForm] = useState({ new_status: 'inactive', effective_date: today(), reason: '', note: '' });

  const load = useCallback(async () => {
    try { setRows((await pastoralApi('members.list', { status, q })).members); }
    catch (e: any) { toast({ title: '加载失败', description: e.message, variant: 'destructive' }); }
  }, [status, q, toast]);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">全部</option>
          {Object.entries(MEMBER_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Input className="max-w-xs" placeholder="姓名/电话/邮箱" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="outline" onClick={load}><Search className="h-4 w-4" /></Button>
        <span className="text-sm text-muted-foreground self-center">共 {rows.length} 人</span>
      </div>
      <div className="space-y-2">
        {rows.map((m) => (
          <Card key={m.id}><CardContent className="pt-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-medium">{m.person?.full_name} <span className="text-sm text-muted-foreground">{m.person?.phone}</span></p>
              <p className="text-xs text-muted-foreground">
                {MEMBER_STATUS_LABELS[m.member_status] ?? m.member_status} · 入会 {m.joined_at || '—'}
                {m.household_name ? ` · ${m.household_name}` : ''}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => { setChanging(m); setForm({ new_status: 'inactive', effective_date: today(), reason: '', note: '' }); }}>
              会籍变更
            </Button>
          </CardContent></Card>
        ))}
        {!rows.length && <p className="text-sm text-muted-foreground">暂无会友</p>}
      </div>

      {changing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4" onClick={() => setChanging(null)}>
          <Card className="w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
            <CardHeader><CardTitle>{changing.person?.full_name} · 会籍变更</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>新状态</Label>
                <select className={`${sel} w-full`} value={form.new_status} onChange={(e) => setForm({ ...form, new_status: e.target.value })}>
                  {Object.entries(MEMBER_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div><Label>生效日期</Label><Input type="date" value={form.effective_date} onChange={(e) => setForm({ ...form, effective_date: e.target.value })} /></div>
              <div><Label>原因</Label><Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
              <div><Label>备注</Label><Textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
              <div className="flex gap-2">
                <Button onClick={async () => {
                  try {
                    await pastoralApi('members.changeStatus', { id: changing.id, ...form, changed_by: '管理员' });
                    toast({ title: '已更新' }); setChanging(null); load();
                  } catch (e: any) { toast({ title: '操作失败', description: e.message, variant: 'destructive' }); }
                }}>确认</Button>
                <Button variant="outline" onClick={() => setChanging(null)}>取消</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ───────── 探访管理 ───────── */
function Visits() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({ from: '', to: '', visit_method: 'all', follow_up: 'all', has_expense: 'all', q: '' });
  const [rows, setRows] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [newStaff, setNewStaff] = useState('');

  const load = useCallback(async () => {
    try {
      const payload: any = { ...filters };
      if (payload.follow_up === 'all') delete payload.follow_up;
      if (payload.has_expense === 'all') delete payload.has_expense;
      if (!payload.from) delete payload.from;
      if (!payload.to) delete payload.to;
      setRows((await pastoralApi('visits.list', payload)).visits);
    } catch (e: any) { toast({ title: '加载失败', description: e.message, variant: 'destructive' }); }
  }, [filters, toast]);
  const loadStaff = useCallback(async () => setStaff((await pastoralApi('staff.list')).staff), []);
  useEffect(() => { load(); loadStaff(); }, [load, loadStaff]);

  const total = rows.reduce((s, r) => s + Number(r.expense_total || 0), 0);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle className="text-base">探访同工名单</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {staff.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1 border rounded-full px-3 py-1 text-sm">
                {s.name}
                <button onClick={async () => { await pastoralApi('staff.delete', { id: s.id }); loadStaff(); }}><X className="h-3 w-3" /></button>
              </span>
            ))}
            {!staff.length && <span className="text-sm text-muted-foreground">尚未添加同工</span>}
          </div>
          <div className="flex gap-2 max-w-sm">
            <Input placeholder="同工姓名" value={newStaff} onChange={(e) => setNewStaff(e.target.value)} />
            <Button onClick={async () => {
              if (!newStaff.trim()) return;
              await pastoralApi('staff.save', { name: newStaff.trim() });
              setNewStaff(''); loadStaff();
            }}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 items-end">
        <div><Label className="text-xs">起</Label><Input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} /></div>
        <div><Label className="text-xs">止</Label><Input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} /></div>
        <select className={sel} value={filters.visit_method} onChange={(e) => setFilters({ ...filters, visit_method: e.target.value })}>
          <option value="all">全部方式</option>
          {Object.entries(VISIT_METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={sel} value={filters.follow_up} onChange={(e) => setFilters({ ...filters, follow_up: e.target.value })}>
          <option value="all">全部跟进</option><option value="yes">需跟进</option><option value="no">无需跟进</option>
        </select>
        <select className={sel} value={filters.has_expense} onChange={(e) => setFilters({ ...filters, has_expense: e.target.value })}>
          <option value="all">全部费用</option><option value="yes">有支出</option><option value="no">无支出</option>
        </select>
        <Input className="max-w-[200px]" placeholder="家庭/姓名" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <Button variant="outline" onClick={load}><Search className="h-4 w-4" /></Button>
      </div>
      <p className="text-sm text-muted-foreground">共 {rows.length} 次探访 · 费用合计 ฿{total.toFixed(2)}</p>

      <div className="space-y-2">
        {rows.map((v) => (
          <Card key={v.id}><CardContent className="pt-4 space-y-2 text-sm">
            <div className="flex justify-between flex-wrap gap-2">
              <p className="font-medium">
                {v.visit_date} · {v.household_name || v.primary_person?.full_name || '未知对象'}
                <span className="text-muted-foreground ml-2">{VISIT_METHOD_LABELS[v.visit_method] ?? v.visit_method}</span>
              </p>
              <p className="text-muted-foreground text-xs">
                记录人：{v.recorder_name || '—'} · 同工：{v.visitors.map((x: any) => x.visitor_name).join('、') || '—'}
              </p>
            </div>
            {!!v.people.length && <p className="text-xs text-muted-foreground">接触成员：{v.people.map((p: any) => p.full_name).join('、')}</p>}
            <p className="whitespace-pre-wrap">{v.notes}</p>
            {!!v.expenses.length && (
              <p className="text-xs text-muted-foreground">
                费用：{v.expenses.map((e: any) => `${EXPENSE_TYPE_LABELS[e.expense_type] ?? e.expense_type ?? ''} ${e.description} ฿${e.amount}`).join('；')}（合计 ฿{Number(v.expense_total).toFixed(2)}）
              </p>
            )}
            {v.follow_up_required && (
              <div className="rounded-md bg-muted p-2 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs">
                  跟进（{v.follow_up_status === 'completed' ? '已完成' : '待跟进'}）：{v.follow_up_date || '未定'} · {v.follow_up_note || ''}
                </span>
                {v.follow_up_status !== 'completed' && (
                  <Button size="sm" variant="outline" onClick={async () => {
                    const note = prompt('跟进结果说明') ?? '';
                    await pastoralApi('visits.completeFollowUp', { id: v.id, completed_by: '管理员', completed_note: note });
                    toast({ title: '已标记完成' }); load();
                  }}>标记完成</Button>
                )}
              </div>
            )}
          </CardContent></Card>
        ))}
        {!rows.length && <p className="text-sm text-muted-foreground">暂无探访记录</p>}
      </div>
    </div>
  );
}

export default function PastoralAdmin() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="overview">概览</TabsTrigger>
        <TabsTrigger value="applications">会友申请</TabsTrigger>
        <TabsTrigger value="members">会友名册</TabsTrigger>
        <TabsTrigger value="people">人员库</TabsTrigger>
        <TabsTrigger value="households">家庭</TabsTrigger>
        <TabsTrigger value="visits">探访管理</TabsTrigger>
      </TabsList>
      <TabsContent value="overview"><Overview /></TabsContent>
      <TabsContent value="applications"><Applications /></TabsContent>
      <TabsContent value="members"><Members /></TabsContent>
      <TabsContent value="people"><People /></TabsContent>
      <TabsContent value="households"><Households /></TabsContent>
      <TabsContent value="visits"><Visits /></TabsContent>
    </Tabs>
  );
}
