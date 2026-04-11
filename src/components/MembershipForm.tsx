import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { Download, FileText, Church, ClipboardList, Users, UserCheck, Heart } from 'lucide-react';
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
    descZh: '填写会友申请表，提交个人信息和信仰见证',
    descEn: 'Complete the membership application form with personal info and testimony',
    descTh: 'กรอกแบบฟอร์มสมัครสมาชิกพร้อมข้อมูลส่วนตัวและคำเป็นพยาน',
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

export default function MembershipForm() {
  const { language } = useLanguage();
  const m = translations.membership;
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', type: '0', children: '', message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t(m.success, language));
    setFormData({ name: '', email: '', phone: '', type: '0', children: '', message: '' });
  };

  const getText = (step: typeof steps[0], field: 'title' | 'desc') => {
    if (field === 'title') return language === 'zh' ? step.zh : language === 'th' ? step.th : step.en;
    return language === 'zh' ? step.descZh : language === 'th' ? step.descTh : step.descEn;
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
            {language === 'zh' ? '入会流程' : language === 'th' ? 'ขั้นตอนการสมัคร' : 'Membership Process'}
          </h3>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block relative">
            {/* Connecting line */}
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
                      {language === 'zh' ? `第${i + 1}步` : language === 'th' ? `ขั้นที่ ${i + 1}` : `Step ${i + 1}`}
                    </span>
                    <h4 className="font-semibold text-foreground text-sm mb-1.5">{getText(step, 'title')}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{getText(step, 'desc')}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: vertical timeline */}
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
                      {language === 'zh' ? `第${i + 1}步` : language === 'th' ? `ขั้นที่ ${i + 1}` : `Step ${i + 1}`}
                    </span>
                    <h4 className="font-semibold text-foreground text-sm mt-0.5">{getText(step, 'title')}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{getText(step, 'desc')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PDF and Form below */}
        <div className="max-w-xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm border border-border mb-10 overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-accent flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">
                    {language === 'zh' ? '会友申请表' : language === 'th' ? 'แบบฟอร์มสมัครสมาชิก' : 'Membership Application Form'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'zh' ? '在线预览或下载申请表' : language === 'th' ? 'ดูตัวอย่างหรือดาวน์โหลดแบบฟอร์ม' : 'Preview online or download the form'}
                  </p>
                </div>
              </div>
              <a
                href="/documents/membership-application.pdf"
                download
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-md font-semibold hover:opacity-90 transition-opacity duration-300 flex-shrink-0"
              >
                <Download className="h-4 w-4" />
                {language === 'zh' ? '下载' : language === 'th' ? 'ดาวน์โหลด' : 'Download'}
              </a>
            </div>
            <iframe
              src="/documents/membership-application.pdf"
              className="w-full border-t border-border"
              style={{ height: '500px' }}
              title={language === 'zh' ? '会友申请表预览' : language === 'th' ? 'ตัวอย่างแบบฟอร์ม' : 'Application Form Preview'}
            />
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-lg p-8 shadow-sm border border-border space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t(m.nameLabel, language)}</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t(m.emailLabel, language)}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t(m.phoneLabel, language)}</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t(m.typeLabel, language)}</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {m.types.map((type, i) => (
                  <option key={i} value={i}>{t(type, language)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t(m.childrenLabel, language)}</label>
              <textarea
                value={formData.children}
                onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                rows={2}
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{t(m.messageLabel, language)}</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity duration-300"
            >
              {t(m.submit, language)}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
