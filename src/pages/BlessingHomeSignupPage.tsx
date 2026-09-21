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
import { ArrowLeft, HeartHandshake, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const BLESSING_HOME_EVENT = '青少年祝福之家爱心探访活动';

const GRADES = ['初中', '高中'];
const SERVICE_ROLES = ['游戏组', '礼物与物资组', '现场陪伴组', '接受统一安排'];

const SCHEDULE = [
  ['09:00', '集合出发'],
  ['10:00—11:30', '游戏互动、诗歌敬拜、关怀陪伴'],
  ['11:30—12:30', '午餐交流'],
  ['12:30—13:00', '餐后整理、清洁服务'],
  ['13:00—14:00', '返程及活动总结'],
];

const CONSENT_TEXT = [
  '本人已了解本次活动的地点、时间、内容及交通安排，同意我的孩子参加三一社区教会组织的青少年祝福之家爱心探访活动，并愿意配合教会的安全管理要求。',
  '午餐由孤儿院那边提供，结束后青少年可以自由为午餐和孤儿院进行奉献，鼓励青少年带一些现金进行奉献。',
  '出行由教会统一租车，请提醒孩子遵守规则参与活动。',
];

function SignupForm() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({
    student_name_zh: '', student_name_en: '', grade: '', phone: '',
    guardian_name: '', guardian_phone: '',
    backup_contact_name: '',
    has_special_notes: 'no', special_notes: '',
  });
  const [roles, setRoles] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);

  const set = (k: string, v: string) => setF(prev => ({ ...prev, [k]: v }));

  const submit = async () => {
    const need: [string, string][] = [
      ['student_name_zh', '青少年姓名'], ['grade', '年级'], ['phone', '联系电话'],
      ['guardian_name', '家长／监护人姓名'], ['guardian_phone', '家长联系电话'],
    ];
    for (const [k, label] of need) {
      if (!String((f as Record<string, string>)[k]).trim()) {
        toast({ title: `请填写${label}`, variant: 'destructive' });
        return;
      }
    }
    if (roles.length === 0) {
      toast({ title: '请选择至少一项服侍意向', variant: 'destructive' });
      return;
    }
    if (f.has_special_notes === 'yes' && !f.special_notes.trim()) {
      toast({ title: '请说明健康或安全事项', variant: 'destructive' });
      return;
    }
    if (!agreed) {
      toast({ title: '请阅读并勾选家长知情与同意', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('event_registrations').insert({
      event_name: BLESSING_HOME_EVENT,
      student_name_zh: f.student_name_zh.trim().slice(0, 100),
      student_name_en: f.student_name_en.trim().slice(0, 100) || null,
      grade: f.grade,
      group_level: f.grade === '初中' ? '初中组' : '高中组',
      phone: f.phone.trim().slice(0, 50),
      guardian_name: f.guardian_name.trim().slice(0, 100),
      guardian_phone: f.guardian_phone.trim().slice(0, 50),
      backup_contact_name: f.backup_contact_name.trim().slice(0, 200) || null,
      has_special_notes: f.has_special_notes === 'yes',
      special_notes: f.has_special_notes === 'yes' ? f.special_notes.trim().slice(0, 2000) : null,
      service_roles: roles,
      transport_option: 'church_bus',
      consents: { parent_consent: true },
      confirm_name: f.guardian_name.trim().slice(0, 100),
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
              <h1 className="font-heading text-2xl font-bold text-foreground">报名成功</h1>
              <p className="text-muted-foreground">
                感谢您的报名。同工将在活动前统一协调服侍安排与乘车信息，并与家长联系确认，请保持电话畅通。
              </p>
              <p className="text-foreground/80 italic">「你们要彼此相爱，像我爱你们一样。」</p>
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
          <HeartHandshake className="h-8 w-8 text-accent" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">青少年祝福之家爱心探访活动报名表</h1>
        </div>
        <p className="text-accent font-medium mb-8">三一社区教会</p>

        <Card className="mb-8">
          <CardContent className="pt-6 space-y-5 text-sm">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
              <p><span className="text-muted-foreground">活动时间：</span>2026年9月26日（周六）09:00—14:00</p>
              <p><span className="text-muted-foreground">探访地点：</span>House of Blessing Foundation（祝福之家基金会），泰国</p>
            </div>
            <div className="space-y-2 text-muted-foreground leading-relaxed">
              <p>
                本次活动将带领三一社区教会青少年前往祝福之家，探访和关怀当地儿童及青少年。该机构由基督教背景的事工设立，
                主要帮助因父母服刑、戒毒等原因暂时缺乏家庭照顾的孩子，目前照顾着 200 多位儿童及青少年。
              </p>
              <p>我们将通过游戏互动、诗歌、礼物赠送、午餐陪伴及餐后服务，学习关爱他人，在实际行动中活出基督的爱。</p>
            </div>
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground mb-2">活动安排</h2>
              <ul className="space-y-1">
                {SCHEDULE.map(([time, item]) => (
                  <li key={time} className="flex gap-3">
                    <span className="text-accent font-medium shrink-0 w-28">{time}</span>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">一、青少年基本信息</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>青少年姓名 *</Label><Input value={f.student_name_zh} onChange={e => set('student_name_zh', e.target.value)} maxLength={100} /></div>
                <div><Label>英文名</Label><Input value={f.student_name_en} onChange={e => set('student_name_en', e.target.value)} maxLength={100} /></div>
                <div><Label>联系电话 *</Label><Input value={f.phone} onChange={e => set('phone', e.target.value)} maxLength={50} /></div>
              </div>
              <div>
                <Label className="mb-2 block">年级 *</Label>
                <RadioGroup value={f.grade} onValueChange={v => set('grade', v)} className="flex flex-wrap gap-4">
                  {GRADES.map(g => (
                    <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                      <RadioGroupItem value={g} /> {g}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">二、家长及紧急联系人</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>家长／监护人姓名 *</Label><Input value={f.guardian_name} onChange={e => set('guardian_name', e.target.value)} maxLength={100} /></div>
                <div><Label>家长联系电话 *</Label><Input value={f.guardian_phone} onChange={e => set('guardian_phone', e.target.value)} maxLength={50} /></div>
              </div>
              <div>
                <Label>紧急联系人姓名及电话（如与家长不同）</Label>
                <Input value={f.backup_contact_name} onChange={e => set('backup_contact_name', e.target.value)} maxLength={200} placeholder="例如：张叔叔 08x-xxx-xxxx" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">三、服侍意向（可多选）</h2>
              <p className="text-sm text-muted-foreground">请选择你希望参与的服侍内容，最终由同工统一协调安排。</p>
              <div className="space-y-3">
                {SERVICE_ROLES.map(r => (
                  <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={roles.includes(r)}
                      onCheckedChange={v => setRoles(prev => (v ? [...prev, r] : prev.filter(x => x !== r)))}
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">四、健康及安全信息</h2>
              <Label className="block">是否有需要带队同工特别注意的健康或安全事项？ *</Label>
              <p className="text-sm text-muted-foreground">例如：食物过敏、需要携带的药物、行动限制等。</p>
              <RadioGroup value={f.has_special_notes} onValueChange={v => set('has_special_notes', v)} className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer"><RadioGroupItem value="no" /> 无</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><RadioGroupItem value="yes" /> 有</label>
              </RadioGroup>
              {f.has_special_notes === 'yes' && (
                <Textarea rows={4} placeholder="请说明" value={f.special_notes} onChange={e => set('special_notes', e.target.value)} maxLength={2000} />
              )}
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">五、家长知情与同意</h2>
              <div className="space-y-2 text-sm text-muted-foreground leading-relaxed rounded-md bg-secondary p-4">
                {CONSENT_TEXT.map(t => <p key={t}>{t}</p>)}
              </div>
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <Checkbox checked={agreed} onCheckedChange={v => setAgreed(!!v)} className="mt-0.5" />
                <span>我已阅读并同意上述内容。</span>
              </label>
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

export default function BlessingHomeSignupPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <SignupForm />
      </PageLayout>
    </LanguageProvider>
  );
}
