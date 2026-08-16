import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { supabase } from '@/integrations/supabase/client';
import { Church, ClipboardList, Users, UserCheck, Heart, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  {
    icon: Church,
    zh: '稳定聚会',
    en: 'Regular Attendance',
    th: 'เข้าร่วมสม่ำเสมอ',
    descZh: '稳定参加教会主日崇拜及团契活动至少一个月',
    descEn: 'Attend Sunday worship and fellowship regularly for at least one month',
    descTh: 'เข้าร่วมนมัสการวันอาทิตย์และกิจกรรมอย่างสม่ำเสมออย่างน้อยหนึ่งเดือน',
  },
  {
    icon: ClipboardList,
    zh: '填写申请表',
    en: 'Submit Application',
    th: 'ส่งใบสมัคร',
    descZh: '在线填写会友申请表，提交个人信息和信仰见证',
    descEn: 'Complete the online membership application with personal info and testimony',
    descTh: 'กรอกแบบฟอร์มสมัครสมาชิกออนไลน์พร้อมข้อมูลส่วนตัวและคำเป็นพยาน',
  },
  {
    icon: Users,
    zh: '长老约谈',
    en: 'Elder Interview',
    th: 'สัมภาษณ์โดยผู้อาวุโส',
    descZh: '教会长老将与您进行一次亲切的面谈，了解您的信仰历程',
    descEn: 'Church elders will have a friendly conversation about your faith journey',
    descTh: 'ผู้อาวุโสของคริสตจักรจะพูดคุยเกี่ยวกับเส้นทางความเชื่อของคุณ',
  },
  {
    icon: UserCheck,
    zh: '确定入会',
    en: 'Membership Confirmed',
    th: 'ยืนยันการเป็นสมาชิก',
    descZh: '经长老会审核通过后，正式成为教会会友',
    descEn: 'After approval by the elder board, you officially become a member',
    descTh: 'หลังจากได้รับการอนุมัติ คุณจะเป็นสมาชิกอย่างเป็นทางการ',
  },
  {
    icon: Heart,
    zh: '主日欢迎',
    en: 'Sunday Welcome',
    th: 'ต้อนรับวันอาทิตย์',
    descZh: '在主日崇拜中向全体会众介绍新会友，彼此欢迎',
    descEn: 'New members are introduced and welcomed during Sunday worship',
    descTh: 'สมาชิกใหม่จะได้รับการแนะนำและต้อนรับในวันอาทิตย์',
  },
];

type Tri = { zh: string; en: string; th: string };
const L = (v: Tri, lang: string) => (lang === 'zh' ? v.zh : lang === 'th' ? v.th : v.en);

const labels = {
  formTitle: { zh: '会友申请表', en: 'Membership Application', th: 'ใบสมัครสมาชิก' },
  formIntro: {
    zh: '请如实填写以下信息，教会长老将在收到申请后与您联系约谈。',
    en: 'Please fill in the information below. An elder will contact you for an interview.',
    th: 'กรุณากรอกข้อมูลด้านล่าง ผู้อาวุโสจะติดต่อคุณเพื่อนัดสัมภาษณ์',
  },
  sectionBasic: { zh: '一、基本信息', en: '1. Basic Information', th: '1. ข้อมูลพื้นฐาน' },
  sectionFaith: { zh: '二、信仰状况', en: '2. Faith Background', th: '2. ภูมิหลังความเชื่อ' },
  sectionChurch: { zh: '三、教会生活', en: '3. Church Life', th: '3. ชีวิตคริสตจักร' },
  sectionCovenant: { zh: '四、信仰告白与会友之约', en: '4. Confession & Covenant', th: '4. คำสารภาพและพันธสัญญา' },
  fullName: { zh: '姓名', en: 'Full name', th: 'ชื่อ-นามสกุล' },
  gender: { zh: '性别', en: 'Gender', th: 'เพศ' },
  male: { zh: '男', en: 'Male', th: 'ชาย' },
  female: { zh: '女', en: 'Female', th: 'หญิง' },
  birthDate: { zh: '出生日期', en: 'Date of birth', th: 'วันเกิด' },
  phone: { zh: '联系电话', en: 'Phone', th: 'โทรศัพท์' },
  wechat: { zh: '微信 / Line', en: 'WeChat / Line', th: 'WeChat / Line' },
  email: { zh: '电子邮箱', en: 'Email', th: 'อีเมล' },
  marital: { zh: '婚姻状况', en: 'Marital status', th: 'สถานภาพสมรส' },
  single: { zh: '未婚', en: 'Single', th: 'โสด' },
  married: { zh: '已婚', en: 'Married', th: 'สมรส' },
  otherMarital: { zh: '其他', en: 'Other', th: 'อื่น ๆ' },
  occupation: { zh: '职业', en: 'Occupation', th: 'อาชีพ' },
  isBeliever: { zh: '您是否已信主？', en: 'Have you received Christ?', th: 'คุณเชื่อในพระคริสต์แล้วหรือไม่?' },
  faithDate: { zh: '信主日期（大约）', en: 'Approximate date of conversion', th: 'วันที่เชื่อ (ประมาณ)' },
  isBaptized: { zh: '是否已受洗？', en: 'Have you been baptized?', th: 'คุณรับบัพติศมาแล้วหรือไม่?' },
  baptismDate: { zh: '受洗日期', en: 'Baptism date', th: 'วันรับบัพติศมา' },
  baptismChurch: { zh: '受洗教会', en: 'Baptizing church', th: 'คริสตจักรที่รับบัพติศมา' },
  yes: { zh: '是', en: 'Yes', th: 'ใช่' },
  no: { zh: '否', en: 'No', th: 'ไม่' },
  unsure: { zh: '不确定', en: 'Not sure', th: 'ไม่แน่ใจ' },
  duration: { zh: '在本教会聚会时间', en: 'How long have you attended?', th: 'เข้าร่วมคริสตจักรนี้นานเท่าใด' },
  durationOptions: [
    { zh: '少于一个月', en: 'Less than 1 month', th: 'น้อยกว่า 1 เดือน' },
    { zh: '1–3 个月', en: '1–3 months', th: '1–3 เดือน' },
    { zh: '3–6 个月', en: '3–6 months', th: '3–6 เดือน' },
    { zh: '6 个月–1 年', en: '6 months–1 year', th: '6 เดือน–1 ปี' },
    { zh: '1 年以上', en: 'More than 1 year', th: 'มากกว่า 1 ปี' },
  ],
  group: { zh: '目前参加的团契 / 小组', en: 'Current fellowship / small group', th: 'กลุ่มย่อยที่เข้าร่วม' },
  reason: {
    zh: '请简述您的信仰经历以及申请加入本教会的原因',
    en: 'Briefly share your faith journey and why you wish to join',
    th: 'แบ่งปันเส้นทางความเชื่อและเหตุผลที่ต้องการเข้าร่วม',
  },
  agreesConfession: {
    zh: '我认同本教会的信仰告白（威斯敏斯特信条及要理问答）',
    en: 'I affirm the church\u2019s statement of faith (Westminster Standards)',
    th: 'ข้าพเจ้ายอมรับคำแถลงความเชื่อของคริสตจักร',
  },
  agreesCovenant: {
    zh: '我愿意遵守会友之约：忠心参与主日崇拜与圣礼、顺服教会治理、按力奉献、彼此相爱。',
    en: 'I agree to the membership covenant: faithful worship, submission to church governance, generous giving, and love for one another.',
    th: 'ข้าพเจ้ายินดีรักษาพันธสัญญาสมาชิก: นมัสการอย่างสัตย์ซื่อ ยอมอยู่ใต้การปกครองของคริสตจักร ถวายตามกำลัง และรักกัน',
  },
  submit: { zh: '提交申请', en: 'Submit application', th: 'ส่งใบสมัคร' },
  submitting: { zh: '提交中...', en: 'Submitting...', th: 'กำลังส่ง...' },
  successTitle: { zh: '申请已提交', en: 'Application submitted', th: 'ส่งใบสมัครแล้ว' },
  successBody: {
    zh: '感谢您的申请！教会长老会尽快与您联系，安排面谈。',
    en: 'Thank you! An elder will contact you soon to arrange an interview.',
    th: 'ขอบคุณ! ผู้อาวุโสจะติดต่อคุณเพื่อนัดสัมภาษณ์เร็ว ๆ นี้',
  },
  required: { zh: '请填写姓名与联系电话，并勾选会友之约。', en: 'Name, phone and the covenant agreement are required.', th: 'ต้องกรอกชื่อ เบอร์โทร และยอมรับพันธสัญญา' },
  failed: { zh: '提交失败，请稍后重试。', en: 'Submission failed, please try again.', th: 'ส่งไม่สำเร็จ กรุณาลองใหม่' },
};

const inputCls =
  'w-full rounded-md border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';

export default function MembershipForm() {
  const { language } = useLanguage();
  const lang = language as string;
  const m = translations.membership;
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({
    full_name: '', gender: '', birth_date: '', phone: '', wechat: '', email: '',
    marital_status: '', occupation: '', is_believer: '', faith_date: '',
    is_baptized: '', baptism_date: '', baptism_church: '',
    attending_duration: '', current_group: '', agrees_confession: '',
    reason: '', agrees_covenant: false,
  });
  const set = (k: keyof typeof f, v: string | boolean) => setF((prev) => ({ ...prev, [k]: v }));

  const getText = (step: typeof steps[0], field: 'title' | 'desc') => {
    if (field === 'title') return lang === 'zh' ? step.zh : lang === 'th' ? step.th : step.en;
    return lang === 'zh' ? step.descZh : lang === 'th' ? step.descTh : step.descEn;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.full_name.trim() || !f.phone.trim() || !f.agrees_covenant) {
      toast.error(L(labels.required, lang));
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('member_applications').insert({
        full_name: f.full_name.trim(),
        gender: f.gender || null,
        birth_date: f.birth_date || null,
        phone: f.phone.trim(),
        wechat: f.wechat.trim() || null,
        email: f.email.trim() || null,
        marital_status: f.marital_status || null,
        occupation: f.occupation.trim() || null,
        is_believer: f.is_believer || null,
        faith_date: f.faith_date || null,
        is_baptized: f.is_baptized || null,
        baptism_date: f.baptism_date || null,
        baptism_church: f.baptism_church.trim() || null,
        attending_duration: f.attending_duration || null,
        current_group: f.current_group.trim() || null,
        agrees_confession: f.agrees_confession || null,
        reason: f.reason.trim() || null,
        agrees_covenant: f.agrees_covenant,
      });
      if (error) throw error;
      setDone(true);
    } catch {
      toast.error(L(labels.failed, lang));
    }
    setSubmitting(false);
  };

  return (
    <section id="membership" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          {t(m.title, language)}
        </h2>
        <p className="text-muted-foreground text-center mb-12">{t(m.intro, language)}</p>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground text-center mb-10">
            {lang === 'zh' ? '入会流程' : lang === 'th' ? 'ขั้นตอนการสมัคร' : 'Membership Process'}
          </h3>

          <div className="hidden md:block relative">
            <div className="absolute top-10 left-[10%] right-[10%] h-0.5 bg-border" />
            <div className="grid grid-cols-5 gap-4">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center relative">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4 relative z-10 shadow-lg">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-bold text-accent mb-1">
                      {lang === 'zh' ? `第${i + 1}步` : lang === 'th' ? `ขั้นที่ ${i + 1}` : `Step ${i + 1}`}
                    </span>
                    <h4 className="font-semibold text-foreground text-sm mb-1.5">{getText(step, 'title')}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{getText(step, 'desc')}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:hidden relative pl-10">
            <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-border" />
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative mb-8 last:mb-0">
                  <div className="absolute -left-10 w-9 h-9 rounded-full bg-primary flex items-center justify-center z-10 shadow-md">
                    <Icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                    <span className="text-xs font-bold text-accent">
                      {lang === 'zh' ? `第${i + 1}步` : lang === 'th' ? `ขั้นที่ ${i + 1}` : `Step ${i + 1}`}
                    </span>
                    <h4 className="font-semibold text-foreground text-sm mt-0.5">{getText(step, 'title')}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{getText(step, 'desc')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Application form */}
        <div className="max-w-2xl mx-auto">
          {done ? (
            <div className="bg-card rounded-lg p-10 border border-border shadow-sm text-center">
              <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
                {L(labels.successTitle, lang)}
              </h3>
              <p className="text-muted-foreground">{L(labels.successBody, lang)}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-border space-y-8">
              <div>
                <h3 className="font-heading text-2xl font-semibold text-foreground">{L(labels.formTitle, lang)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{L(labels.formIntro, lang)}</p>
              </div>

              {/* 基本信息 */}
              <fieldset className="space-y-4">
                <legend className="font-semibold text-accent text-sm tracking-wide">{L(labels.sectionBasic, lang)}</legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.fullName, lang)} *</label>
                    <input required value={f.full_name} onChange={(e) => set('full_name', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.phone, lang)} *</label>
                    <input required value={f.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.gender, lang)}</label>
                    <select value={f.gender} onChange={(e) => set('gender', e.target.value)} className={inputCls}>
                      <option value="">—</option>
                      <option value="male">{L(labels.male, lang)}</option>
                      <option value="female">{L(labels.female, lang)}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.birthDate, lang)}</label>
                    <input type="date" value={f.birth_date} onChange={(e) => set('birth_date', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.wechat, lang)}</label>
                    <input value={f.wechat} onChange={(e) => set('wechat', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.email, lang)}</label>
                    <input type="email" value={f.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.marital, lang)}</label>
                    <select value={f.marital_status} onChange={(e) => set('marital_status', e.target.value)} className={inputCls}>
                      <option value="">—</option>
                      <option value="single">{L(labels.single, lang)}</option>
                      <option value="married">{L(labels.married, lang)}</option>
                      <option value="other">{L(labels.otherMarital, lang)}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.occupation, lang)}</label>
                    <input value={f.occupation} onChange={(e) => set('occupation', e.target.value)} className={inputCls} />
                  </div>
                </div>
              </fieldset>

              {/* 信仰状况 */}
              <fieldset className="space-y-4">
                <legend className="font-semibold text-accent text-sm tracking-wide">{L(labels.sectionFaith, lang)}</legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.isBeliever, lang)}</label>
                    <select value={f.is_believer} onChange={(e) => set('is_believer', e.target.value)} className={inputCls}>
                      <option value="">—</option>
                      <option value="yes">{L(labels.yes, lang)}</option>
                      <option value="no">{L(labels.no, lang)}</option>
                      <option value="unsure">{L(labels.unsure, lang)}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.faithDate, lang)}</label>
                    <input type="date" value={f.faith_date} onChange={(e) => set('faith_date', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.isBaptized, lang)}</label>
                    <select value={f.is_baptized} onChange={(e) => set('is_baptized', e.target.value)} className={inputCls}>
                      <option value="">—</option>
                      <option value="yes">{L(labels.yes, lang)}</option>
                      <option value="no">{L(labels.no, lang)}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.baptismDate, lang)}</label>
                    <input type="date" value={f.baptism_date} onChange={(e) => set('baptism_date', e.target.value)} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">{L(labels.baptismChurch, lang)}</label>
                    <input value={f.baptism_church} onChange={(e) => set('baptism_church', e.target.value)} className={inputCls} />
                  </div>
                </div>
              </fieldset>

              {/* 教会生活 */}
              <fieldset className="space-y-4">
                <legend className="font-semibold text-accent text-sm tracking-wide">{L(labels.sectionChurch, lang)}</legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.duration, lang)}</label>
                    <select value={f.attending_duration} onChange={(e) => set('attending_duration', e.target.value)} className={inputCls}>
                      <option value="">—</option>
                      {labels.durationOptions.map((o) => (
                        <option key={o.en} value={o.zh}>{L(o, lang)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.group, lang)}</label>
                    <input value={f.current_group} onChange={(e) => set('current_group', e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{L(labels.reason, lang)}</label>
                  <textarea rows={5} value={f.reason} onChange={(e) => set('reason', e.target.value)} className={`${inputCls} resize-none`} />
                </div>
              </fieldset>

              {/* 信仰告白与会友之约 */}
              <fieldset className="space-y-4">
                <legend className="font-semibold text-accent text-sm tracking-wide">{L(labels.sectionCovenant, lang)}</legend>
                <label className="flex items-start gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={f.agrees_confession === 'yes'}
                    onChange={(e) => set('agrees_confession', e.target.checked ? 'yes' : '')}
                    className="mt-1 h-4 w-4 accent-current"
                  />
                  <span>{L(labels.agreesConfession, lang)}</span>
                </label>
                <label className="flex items-start gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={f.agrees_covenant}
                    onChange={(e) => set('agrees_covenant', e.target.checked)}
                    className="mt-1 h-4 w-4 accent-current"
                  />
                  <span>{L(labels.agreesCovenant, lang)} *</span>
                </label>
              </fieldset>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent text-accent-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? L(labels.submitting, lang) : L(labels.submit, lang)}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
