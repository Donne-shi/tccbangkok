import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { supabase } from '@/integrations/supabase/client';
import { Church, ClipboardList, Users, UserCheck, Home, Heart, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type Tri = { zh: string; en: string; th: string };
const L = (v: Tri, lang: string) => (lang === 'zh' ? v.zh : lang === 'th' ? v.th : v.en);

const steps = [
  {
    icon: Church,
    zh: '稳定聚会',
    en: 'Regular Attendance',
    th: 'เข้าร่วมสม่ำเสมอ',
    descZh: '全家稳定参加主日崇拜及团契至少一个月',
    descEn: 'The family attends Sunday worship and fellowship regularly for at least one month',
    descTh: 'ครอบครัวเข้าร่วมนมัสการและกลุ่มย่อยอย่างสม่ำเสมออย่างน้อยหนึ่งเดือน',
  },
  {
    icon: ClipboardList,
    zh: '家庭提交申请',
    en: 'Family Applies',
    th: 'ครอบครัวยื่นใบสมัคร',
    descZh: '以家庭为单位填写会友申请表，由一位代表提交',
    descEn: 'One representative submits the application on behalf of the household',
    descTh: 'ตัวแทนหนึ่งคนยื่นใบสมัครในนามของครอบครัว',
  },
  {
    icon: Users,
    zh: '长老约谈',
    en: 'Elder Interview',
    th: 'สัมภาษณ์โดยผู้อาวุโส',
    descZh: '教会长老与家庭面谈，了解信仰历程',
    descEn: 'Elders meet with the family to hear their faith journey',
    descTh: 'ผู้อาวุโสพบกับครอบครัวเพื่อฟังเส้นทางความเชื่อ',
  },
  {
    icon: UserCheck,
    zh: '审核通过',
    en: 'Approved',
    th: 'ได้รับการอนุมัติ',
    descZh: '长老会审核通过后，教会发送家庭成员资料填写链接',
    descEn: 'After approval, the church sends a link to complete the family member details',
    descTh: 'หลังอนุมัติ คริสตจักรจะส่งลิงก์ให้กรอกข้อมูลสมาชิกครอบครัว',
  },
  {
    icon: Home,
    zh: '完善家庭成员资料',
    en: 'Complete Family Profile',
    th: 'กรอกข้อมูลครอบครัว',
    descZh: '逐一填写每位家庭成员资料，系统建立家庭档案',
    descEn: 'Each family member is recorded and the household file is created',
    descTh: 'บันทึกสมาชิกแต่ละคนและสร้างแฟ้มครอบครัว',
  },
  {
    icon: Heart,
    zh: '正式会友家庭',
    en: 'Member Household',
    th: 'ครอบครัวสมาชิก',
    descZh: '正式成为会友家庭，并在主日崇拜中向会众介绍欢迎',
    descEn: 'The household officially joins the roster and is welcomed during Sunday worship',
    descTh: 'ครอบครัวเข้าสู่ทะเบียนสมาชิกและได้รับการต้อนรับในวันอาทิตย์',
  },
];

const labels = {
  formTitle: { zh: '会友申请表（以家庭为单位）', en: 'Membership Application (per household)', th: 'ใบสมัครสมาชิก (ต่อครอบครัว)' },
  formIntro: {
    zh: '本教会的会友身份以家庭为单位。请由一位家庭代表填写以下核心资料，此阶段无需填写每位成员的详细信息；审核通过后，教会会发送安全链接供您完善家庭成员资料。',
    en: 'Membership is held by the household. One representative completes the core details below; member-by-member details are collected later through a secure link after approval.',
    th: 'สมาชิกภาพเป็นแบบครอบครัว ตัวแทนหนึ่งคนกรอกข้อมูลหลักด้านล่าง ข้อมูลของสมาชิกแต่ละคนจะเก็บภายหลังผ่านลิงก์ที่ปลอดภัย',
  },
  sectionHousehold: { zh: '一、家庭基本资料', en: '1. Household Details', th: '1. ข้อมูลครอบครัว' },
  sectionChurch: { zh: '二、教会生活', en: '2. Church Life', th: '2. ชีวิตคริสตจักร' },
  sectionCovenant: { zh: '三、信仰告白与会友之约', en: '3. Confession & Covenant', th: '3. คำสารภาพและพันธสัญญา' },
  householdName: { zh: '家庭称号（如：陈家）', en: 'Household name (e.g. The Chen Family)', th: 'ชื่อครอบครัว' },
  applicantName: { zh: '申请代表姓名', en: 'Representative name', th: 'ชื่อผู้ยื่นแทนครอบครัว' },
  phone: { zh: '联系电话', en: 'Phone', th: 'โทรศัพท์' },
  wechat: { zh: '微信 / Line', en: 'WeChat / Line', th: 'WeChat / Line' },
  email: { zh: '电子邮箱', en: 'Email', th: 'อีเมล' },
  address: { zh: '家庭住址', en: 'Home address', th: 'ที่อยู่' },
  marital: { zh: '家庭状况', en: 'Household status', th: 'สถานภาพครอบครัว' },
  maritalOptions: [
    { v: 'couple_children', zh: '夫妻与子女', en: 'Couple with children', th: 'คู่สมรสและบุตร' },
    { v: 'couple', zh: '夫妻', en: 'Couple', th: 'คู่สมรส' },
    { v: 'single', zh: '单身个人', en: 'Single person', th: 'บุคคลโสด' },
    { v: 'single_parent', zh: '单亲家庭', en: 'Single parent', th: 'ครอบครัวพ่อแม่เลี้ยงเดี่ยว' },
    { v: 'other', zh: '其他', en: 'Other', th: 'อื่น ๆ' },
  ],
  duration: { zh: '在本教会聚会时间', en: 'How long has your family attended?', th: 'ครอบครัวเข้าร่วมนานเท่าใด' },
  durationOptions: [
    { zh: '少于一个月', en: 'Less than 1 month', th: 'น้อยกว่า 1 เดือน' },
    { zh: '1–3 个月', en: '1–3 months', th: '1–3 เดือน' },
    { zh: '3–6 个月', en: '3–6 months', th: '3–6 เดือน' },
    { zh: '6 个月–1 年', en: '6 months–1 year', th: '6 เดือน–1 ปี' },
    { zh: '1 年以上', en: 'More than 1 year', th: 'มากกว่า 1 ปี' },
  ],
  group: { zh: '目前参加的团契 / 小组', en: 'Current fellowship / small group', th: 'กลุ่มย่อยที่เข้าร่วม' },
  reason: {
    zh: '请简述家庭的信仰经历以及申请加入本教会的原因',
    en: 'Briefly share your family\u2019s faith journey and why you wish to join',
    th: 'แบ่งปันเส้นทางความเชื่อของครอบครัวและเหตุผลที่ต้องการเข้าร่วม',
  },
  extra: { zh: '其他希望教会知道的事项（可选）', en: 'Anything else we should know (optional)', th: 'ข้อมูลเพิ่มเติม (ไม่บังคับ)' },
  confession: {
    zh: '我们认同本教会的信仰告白（威斯敏斯特信条及要理问答）',
    en: 'We affirm the church\u2019s statement of faith (Westminster Standards)',
    th: 'เรายอมรับคำแถลงความเชื่อของคริสตจักร',
  },
  covenant: {
    zh: '我们愿意遵守会友之约：忠心参与主日崇拜与圣礼、顺服教会治理、按力奉献、彼此相爱。',
    en: 'We agree to the membership covenant: faithful worship, submission to church governance, generous giving, and love for one another.',
    th: 'เรายินดีรักษาพันธสัญญาสมาชิก: นมัสการอย่างสัตย์ซื่อ ยอมอยู่ใต้การปกครอง ถวายตามกำลัง และรักกัน',
  },
  yes: { zh: '是', en: 'Yes', th: 'ใช่' },
  no: { zh: '否', en: 'No', th: 'ไม่' },
  unsure: { zh: '不确定', en: 'Not sure', th: 'ไม่แน่ใจ' },
  submit: { zh: '提交家庭申请', en: 'Submit application', th: 'ส่งใบสมัคร' },
  submitting: { zh: '提交中...', en: 'Submitting...', th: 'กำลังส่ง...' },
  successTitle: { zh: '申请已提交', en: 'Application submitted', th: 'ส่งใบสมัครแล้ว' },
  successBody: {
    zh: '感谢您的申请！教会长老会尽快与您的家庭联系约谈。审核通过后，我们会发送「家庭成员资料」填写链接。',
    en: 'Thank you! An elder will contact your family to arrange an interview. After approval we will send a link to complete the family member details.',
    th: 'ขอบคุณ! ผู้อาวุโสจะติดต่อครอบครัวของคุณเพื่อนัดสัมภาษณ์ และจะส่งลิงก์กรอกข้อมูลสมาชิกหลังอนุมัติ',
  },
  required: {
    zh: '请填写家庭称号、代表姓名与联系电话，并勾选会友之约。',
    en: 'Household name, representative name, phone and the covenant agreement are required.',
    th: 'ต้องกรอกชื่อครอบครัว ชื่อตัวแทน เบอร์โทร และยอมรับพันธสัญญา',
  },
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
    household_name: '', applicant_name: '', phone: '', wechat: '', email: '', address: '',
    marital_status: '', attending_duration: '', current_group: '', agrees_confession: '',
    reason: '', extra_info: '', agrees_covenant: false,
  });
  const set = (k: keyof typeof f, v: string | boolean) => setF((prev) => ({ ...prev, [k]: v }));

  const getText = (step: typeof steps[0], field: 'title' | 'desc') => {
    if (field === 'title') return lang === 'zh' ? step.zh : lang === 'th' ? step.th : step.en;
    return lang === 'zh' ? step.descZh : lang === 'th' ? step.descTh : step.descEn;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.household_name.trim() || !f.applicant_name.trim() || !f.phone.trim() || !f.agrees_covenant) {
      toast.error(L(labels.required, lang));
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('household_membership_applications').insert({
        household_name: f.household_name.trim(),
        applicant_name: f.applicant_name.trim(),
        phone: f.phone.trim(),
        wechat: f.wechat.trim() || null,
        email: f.email.trim() || null,
        address: f.address.trim() || null,
        marital_status: f.marital_status || null,
        attending_duration: f.attending_duration || null,
        current_group: f.current_group.trim() || null,
        agrees_confession: f.agrees_confession || null,
        reason: f.reason.trim() || null,
        extra_info: f.extra_info.trim() || null,
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

        {/* Process */}
        <div className="max-w-5xl mx-auto mb-16">
          <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground text-center mb-10">
            {lang === 'zh' ? '入会流程' : lang === 'th' ? 'ขั้นตอนการสมัคร' : 'Membership Process'}
          </h3>

          <div className="hidden md:block relative">
            <div className="absolute top-10 left-[8%] right-[8%] h-0.5 bg-border" />
            <div className="grid grid-cols-6 gap-3">
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
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{L(labels.formIntro, lang)}</p>
              </div>

              <fieldset className="space-y-4">
                <legend className="font-semibold text-accent text-sm tracking-wide">{L(labels.sectionHousehold, lang)}</legend>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.householdName, lang)} *</label>
                    <input required value={f.household_name} onChange={(e) => set('household_name', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.applicantName, lang)} *</label>
                    <input required value={f.applicant_name} onChange={(e) => set('applicant_name', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{L(labels.phone, lang)} *</label>
                    <input required value={f.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
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
                      {labels.maritalOptions.map((o) => (
                        <option key={o.v} value={o.v}>{L(o, lang)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">{L(labels.address, lang)}</label>
                    <input value={f.address} onChange={(e) => set('address', e.target.value)} className={inputCls} />
                  </div>
                </div>
              </fieldset>

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
                  <textarea rows={5} value={f.reason} onChange={(e) => set('reason', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{L(labels.extra, lang)}</label>
                  <textarea rows={3} value={f.extra_info} onChange={(e) => set('extra_info', e.target.value)} className={inputCls} />
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="font-semibold text-accent text-sm tracking-wide">{L(labels.sectionCovenant, lang)}</legend>
                <div>
                  <label className="block text-sm font-medium mb-2">{L(labels.confession, lang)}</label>
                  <div className="flex gap-4">
                    {[['yes', labels.yes], ['no', labels.no], ['unsure', labels.unsure]].map(([v, lb]) => (
                      <label key={v as string} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="confession"
                          checked={f.agrees_confession === v}
                          onChange={() => set('agrees_confession', v as string)}
                        />
                        {L(lb as Tri, lang)}
                      </label>
                    ))}
                  </div>
                </div>
                <label className="flex items-start gap-3 text-sm leading-relaxed">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={f.agrees_covenant}
                    onChange={(e) => set('agrees_covenant', e.target.checked)}
                  />
                  <span>{L(labels.covenant, lang)} *</span>
                </label>
              </fieldset>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {L(submitting ? labels.submitting : labels.submit, lang)}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
