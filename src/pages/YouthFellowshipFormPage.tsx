import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FAITH_STATUS = ['已受洗基督徒', '决志但未受洗', '慕道友 / 正在了解', '陪朋友来的'];
const ATTENDANCE = ['第一次参加', '偶尔参加', '固定每周参加', '曾参加过一段时间'];
const INTERESTS = ['圣经与信仰讨论', '音乐 / 敬拜', '运动', '游戏与桌游', '美术 / 手作', '影音剪辑', '户外活动', '其他'];
const SERVICE_INTERESTS = ['敬拜服侍', '影音 / PPT', '接待', '活动帮手', '暂时不想服侍'];

function FellowshipForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({
    full_name: '', nickname: '', gender: '', birth_date: '', school: '', grade: '', contact: '',
    faith_status: '', attendance: '',
    interests: [] as string[], interests_other: '',
    service_interests: [] as string[],
    fellowship_hope: '',
    guardian_name: '', guardian_relation: '', guardian_contact: '',
    guardian_consent: false, contact_consent: false,
  });

  const set = (k: string, v: unknown) => setF(prev => ({ ...prev, [k]: v }));
  const toggle = (k: 'interests' | 'service_interests', v: string) =>
    setF(prev => ({ ...prev, [k]: prev[k].includes(v) ? prev[k].filter(x => x !== v) : [...prev[k], v] }));

  const submit = async () => {
    if (!f.full_name.trim()) { toast({ title: '请填写姓名', variant: 'destructive' }); return; }
    setSaving(true);
    const { error } = await supabase.from('youth_members').insert({
      ...f,
      full_name: f.full_name.trim().slice(0, 100),
      birth_date: f.birth_date || null,
      fellowship_hope: f.fellowship_hope.slice(0, 2000),
    });
    setSaving(false);
    if (error) { toast({ title: '提交失败，请稍后再试', variant: 'destructive' }); return; }
    toast({ title: '提交成功', description: '欢迎你！小组同工会与你联系。' });
    navigate('/ministries/youth');
  };

  const CheckList = ({ items, field }: { items: string[]; field: 'interests' | 'service_interests' }) => (
    <div className="grid sm:grid-cols-2 gap-2">
      {items.map(item => (
        <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox checked={f[field].includes(item)} onCheckedChange={() => toggle(field, item)} />
          {item}
        </label>
      ))}
    </div>
  );

  const Radios = ({ items, field }: { items: string[]; field: string }) => (
    <RadioGroup value={(f as never)[field]} onValueChange={v => set(field, v)} className="flex flex-wrap gap-4">
      {items.map(item => (
        <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
          <RadioGroupItem value={item} /> {item}
        </label>
      ))}
    </RadioGroup>
  );

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/ministries/youth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> 返回青少年服侍
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <Users className="h-8 w-8 text-accent" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">青少年团契参与信息表</h1>
        </div>
        <p className="text-muted-foreground mb-10">
          欢迎你加入三一社区教会青少年团契！填写这份表格后，我们会把你安排到合适的小组，并有同工专门关心你的成长。
        </p>

        <Card>
          <CardContent className="pt-6 space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">一、基本信息</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>姓名 *</Label><Input value={f.full_name} onChange={e => set('full_name', e.target.value)} maxLength={100} /></div>
                <div><Label>昵称 / 英文名</Label><Input value={f.nickname} onChange={e => set('nickname', e.target.value)} maxLength={100} /></div>
              </div>
              <div><Label className="mb-2 block">性别</Label><Radios items={['男', '女']} field="gender" /></div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><Label>出生日期</Label><Input type="date" value={f.birth_date} onChange={e => set('birth_date', e.target.value)} /></div>
                <div><Label>就读学校</Label><Input value={f.school} onChange={e => set('school', e.target.value)} maxLength={200} /></div>
                <div><Label>年级</Label><Input value={f.grade} onChange={e => set('grade', e.target.value)} maxLength={50} /></div>
              </div>
              <div><Label>联系方式（电话 / LINE / 微信）</Label><Input value={f.contact} onChange={e => set('contact', e.target.value)} maxLength={200} /></div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">二、信仰与聚会情况</h2>
              <div><Label className="mb-2 block">目前的信仰状况</Label><Radios items={FAITH_STATUS} field="faith_status" /></div>
              <div><Label className="mb-2 block">参加教会 / 团契的情况</Label><Radios items={ATTENDANCE} field="attendance" /></div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">三、兴趣与参与</h2>
              <div>
                <Label className="mb-2 block">你的兴趣爱好（可多选）</Label>
                <CheckList items={INTERESTS} field="interests" />
                {f.interests.includes('其他') && (
                  <Input className="mt-2" placeholder="请说明" value={f.interests_other} onChange={e => set('interests_other', e.target.value)} maxLength={200} />
                )}
              </div>
              <div><Label className="mb-2 block">愿意尝试的服侍（可多选）</Label><CheckList items={SERVICE_INTERESTS} field="service_interests" /></div>
              <div><Label>你希望在团契中得到什么？（学习、朋友、被关心等）</Label><Textarea rows={4} value={f.fellowship_hope} onChange={e => set('fellowship_hope', e.target.value)} maxLength={2000} /></div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">四、家长 / 监护人信息</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><Label>家长姓名</Label><Input value={f.guardian_name} onChange={e => set('guardian_name', e.target.value)} maxLength={100} /></div>
                <div><Label>与青少年的关系</Label><Input value={f.guardian_relation} onChange={e => set('guardian_relation', e.target.value)} maxLength={50} /></div>
                <div><Label>紧急联络电话</Label><Input value={f.guardian_contact} onChange={e => set('guardian_contact', e.target.value)} maxLength={100} /></div>
              </div>
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <Checkbox checked={f.guardian_consent} onCheckedChange={v => set('guardian_consent', !!v)} />
                <span>家长 / 监护人同意本人参加教会青少年团契的聚会与活动。</span>
              </label>
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <Checkbox checked={f.contact_consent} onCheckedChange={v => set('contact_consent', !!v)} />
                <span>同意教会同工以电话或通讯软件联络，作聚会通知与关怀之用。</span>
              </label>
            </div>

            <Button onClick={submit} disabled={saving} className="w-full">
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> 提交中...</> : '提交信息表'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function YouthFellowshipFormPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <FellowshipForm />
      </PageLayout>
    </LanguageProvider>
  );
}
