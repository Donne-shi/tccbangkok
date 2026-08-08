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
import { ArrowLeft, HeartHandshake, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CHURCH_RELATIONS = ['会友', '固定聚会者', '偶尔参加', '其他'];
const FAITH_YEARS = ['少于1年', '1-3年', '3-5年', '5年以上'];
const SKILL_AREAS = ['圣经教导', '音乐/敬拜', '影音/技术', '游戏与活动策划', '行政与文书', '关怀与陪谈', '美工设计'];
const ROLES = ['小组带领同工', '教导同工（讲课/查经）', '敬拜服侍', '影音/PPT', '活动策划', '关怀与跟进', '接待与后勤'];
const TIMES = ['主日上午', '主日下午', '周五晚上', '周六', '其他'];
const FREQUENCY = ['每周', '每两周', '每月一次', '按需支援'];
const COMMIT = ['愿意', '需要再考虑', '暂时无法'];

function VolunteerForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({
    full_name: '', gender: '', age: '', contact: '',
    church_relation: '', church_relation_other: '',
    faith_years: '', baptized: '', motivation: '',
    has_experience: '', experience_detail: '',
    skill_areas: [] as string[], skill_areas_other: '',
    desired_roles: [] as string[],
    available_times: [] as string[], available_times_other: '',
    monthly_frequency: '', commit_half_year: '', agree_training: false,
  });

  const set = (k: string, v: unknown) => setF(prev => ({ ...prev, [k]: v }));
  const toggle = (k: 'skill_areas' | 'desired_roles' | 'available_times', v: string) =>
    setF(prev => ({ ...prev, [k]: prev[k].includes(v) ? prev[k].filter(x => x !== v) : [...prev[k], v] }));

  const submit = async () => {
    if (!f.full_name.trim()) { toast({ title: '请填写姓名', variant: 'destructive' }); return; }
    if (!f.contact.trim()) { toast({ title: '请填写联系方式', variant: 'destructive' }); return; }
    setSaving(true);
    const { error } = await supabase.from('youth_volunteer_applications').insert({
      ...f,
      full_name: f.full_name.trim().slice(0, 100),
      contact: f.contact.trim().slice(0, 200),
      age: f.age ? Number(f.age) : null,
      motivation: f.motivation.slice(0, 2000),
      experience_detail: f.experience_detail.slice(0, 2000),
    });
    setSaving(false);
    if (error) { toast({ title: '提交失败，请稍后再试', variant: 'destructive' }); return; }
    toast({ title: '提交成功', description: '感谢你的服侍心志，同工会尽快与你联系。' });
    navigate('/ministries/youth');
  };

  const CheckList = ({ items, field }: { items: string[]; field: 'skill_areas' | 'desired_roles' | 'available_times' }) => (
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
          <HeartHandshake className="h-8 w-8 text-accent" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">青少年服侍同工申请表</h1>
        </div>
        <p className="text-muted-foreground mb-10">
          感谢你愿意在青少年事工中一同服侍。请如实填写以下内容，好让我们更了解你，并安排合适的服侍岗位。
        </p>

        <Card>
          <CardContent className="pt-6 space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">一、基本信息</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>姓名 *</Label><Input value={f.full_name} onChange={e => set('full_name', e.target.value)} maxLength={100} /></div>
                <div><Label>年龄</Label><Input type="number" value={f.age} onChange={e => set('age', e.target.value)} /></div>
              </div>
              <div><Label className="mb-2 block">性别</Label><Radios items={['男', '女']} field="gender" /></div>
              <div><Label>联系方式（电话 / LINE / 微信）*</Label><Input value={f.contact} onChange={e => set('contact', e.target.value)} maxLength={200} /></div>
              <div>
                <Label className="mb-2 block">与教会的关系</Label>
                <Radios items={CHURCH_RELATIONS} field="church_relation" />
                {f.church_relation === '其他' && (
                  <Input className="mt-2" placeholder="请说明" value={f.church_relation_other} onChange={e => set('church_relation_other', e.target.value)} maxLength={200} />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">二、信仰状况</h2>
              <div><Label className="mb-2 block">信主年数</Label><Radios items={FAITH_YEARS} field="faith_years" /></div>
              <div><Label className="mb-2 block">是否已受洗</Label><Radios items={['是', '否']} field="baptized" /></div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">三、服侍心志与经验</h2>
              <div><Label>你为什么愿意参与青少年服侍？</Label><Textarea rows={4} value={f.motivation} onChange={e => set('motivation', e.target.value)} maxLength={2000} /></div>
              <div><Label className="mb-2 block">是否有过青少年 / 儿童相关服侍经验</Label><Radios items={['有', '没有']} field="has_experience" /></div>
              {f.has_experience === '有' && (
                <div><Label>请简述服侍经验</Label><Textarea rows={3} value={f.experience_detail} onChange={e => set('experience_detail', e.target.value)} maxLength={2000} /></div>
              )}
              <div>
                <Label className="mb-2 block">擅长或有负担的领域（可多选）</Label>
                <CheckList items={SKILL_AREAS} field="skill_areas" />
                <Input className="mt-2" placeholder="其他（可填）" value={f.skill_areas_other} onChange={e => set('skill_areas_other', e.target.value)} maxLength={200} />
              </div>
              <div><Label className="mb-2 block">希望参与的服侍岗位（可多选）</Label><CheckList items={ROLES} field="desired_roles" /></div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">四、时间与委身</h2>
              <div>
                <Label className="mb-2 block">可参与的时间（可多选）</Label>
                <CheckList items={TIMES} field="available_times" />
                {f.available_times.includes('其他') && (
                  <Input className="mt-2" placeholder="请说明" value={f.available_times_other} onChange={e => set('available_times_other', e.target.value)} maxLength={200} />
                )}
              </div>
              <div><Label className="mb-2 block">每月可服侍频率</Label><Radios items={FREQUENCY} field="monthly_frequency" /></div>
              <div><Label className="mb-2 block">是否愿意委身至少半年</Label><Radios items={COMMIT} field="commit_half_year" /></div>
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <Checkbox checked={f.agree_training} onCheckedChange={v => set('agree_training', !!v)} />
                <span>我愿意参加同工培训与定期同工会，并接受教会的服侍原则与督导。</span>
              </label>
            </div>

            <Button onClick={submit} disabled={saving} className="w-full">
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> 提交中...</> : '提交申请'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function YouthVolunteerFormPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <VolunteerForm />
      </PageLayout>
    </LanguageProvider>
  );
}
