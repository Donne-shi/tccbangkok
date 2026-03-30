import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

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

  return (
    <section id="membership" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 max-w-xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          {t(m.title, language)}
        </h2>
        <p className="text-muted-foreground text-center mb-6">{t(m.intro, language)}</p>
        
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-accent flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">
                {language === 'zh' ? '会友申请表' : language === 'th' ? 'แบบฟอร์มสมัครสมาชิก' : 'Membership Application Form'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'zh' ? '下载并填写申请表' : language === 'th' ? 'ดาวน์โหลดและกรอกแบบฟอร์ม' : 'Download and fill out the form'}
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
    </section>
  );
}
