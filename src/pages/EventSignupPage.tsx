import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { ArrowLeft, CalendarCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EVENT_NAME = '三一青少年团契团建日';

const GROUPS = ['小学组', '初中组', '高中组'];
const RELATIONS = ['父亲', '母亲', '寄宿家长', '其他'];

const TRANSPORT = [
  {
    value: 'self',
    title: '方式一｜家长自行接送',
    desc: '我会自行负责孩子前往真人CS场地及活动结束后的返程接送。',
  },
  {
    value: 'carpool',
    title: '方式二｜搭乘其他家长车辆',
    desc: '我的孩子已经与其他参加活动的家庭协调好交通，将搭乘其他家长的车辆前往真人CS场地，并采用相同方式返程。',
  },
  {
    value: 'undecided',
    title: '方式三｜暂未确定车辆',
    desc: '目前尚未确定接送车辆，需要团契协助协调拼车。',
  },
];

const CONSENTS = [
  '我已了解本次团建活动的时间、地点、主要活动内容及交通安排。',
  '我同意我的孩子参加本次三一青少年团契团建活动及真人激光CS活动。',
  '我确认以上填写的学生、家长、安全注意事项及交通信息真实准确。',
  '我已将本次活动需要特别注意的安全信息如实告知团契同工。',
  '我同意孩子按照本表所填写并最终确认的交通方式往返活动场地。',
  '我会提醒孩子在活动期间遵守团契同工及活动场地工作人员的安全要求，不擅自离队。',
  '如活动期间发生紧急情况，我授权负责同工第一时间联系监护人；如情况紧急且暂时无法联系监护人，同意同工及时联系急救或安排必要的紧急医疗处理，并尽快通知监护人。',
];

const SCHEDULE = [
  ['活动名称', EVENT_NAME],
  ['活动内容', '上午团契活动、团队建设、圣经学习、午餐、真人激光CS'],
  ['上午团契', '09:00–11:40'],
  ['午餐地点', 'The Xian 餐厅'],
  ['下午活动', '真人激光CS'],
  ['活动场地', 'Yok Pok Ying Laser'],
  ['真人CS时间', '14:00–17:30'],
  ['出发时间', '午餐后 13:00 从餐厅出发'],
  ['活动结束', '17:30'],
];

function SignupForm() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({
    student_name_zh: '', student_name_en: '', grade: '', group_level: '', age: '',
    guardian_name: '', relation: '', relation_other: '', phone: '',
    backup_contact_name: '', backup_contact_phone: '',
    has_special_notes: 'no', special_notes: '',
    transport_option: '', carpool_parent_name: '', carpool_parent_child: '', carpool_parent_phone: '',
    confirm_name: '',
  });
  const [consents, setConsents] = useState<boolean[]>(CONSENTS.map(() => false));

  const set = (k: string, v: string) => setF(prev => ({ ...prev, [k]: v }));

  const submit = async () => {
    const need: [string, string][] = [
      ['student_name_zh', '学生中文姓名'], ['student_name_en', '学生英文名字'],
      ['grade', '年级'], ['group_level', '组别'], ['age', '年龄'],
      ['guardian_name', '家长 / 监护人姓名'], ['relation', '与孩子关系'],
      ['phone', '联系电话'], ['backup_contact_name', '备用紧急联系人姓名'],
      ['transport_option', '交通方式'], ['confirm_name', '家长 / 监护人姓名（确认）'],
    ];
    for (const [k, label] of need) {
      if (!String((f as Record<string, string>)[k]).trim()) {
        toast({ title: `请填写${label}`, variant: 'destructive' });
        return;
      }
    }
    if (f.has_special_notes === 'yes' && !f.special_notes.trim()) {
      toast({ title: '请填写需要特别注意的事项', variant: 'destructive' });
      return;
    }
    if (f.transport_option === 'carpool' && (!f.carpool_parent_name.trim() || !f.carpool_parent_child.trim())) {
      toast({ title: '请填写同行接送家长及其孩子姓名', variant: 'destructive' });
      return;
    }
    if (!consents.every(Boolean)) {
      toast({ title: '请阅读并勾选全部授权确认项', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('event_registrations').insert({
      event_name: EVENT_NAME,
      student_name_zh: f.student_name_zh.trim().slice(0, 100),
      student_name_en: f.student_name_en.trim().slice(0, 100),
      grade: f.grade.trim().slice(0, 50),
      group_level: f.group_level,
      age: Number(f.age) || null,
      guardian_name: f.guardian_name.trim().slice(0, 100),
      relation: f.relation,
      relation_other: f.relation === '其他' ? f.relation_other.trim().slice(0, 100) : null,
      phone: f.phone.trim().slice(0, 50),
      backup_contact_name: f.backup_contact_name.trim().slice(0, 100),
      backup_contact_phone: f.backup_contact_phone.trim().slice(0, 50),
      has_special_notes: f.has_special_notes === 'yes',
      special_notes: f.has_special_notes === 'yes' ? f.special_notes.trim().slice(0, 2000) : null,
      transport_option: f.transport_option,
      carpool_parent_name: f.carpool_parent_name.trim().slice(0, 100) || null,
      carpool_parent_child: f.carpool_parent_child.trim().slice(0, 100) || null,
      carpool_parent_phone: f.carpool_parent_phone.trim().slice(0, 50) || null,
      consents: CONSENTS.reduce<Record<string, boolean>>((acc, item, i) => { acc[`c${i + 1}`] = consents[i]; return acc; }, {}),
      confirm_name: f.confirm_name.trim().slice(0, 100),
    });
    setSaving(false);
    if (error) { toast({ title: '提交失败，请稍后再试', variant: 'destructive' }); return; }
    setDone(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (done) {
    return (
      <section className="py-16 pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="pt-10 pb-10 text-center space-y-4">
              <CheckCircle2 className="h-14 w-14 text-accent mx-auto" />
              <h1 className="font-heading text-2xl font-bold text-foreground">提交成功</h1>
              <p className="text-muted-foreground">您已完成本次青少年团建活动家长授权及信息登记。</p>
              <p className="text-muted-foreground">
                如交通方式选择「暂未确定车辆」，团契同工将在活动前与您联系确认车辆安排。请保持电话畅通。
              </p>
              <p className="text-foreground/80 italic">愿我们一起守护孩子们平安、喜乐地度过这次团建活动。</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/ministries/youth">返回青少年服侍</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/ministries/youth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> 返回青少年服侍
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <CalendarCheck className="h-8 w-8 text-accent" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">青少年外出活动家长授权及信息统计表</h1>
        </div>
        <p className="text-accent font-medium mb-2">三一青少年团契｜团建日</p>
        <p className="text-muted-foreground mb-10">
          为了保障青少年外出活动安全，请家长 / 寄宿家长认真填写以下信息。本表用于本次活动的人员确认、交通安排、安全管理及紧急联系。
        </p>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">一、本次活动</h2>
            <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {SCHEDULE.map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="text-muted-foreground shrink-0">{k}：</dt>
                  <dd className="text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">二、学生信息</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>学生中文姓名 *</Label><Input value={f.student_name_zh} onChange={e => set('student_name_zh', e.target.value)} maxLength={100} /></div>
                <div><Label>学生英文名字 *</Label><Input value={f.student_name_en} onChange={e => set('student_name_en', e.target.value)} maxLength={100} /></div>
                <div><Label>年级 *</Label><Input value={f.grade} onChange={e => set('grade', e.target.value)} maxLength={50} /></div>
                <div><Label>年龄 *</Label><Input type="number" min={5} max={30} value={f.age} onChange={e => set('age', e.target.value)} /></div>
              </div>
              <div>
                <Label className="mb-2 block">组别 *</Label>
                <RadioGroup value={f.group_level} onValueChange={v => set('group_level', v)} className="flex flex-wrap gap-4">
                  {GROUPS.map(g => (
                    <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                      <RadioGroupItem value={g} /> {g}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">三、家长 / 监护人信息</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>家长 / 监护人姓名 *</Label><Input value={f.guardian_name} onChange={e => set('guardian_name', e.target.value)} maxLength={100} /></div>
                <div><Label>联系电话 *</Label><Input value={f.phone} onChange={e => set('phone', e.target.value)} maxLength={50} /></div>
              </div>
              <div>
                <Label className="mb-2 block">与孩子关系 *</Label>
                <RadioGroup value={f.relation} onValueChange={v => set('relation', v)} className="flex flex-wrap gap-4">
                  {RELATIONS.map(r => (
                    <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                      <RadioGroupItem value={r} /> {r}
                    </label>
                  ))}
                </RadioGroup>
                {f.relation === '其他' && (
                  <Input className="mt-2" placeholder="请说明" value={f.relation_other} onChange={e => set('relation_other', e.target.value)} maxLength={100} />
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>备用紧急联系人姓名 *</Label><Input value={f.backup_contact_name} onChange={e => set('backup_contact_name', e.target.value)} maxLength={100} /></div>
                <div><Label>备用紧急联系人电话</Label><Input value={f.backup_contact_phone} onChange={e => set('backup_contact_phone', e.target.value)} maxLength={50} /></div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">四、安全注意事项</h2>
              <Label className="block">孩子是否有本次活动需要同工特别注意的事项？ *</Label>
              <RadioGroup value={f.has_special_notes} onValueChange={v => set('has_special_notes', v)} className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer"><RadioGroupItem value="no" /> 没有</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><RadioGroupItem value="yes" /> 有</label>
              </RadioGroup>
              {f.has_special_notes === 'yes' && (
                <div>
                  <Label>请填写需要特别注意的事项 *</Label>
                  <Textarea
                    rows={4}
                    placeholder="例如：过敏、饮食禁忌、运动限制、当天需要特别注意的身体状况或其他重要安全信息。"
                    value={f.special_notes}
                    onChange={e => set('special_notes', e.target.value)}
                    maxLength={2000}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">五、交通方式</h2>
              <p className="text-sm text-muted-foreground">本次活动去程和返程采用相同交通方式，请选择：</p>
              <RadioGroup value={f.transport_option} onValueChange={v => set('transport_option', v)} className="space-y-3">
                {TRANSPORT.map(t => (
                  <label key={t.value} className="flex items-start gap-3 text-sm cursor-pointer rounded-md border border-border p-3">
                    <RadioGroupItem value={t.value} className="mt-1" />
                    <span>
                      <span className="font-medium text-foreground block">{t.title}</span>
                      <span className="text-muted-foreground">{t.desc}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
              {f.transport_option === 'carpool' && (
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><Label>同行接送家长姓名 *</Label><Input value={f.carpool_parent_name} onChange={e => set('carpool_parent_name', e.target.value)} maxLength={100} /></div>
                  <div><Label>该家长的孩子姓名 *</Label><Input value={f.carpool_parent_child} onChange={e => set('carpool_parent_child', e.target.value)} maxLength={100} /></div>
                  <div><Label>该家长联系电话</Label><Input value={f.carpool_parent_phone} onChange={e => set('carpool_parent_phone', e.target.value)} maxLength={50} /></div>
                </div>
              )}
              {f.transport_option === 'undecided' && (
                <p className="text-sm text-foreground bg-secondary rounded-md p-3">
                  团契同工将在活动前统一协调车辆，并与家长确认最终乘车安排。
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">六、家长授权与确认</h2>
              <p className="text-sm text-muted-foreground">请逐项阅读并勾选：</p>
              <div className="space-y-3">
                {CONSENTS.map((item, i) => (
                  <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={consents[i]}
                      onCheckedChange={v => setConsents(prev => prev.map((c, idx) => (idx === i ? !!v : c)))}
                      className="mt-0.5"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">七、家长确认</h2>
              <div><Label>家长 / 监护人姓名（电子确认） *</Label><Input value={f.confirm_name} onChange={e => set('confirm_name', e.target.value)} maxLength={100} /></div>
              <p className="text-xs text-muted-foreground">提交日期由系统自动记录。</p>
            </div>

            <Button onClick={submit} disabled={saving} className="w-full">
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> 提交中...</> : '提交报名表'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function EventSignupPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <SignupForm />
      </PageLayout>
    </LanguageProvider>
  );
}
