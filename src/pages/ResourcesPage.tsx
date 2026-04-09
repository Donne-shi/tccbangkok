import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { BookOpen, ScrollText, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    to: '/resources/theology-series',
    icon: BookOpen,
    title: { zh: '青少年圣经教义', en: 'Youth Bible Doctrine', th: 'หลักคำสอนพระคัมภีร์สำหรับเยาวชน' },
    desc: { zh: '共20课，涵盖从圣经论到末世论的系统神学核心内容。', en: '20 lessons covering core systematic theology from Bibliology to Eschatology.', th: 'รวม 20 บทเรียนครอบคลุมเนื้อหาหลักของเทววิทยาเชิงระบบ' },
  },
  {
    to: '/resources/creeds',
    icon: ScrollText,
    title: { zh: '教会信经', en: 'Church Creeds', th: 'หลักข้อเชื่อของคริสตจักร' },
    desc: { zh: '使徒信经、尼西亚信经、迦克敦信经、亚塔那修信经。', en: "Apostles', Nicene, Chalcedonian, and Athanasian Creeds.", th: 'หลักข้อเชื่อของอัครทูต ไนซีน คาลซีดอน และอาธานาเซียส' },
  },
  {
    to: '/resources/confessions',
    icon: FileText,
    title: { zh: '教理问答与信条', en: 'Catechisms & Confessions', th: 'คำสอนและคำสารภาพ' },
    desc: { zh: '威斯敏斯特信条、威斯敏斯特小要理问答、海德堡要理问答。', en: 'Westminster Confession, Westminster Shorter Catechism, Heidelberg Catechism.', th: 'คำสารภาพเวสต์มินสเตอร์ คำสอนเวสต์มินสเตอร์ คำสอนไฮเดลเบิร์ก' },
  },
];

function ResourcesContent() {
  const { language } = useLanguage();
  const rs = translations.resourcesSection;

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(rs.title, language)}
        </h1>

        <div className="space-y-4">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={cat.to}
              className="block bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <cat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                      {t(cat.title, language)}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t(cat.desc, language)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </Link>
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
