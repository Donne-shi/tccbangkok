import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, Plus, X, CheckCircle2, Search, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  pastoralApi, setPastoralPassword, getPastoralPassword, clearPastoralPassword,
  VISIT_METHOD_LABELS, EXPENSE_TYPE_LABELS,
} from '@/lib/pastoral';

interface Staff { id: string; name: string; role_title: string | null; active: boolean }
interface PersonLite { id: string; full_name: string; phone: string | null; gender: string | null }
interface HouseholdRow {
  id: string; household_name: string; address: string | null;
  members: { id: string; person_id: string; relationship: string; person: PersonLite | null }[];
}
interface ExpenseRow { expense_type: string; description: string; amount: string; paid_by: string }

const selectCls = 'w-full h-10 rounded-md border border-input bg-background px-3 text-sm';

function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await pastoralApi('verify', {}, 'visit', password);
      setPastoralPassword('visit', password);
      onDone();
    } catch (err: any) {
      setError(err.message || '验证失败');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Lock className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle>探访登记</CardTitle>
          <p className="text-sm text-muted-foreground">请输入探访同工密码</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input type="password" placeholder="探访密码" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? '验证中...' : '进入'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VisitPage() {
  const { toast } = useToast();
  const [authed, setAuthed] = useState(!!getPastoralPassword('visit'));
  const [staff, setStaff] = useState<Staff[]>([]);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [households, setHouseholds] = useState<HouseholdRow[]>([]);
  const [people, setPeople] = useState<PersonLite[]>([]);
  const [visitType, setVisitType] = useState<'household' | 'person'>('household');
  const [household, setHousehold] = useState<HouseholdRow | null>(null);
  const [person, setPerson] = useState<PersonLite | null>(null);
  const [contacted, setContacted] = useState<string[]>([]);
  const [visitors, setVisitors] = useState<{ visitor_id: string; visitor_name: string }[]>([]);
  const [recorderId, setRecorderId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('');
  const [method, setMethod] = useState('home');
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authed) return;
    pastoralApi<{ staff: Staff[] }>('staff.list', {}, 'visit')
      .then((d) => setStaff(d.staff))
      .catch(() => setAuthed(false));
  }, [authed]);

  const search = async () => {
    setSearching(true);
    try {
      if (visitType === 'household') {
        const d = await pastoralApi<{ households: HouseholdRow[] }>('households.search', { q: query }, 'visit');
        setHouseholds(d.households);
      } else {
        const d = await pastoralApi<{ people: PersonLite[] }>('people.search', { q: query }, 'visit');
        setPeople(d.people);
      }
    } catch (err: any) {
      toast({ title: '查询失败', description: err.message, variant: 'destructive' });
    }
    setSearching(false);
  };

  const selectHousehold = async (h: HouseholdRow) => {
    try {
      const d = await pastoralApi<{ members: HouseholdRow['members'] }>('households.members', { id: h.id }, 'visit');
      setHousehold({ ...h, members: d.members });
      setContacted(d.members.map((m) => m.person_id));
      setHouseholds([]);
    } catch (err: any) {
      toast({ title: '加载失败', description: err.message, variant: 'destructive' });
    }
  };

  const reset = () => {
    setHousehold(null); setPerson(null); setContacted([]); setVisitors([]);
    setNotes(''); setFollowUp(false); setFollowUpDate(''); setFollowUpNote('');
    setExpenses([]); setTime(''); setMethod('home'); setDate(new Date().toISOString().slice(0, 10));
    setQuery(''); setHouseholds([]); setPeople([]);
  };

  const submit = async () => {
    if (visitType === 'household' && !household) { toast({ title: '请选择探访家庭', variant: 'destructive' }); return; }
    if (visitType === 'person' && !person) { toast({ title: '请选择探访对象', variant: 'destructive' }); return; }
    if (!notes.trim()) { toast({ title: '请填写探访内容记录', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const recorder = staff.find((s) => s.id === recorderId);
      await pastoralApi('visits.create', {
        visit_type: visitType,
        household_id: household?.id,
        primary_person_id: person?.id,
        visit_date: date,
        visit_time: time || null,
        visit_method: method,
        notes,
        recorder_id: recorderId || null,
        recorder_name: recorder?.name ?? null,
        person_ids: visitType === 'household' ? contacted : [],
        visitors: visitors.filter((v) => v.visitor_name.trim()),
        expenses: expenses.filter((e) => e.description.trim() || Number(e.amount) > 0),
        follow_up_required: followUp,
        follow_up_date: followUpDate || null,
        follow_up_note: followUpNote || null,
      }, 'visit');
      setSaved(true);
      reset();
    } catch (err: any) {
      toast({ title: '保存失败', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  if (!authed) return <Login onDone={() => setAuthed(true)} />;

  if (saved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
            <p className="font-semibold text-lg">探访记录已保存</p>
            <Button onClick={() => setSaved(false)}>再登记一次</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">探访登记</h1>
            <p className="text-sm text-muted-foreground">记录每次探访的对象、内容、同工与费用</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { clearPastoralPassword('visit'); setAuthed(false); }}
          >
            <LogOut className="h-4 w-4 mr-1" />退出
          </Button>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">1. 探访对象</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {(['household', 'person'] as const).map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant={visitType === v ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setVisitType(v); reset(); }}
                >
                  {v === 'household' ? '家庭探访' : '个人探访'}
                </Button>
              ))}
            </div>

            {visitType === 'household' && household ? (
              <div className="rounded-md border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{household.household_name}</p>
                  <Button variant="ghost" size="sm" onClick={() => { setHousehold(null); setContacted([]); }}>更换</Button>
                </div>
                <p className="text-sm font-medium text-muted-foreground">本次接触的成员</p>
                <div className="flex flex-wrap gap-2">
                  {household.members.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 text-sm rounded-md border px-2 py-1">
                      <input
                        type="checkbox"
                        checked={contacted.includes(m.person_id)}
                        onChange={(e) =>
                          setContacted((prev) =>
                            e.target.checked ? [...prev, m.person_id] : prev.filter((x) => x !== m.person_id),
                          )
                        }
                      />
                      {m.person?.full_name}
                      <span className="text-muted-foreground text-xs">{m.relationship}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : visitType === 'person' && person ? (
              <div className="rounded-md border p-3 flex items-center justify-between">
                <p className="font-medium">{person.full_name}<span className="text-sm text-muted-foreground ml-2">{person.phone}</span></p>
                <Button variant="ghost" size="sm" onClick={() => setPerson(null)}>更换</Button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <Input
                    placeholder={visitType === 'household' ? '搜索家庭名称或成员姓名/电话' : '搜索姓名或电话'}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); search(); } }}
                  />
                  <Button type="button" onClick={search} disabled={searching}>
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="space-y-1">
                  {visitType === 'household'
                    ? households.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => selectHousehold(h)}
                          className="w-full text-left rounded-md border px-3 py-2 text-sm hover:bg-muted"
                        >
                          <span className="font-medium">{h.household_name}</span>
                          <span className="text-muted-foreground ml-2">
                            {h.members.map((m) => m.person?.full_name).filter(Boolean).join('、')}
                          </span>
                        </button>
                      ))
                    : people.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => { setPerson(p); setPeople([]); }}
                          className="w-full text-left rounded-md border px-3 py-2 text-sm hover:bg-muted"
                        >
                          <span className="font-medium">{p.full_name}</span>
                          <span className="text-muted-foreground ml-2">{p.phone}</span>
                        </button>
                      ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">2. 探访信息</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-3">
              <div><Label>日期</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
              <div><Label>时间</Label><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
              <div>
                <Label>方式</Label>
                <select className={selectCls} value={method} onChange={(e) => setMethod(e.target.value)}>
                  {Object.entries(VISIT_METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>记录人</Label>
              <select className={selectCls} value={recorderId} onChange={(e) => setRecorderId(e.target.value)}>
                <option value="">请选择</option>
                {staff.map((s) => <option key={s.id} value={s.id}>{s.name}{s.role_title ? `（${s.role_title}）` : ''}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>参与探访的同工</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setVisitors((p) => [...p, { visitor_id: '', visitor_name: '' }])}>
                  <Plus className="h-3 w-3 mr-1" />添加
                </Button>
              </div>
              <div className="space-y-2">
                {visitors.map((v, i) => (
                  <div key={i} className="flex gap-2">
                    <select
                      className={selectCls}
                      value={v.visitor_id}
                      onChange={(e) => {
                        const s = staff.find((x) => x.id === e.target.value);
                        setVisitors((prev) => prev.map((x, idx) => idx === i ? { visitor_id: e.target.value, visitor_name: s?.name ?? x.visitor_name } : x));
                      }}
                    >
                      <option value="">名单外（手填）</option>
                      {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <Input
                      placeholder="姓名"
                      value={v.visitor_name}
                      onChange={(e) => setVisitors((prev) => prev.map((x, idx) => idx === i ? { ...x, visitor_name: e.target.value } : x))}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => setVisitors((prev) => prev.filter((_, idx) => idx !== i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>探访内容记录 *</Label>
              <Textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="家庭情况、代祷事项、交谈要点、需要的帮助..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">3. 探访费用（可选）</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {expenses.map((e, i) => (
              <div key={i} className="grid sm:grid-cols-[1fr_1.4fr_0.8fr_1fr_auto] gap-2">
                <select
                  className={selectCls}
                  value={e.expense_type}
                  onChange={(ev) => setExpenses((p) => p.map((x, idx) => idx === i ? { ...x, expense_type: ev.target.value } : x))}
                >
                  <option value="">类型</option>
                  {Object.entries(EXPENSE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <Input placeholder="说明" value={e.description} onChange={(ev) => setExpenses((p) => p.map((x, idx) => idx === i ? { ...x, description: ev.target.value } : x))} />
                <Input type="number" step="0.01" placeholder="金额" value={e.amount} onChange={(ev) => setExpenses((p) => p.map((x, idx) => idx === i ? { ...x, amount: ev.target.value } : x))} />
                <Input placeholder="垫付人" value={e.paid_by} onChange={(ev) => setExpenses((p) => p.map((x, idx) => idx === i ? { ...x, paid_by: ev.target.value } : x))} />
                <Button type="button" variant="ghost" size="icon" onClick={() => setExpenses((p) => p.filter((_, idx) => idx !== i))}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setExpenses((p) => [...p, { expense_type: '', description: '', amount: '', paid_by: '' }])}>
              <Plus className="h-3 w-3 mr-1" />添加费用
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">4. 后续跟进</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={followUp} onChange={(e) => setFollowUp(e.target.checked)} />
              需要后续跟进
            </label>
            {followUp && (
              <div className="space-y-3">
                <div><Label>计划跟进日期</Label><Input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} /></div>
                <div><Label>跟进事项</Label><Textarea rows={3} value={followUpNote} onChange={(e) => setFollowUpNote(e.target.value)} /></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" onClick={submit} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}提交探访记录
        </Button>
      </div>
    </div>
  );
}
