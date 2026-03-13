import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { FileText } from 'lucide-react';

export default function ConstitutionSection() {
  const { language } = useLanguage();

  const title = { en: 'Church Constitution', zh: '教会章程', th: 'ธรรมนูญคริสตจักร' };
  const desc = {
    en: 'The Constitution of Trinity Community Church was adopted on November 26, 2023. It establishes the governance, membership, and doctrinal standards of our church. The church is independent of any denomination and stands within the tradition of the Reformation.',
    zh: '三一社区教会章程于2023年11月26日通过。该章程确立了教会的治理结构、会友制度和教义标准。教会独立于任何宗派，继承宗教改革传统。',
    th: 'ธรรมนูญของคริสตจักรชุมชนตรีเอกานุภาพได้รับการรับรองเมื่อวันที่ 26 พฤศจิกายน 2023 กำหนดการปกครอง สมาชิกภาพ และมาตรฐานหลักคำสอนของคริสตจักร',
  };

  return (
    <section id="constitution" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(title, language)}
        </h2>
        <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <p className="text-foreground leading-relaxed">{t(desc, language)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
