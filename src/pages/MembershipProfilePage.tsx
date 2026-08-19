import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Loader2, Plus, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pastoralApi, RELATIONSHIP_OPTIONS } from '@/lib/pastoral';

const sel = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm';

type Member = {
  full_name: string;
  relationship: string;
  is_primary_contact: boolean;
  gender: string;
  birth_date: string;
  phone: string;
  wechat: string;
  email: string;
  occupation: string;
  marital_status: string;
  school: string;
  grade: string;
  is_believer: string;
  faith_date: string;
  is_baptized: string;
  baptism_date: string;
  baptism_church: string;
  is_serving: boolean;
  serving_notes: string;
  notes: string;
};

const emptyMember = (relationship = '户主', primary = false): Member => ({
  full_name: '',
  relationship,
  is_primary_contact: primary,
  gender: '',
  birth_date: '',
  phone: '',
  wechat: '',
  email: '',
  occupation: '',
  marital_status: '',
  school: '',
  grade: '',
  is_believer: '',
  faith_date: '',
  is_baptized: '',
  baptism_date: '',
  baptism_church: '',
  is_serving: false,
  serving_notes: '',
  notes: '',
});

function ProfileForm() {
  const { token = '' } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [app, setApp] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [householdName, setHouseholdName] = useState('');
  const [address, setAddress] = useState('');
  const [groupId, setGroupId] = useState('');
  const [members, setMembers] = useState<Member[]>([emptyMember('户主', true)]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    try {
      const res: any = await pastoralApi('profile.get', { token });
      setApp(res.application);
      setGroups(res.groups ?? []);
      setHouseholdName(res.application.household_name ?? '');
      setAddress(res.application.address ?? '');
      setMembers([{ ...emptyMember('户主', true), full_name: res.application.applicant_name ?? '', phone: res.application.phone ?? '', wechat: res.application.wechat ?? '', email: res.application.email ?? '' }]);
      if (res.application.profile_submitted_at) setDone(true);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const patch = (i: number, key: keyof Member, value: any) =>
    setMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)));

  const setPrimary = (i: number) =>
    setMembers((prev) => prev.map((m, idx) => ({ ...m, is_primary_contact: idx === i })));

  const submit = async () => {
    if (!householdName.trim()) return toast({ title: '请填写家庭名称', variant: 'destructive' });
    if (!members.some((m) => m.full_name.trim())) return toast({ title: '请至少填写一位家庭成员', variant: 'destructive' });
    setSubmitting(true);
    try {
      await pastoralApi('profile.submit', {
        token,
        household_name: householdName,
        address,
        group_id: groupId || null,
        members: members.filter((m) => m.full_name.trim()),
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      toast({ title: '提交失败', description: e.message, variant: 'destructive' });
    }
    setSubmitting(false);
  };

  if (loading) return <div className="container mx-auto px-4 py-24 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>;

  if (error)
    return (
      <div className="container mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-serif text-2xl mb-3">链接无效</h1>
        <p className="text-muted-foreground">{error}，请联系教会同工重新获取家庭成员资料填写链接。</p>
      </div>
    );

  if (done)
    return (
      <div className="container mx-auto max-w-xl px-4 py-24 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-accent mx-auto" />
        <h1 className="font-serif text-2xl">家庭成员资料已提交</h1>
        <p className="text-muted-foreground">
          感谢您！{householdName} 已正式列入教会会友名册。教会将在主日崇拜中介绍并欢迎你们，
          日后的牧养、探访与事工记录都会与你们的家庭档案相连。
        </p>
      </div>
    );

  return (
    <div className="container mx-auto max-w-3xl px-4 pb-20">
      <div className="text-center mb-8">
        <Users className="h-8 w-8 text-accent mx-auto mb-3" />
        <h1 className="font-serif text-3xl mb-2">家庭成员资料表</h1>
        <p className="text-muted-foreground text-sm">
          {app.household_name} · 您的会友申请已通过审核，请完善每一位家庭成员的资料，提交后即成为正式会友家庭。
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">家庭基本资料</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div><Label>家庭名称 *</Label><Input value={householdName} onChange={(e) => setHouseholdName(e.target.value)} /></div>
          <div><Label>家庭住址</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
          <div>
            <Label>所属团契小组</Label>
            <select className={sel} value={groupId} onChange={(e) => setGroupId(e.target.value)}>
              <option value="">未定</option>
              {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {members.map((m, i) => (
          <Card key={i}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">成员 {i + 1}</CardTitle>
              {members.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => setMembers(members.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>姓名 *</Label><Input value={m.full_name} onChange={(e) => patch(i, 'full_name', e.target.value)} /></div>
                <div>
                  <Label>家庭关系</Label>
                  <select className={sel} value={m.relationship} onChange={(e) => patch(i, 'relationship', e.target.value)}>
                    {RELATIONSHIP_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <Label>性别</Label>
                  <select className={sel} value={m.gender} onChange={(e) => patch(i, 'gender', e.target.value)}>
                    <option value="">—</option><option value="male">男</option><option value="female">女</option>
                  </select>
                </div>
                <div><Label>出生日期</Label><Input type="date" value={m.birth_date} onChange={(e) => patch(i, 'birth_date', e.target.value)} /></div>
                <div><Label>电话</Label><Input value={m.phone} onChange={(e) => patch(i, 'phone', e.target.value)} /></div>
                <div><Label>微信 / Line</Label><Input value={m.wechat} onChange={(e) => patch(i, 'wechat', e.target.value)} /></div>
                <div><Label>邮箱</Label><Input value={m.email} onChange={(e) => patch(i, 'email', e.target.value)} /></div>
                <div><Label>职业</Label><Input value={m.occupation} onChange={(e) => patch(i, 'occupation', e.target.value)} /></div>
                <div>
                  <Label>婚姻状况</Label>
                  <select className={sel} value={m.marital_status} onChange={(e) => patch(i, 'marital_status', e.target.value)}>
                    <option value="">—</option><option value="单身">单身</option><option value="已婚">已婚</option>
                    <option value="离婚">离婚</option><option value="丧偶">丧偶</option>
                  </select>
                </div>
                <div><Label>学校（学生填写）</Label><Input value={m.school} onChange={(e) => patch(i, 'school', e.target.value)} /></div>
                <div><Label>年级（学生填写）</Label><Input value={m.grade} onChange={(e) => patch(i, 'grade', e.target.value)} /></div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>是否已信主</Label>
                  <select className={sel} value={m.is_believer} onChange={(e) => patch(i, 'is_believer', e.target.value)}>
                    <option value="">—</option><option value="是">是</option><option value="否">否</option>
                  </select>
                </div>
                <div><Label>信主日期</Label><Input type="date" value={m.faith_date} onChange={(e) => patch(i, 'faith_date', e.target.value)} /></div>
                <div>
                  <Label>是否已受洗</Label>
                  <select className={sel} value={m.is_baptized} onChange={(e) => patch(i, 'is_baptized', e.target.value)}>
                    <option value="">—</option><option value="是">是</option><option value="否">否</option>
                  </select>
                </div>
                <div><Label>受洗日期</Label><Input type="date" value={m.baptism_date} onChange={(e) => patch(i, 'baptism_date', e.target.value)} /></div>
                <div className="sm:col-span-2"><Label>受洗教会</Label><Input value={m.baptism_church} onChange={(e) => patch(i, 'baptism_church', e.target.value)} /></div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id={`serving-${i}`} checked={m.is_serving} onCheckedChange={(v) => patch(i, 'is_serving', v === true)} />
                  <Label htmlFor={`serving-${i}`} className="font-normal">目前有参与教会服侍</Label>
                </div>
                {m.is_serving && <Input placeholder="服侍岗位说明" value={m.serving_notes} onChange={(e) => patch(i, 'serving_notes', e.target.value)} />}
                <div className="flex items-center gap-2">
                  <Checkbox id={`primary-${i}`} checked={m.is_primary_contact} onCheckedChange={(v) => v === true && setPrimary(i)} />
                  <Label htmlFor={`primary-${i}`} className="font-normal">设为家庭主要联系人</Label>
                </div>
                <div><Label>备注</Label><Textarea rows={2} value={m.notes} onChange={(e) => patch(i, 'notes', e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button variant="outline" onClick={() => setMembers([...members, emptyMember('子女')])}>
          <Plus className="h-4 w-4 mr-1" />添加家庭成员
        </Button>
        <Button onClick={submit} disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}提交家庭成员资料
        </Button>
      </div>
    </div>
  );
}

export default function MembershipProfilePage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <ProfileForm />
      </PageLayout>
    </LanguageProvider>
  );
}
