import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import type { Language } from '@/i18n/translations';
import { BookOpen, Download, Eye, ChevronRight } from 'lucide-react';
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

const theologyLessons = [
  { num: '01', title: '引言、上帝的启示、圣经' },
  { num: '02', title: '上帝的名字、上帝的属性、三位一体' },
  { num: '03', title: '上帝的预旨、预定' },
  { num: '04', title: '上帝的创造之工、天使' },
  { num: '05', title: '上帝的护理之工' },
  { num: '06', title: '上帝造人、上帝的形象、人的灵魂和身体、行为之约' },
  { num: '07', title: '人的堕落、罪、死亡' },
  { num: '08', title: '恩典之约' },
  { num: '09', title: '中保、耶稣基督的神人二性、耶稣基督的名字' },
  { num: '10', title: '耶稣基督的职分、耶稣基督的状态' },
  { num: '11', title: '教义标准、信经、加尔文主义五要义' },
  { num: '12', title: '呼召、重生、悔改归正' },
  { num: '13', title: '信心、信心的类型' },
  { num: '14', title: '称义、成圣' },
  { num: '15', title: '祷告' },
  { num: '16', title: '教会、教会职分、教会治理、教会惩戒' },
  { num: '17', title: '蒙恩之道、上帝的圣言、上帝的律法和福音' },
  { num: '18', title: '上帝的圣礼、洗礼' },
  { num: '19', title: '圣餐' },
  { num: '20', title: '人死后灵魂的状况、基督的再来、死人的复活、末世的审判、永恒' },
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

        {/* Systematic Theology Series */}
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
          {language === 'zh' ? '系统神学系列' : language === 'th' ? 'ชุดเทววิทยาเชิงระบบ' : 'Systematic Theology Series'}
        </h2>
        <div className="bg-card rounded-lg shadow-sm border border-border mb-12">
          <div className="p-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                  {language === 'zh' ? '改革宗系统神学讲义' : language === 'th' ? 'บันทึกเทววิทยาเชิงระบบปฏิรูป' : 'Reformed Systematic Theology Notes'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {language === 'zh' ? '共20课，涵盖从圣经论到末世论的系统神学核心内容。' : language === 'th' ? 'รวม 20 บทเรียนครอบคลุมเนื้อหาหลักของเทววิทยาเชิงระบบ' : '20 lessons covering core systematic theology from Bibliology to Eschatology.'}
                </p>
              </div>
            </div>
          </div>
          <Accordion type="single" collapsible className="px-6">
            {theologyLessons.map((lesson) => (
              <AccordionItem key={lesson.num} value={lesson.num}>
                <AccordionTrigger className="text-sm hover:no-underline">
                  <span className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                      {parseInt(lesson.num)}
                    </span>
                    <span className="text-left">{lesson.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-3 pb-2">
                    <a
                      href={`/pdfs/theology/${lesson.num}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Eye className="h-4 w-4" />
                      {t(rs.viewOnline, language)}
                    </a>
                    <a
                      href={`/pdfs/theology/${lesson.num}.pdf`}
                      download
                      className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity border border-border"
                    >
                      <Download className="h-4 w-4" />
                      {t(rs.download, language)}
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

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