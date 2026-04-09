import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { BookOpen, Download, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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

function TheologySeriesContent() {
  const { language } = useLanguage();
  const rs = translations.resourcesSection;

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === 'zh' ? '返回推荐资源' : language === 'th' ? 'กลับไปหน้าทรัพยากร' : 'Back to Resources'}
        </Link>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          {language === 'zh' ? '青少年圣经教义' : language === 'th' ? 'หลักคำสอนพระคัมภีร์สำหรับเยาวชน' : 'Youth Bible Doctrine'}
        </h1>
        <p className="text-muted-foreground mb-10">
          {language === 'zh'
            ? '共20课，涵盖从圣经论到末世论的系统神学核心内容。'
            : language === 'th'
            ? 'รวม 20 บทเรียนครอบคลุมเนื้อหาหลักของเทววิทยาเชิงระบบ'
            : '20 lessons covering core systematic theology from Bibliology to Eschatology.'}
        </p>

        <div className="space-y-3">
          {theologyLessons.map((lesson) => (
            <div
              key={lesson.num}
              className="bg-card rounded-lg p-5 shadow-sm border border-border flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex-shrink-0">
                  {parseInt(lesson.num)}
                </span>
                <span className="text-foreground font-medium text-sm md:text-base">{lesson.title}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a
                  href={`/pdfs/theology/${lesson.num}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1.5 rounded-md text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {t(rs.viewOnline, language)}
                </a>
                <a
                  href={`/pdfs/theology/${lesson.num}.pdf`}
                  download
                  className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-xs font-medium hover:opacity-90 transition-opacity border border-border"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t(rs.download, language)}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TheologySeriesPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <TheologySeriesContent />
      </PageLayout>
    </LanguageProvider>
  );
}
