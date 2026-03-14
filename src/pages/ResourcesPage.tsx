import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { BookOpen, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

function ResourcesContent() {
  const { language } = useLanguage();
  const rs = translations.resourcesSection;

  const resources = [rs.westminsterConfession, rs.westminsterCatechism, rs.heidelberg];

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(rs.title, language)}
        </h1>
        <div className="space-y-6">
          {resources.map((resource, i) => (
            <div key={i} className="bg-card rounded-lg p-8 shadow-sm border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
                    {t(resource.title, language)}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {t(resource.desc, language)}
                  </p>
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
