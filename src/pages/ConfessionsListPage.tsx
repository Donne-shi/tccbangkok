import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { BookOpen, Eye, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function ConfessionsListContent() {
  const { language } = useLanguage();
  const rs = translations.resourcesSection;
  const pdfResources = [rs.westminsterConfession, rs.westminsterCatechism, rs.westminsterLargerCatechism, rs.heidelberg];

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/resources" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" />
          {language === 'zh' ? '返回资源推荐' : language === 'th' ? 'กลับไปแหล่งข้อมูล' : 'Back to Resources'}
        </Link>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {language === 'zh' ? '教理问答与信条' : language === 'th' ? 'คำสอนและคำสารภาพ' : 'Catechisms & Confessions'}
        </h1>

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

export default function ConfessionsListPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <ConfessionsListContent />
      </PageLayout>
    </LanguageProvider>
  );
}
