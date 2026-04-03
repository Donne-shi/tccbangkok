import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import type { Language } from '@/i18n/translations';
import { BookOpen, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const creedItems: { slug: string; title: Record<Language, string>; desc: Record<Language, string> }[] = [
  {
    slug: 'apostles-creed',
    title: { en: "Apostles' Creed", zh: '使徒信经', th: 'หลักข้อเชื่อของอัครทูต' },
    desc: { en: 'A foundational statement of Christian faith from the early church.', zh: '早期教会的基本信仰声明。', th: 'คำแถลงศรัทธาพื้นฐานจากคริสตจักรยุคแรก' },
  },
  {
    slug: 'nicene-creed',
    title: { en: 'Nicene Creed', zh: '尼西亚信经', th: 'หลักข้อเชื่อไนซีน' },
    desc: { en: 'Formulated at the Council of Nicaea in 325 AD, affirming the Trinity.', zh: '公元325年尼西亚公会议制定，确认三位一体。', th: 'กำหนดขึ้นที่สภาไนซีนในปี ค.ศ. 325' },
  },
  {
    slug: 'chalcedonian-creed',
    title: { en: 'Chalcedonian Creed', zh: '迦克敦信经', th: 'หลักข้อเชื่อคาลซีดอน' },
    desc: { en: 'Adopted in 451 AD, defining the two natures of Christ.', zh: '公元451年通过，定义基督的两个本性。', th: 'รับรองในปี ค.ศ. 451 กำหนดสองธรรมชาติของพระคริสต์' },
  },
  {
    slug: 'athanasian-creed',
    title: { en: 'Athanasian Creed', zh: '亚塔那修信经', th: 'หลักข้อเชื่ออาธานาเซียส' },
    desc: { en: 'A comprehensive exposition of Trinitarian doctrine and Christology.', zh: '对三位一体教义和基督论的全面阐述。', th: 'การอธิบายอย่างครอบคลุมเกี่ยวกับหลักคำสอนตรีเอกานุภาพ' },
  },
];

function ResourcesContent() {
  const { language } = useLanguage();
  const rs = translations.resourcesSection;

  const pdfResources = [rs.westminsterConfession, rs.westminsterCatechism, rs.heidelberg];

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(rs.title, language)}
        </h1>

        {/* Creeds section */}
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
          {language === 'zh' ? '教会信经' : language === 'th' ? 'หลักข้อเชื่อของคริสตจักร' : 'Church Creeds'}
        </h2>
        <div className="space-y-4 mb-12">
          {creedItems.map((creed, i) => (
            <div key={i} className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                    {t(creed.title, language)}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">{t(creed.desc, language)}</p>
                  <Link
                    to={`/creeds/${creed.slug}`}
                    className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Eye className="h-4 w-4" />
                    {t(rs.viewOnline, language)}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PDF Resources section */}
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
          {language === 'zh' ? '教理问答与信条' : language === 'th' ? 'คำสอนและคำสารภาพ' : 'Catechisms & Confessions'}
        </h2>
        <div className="space-y-4">
          {pdfResources.map((resource, i) => (
            <div key={i} className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                    {t(resource.title, language)}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">{t(resource.desc, language)}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/resources/${resource.slug}`}
                      className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Eye className="h-4 w-4" />
                      {t(rs.viewOnline, language)}
                    </Link>
                    <a
                      href={resource.pdfPath}
                      download
                      className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity border border-border"
                    >
                      <Download className="h-4 w-4" />
                      {t(rs.download, language)}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ResourcesPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <ResourcesContent />
      </PageLayout>
    </LanguageProvider>
  );
}
