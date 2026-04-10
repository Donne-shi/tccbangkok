import { useParams } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { Download } from 'lucide-react';

function ResourceViewContent() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const rs = translations.resourcesSection;

  const resourceMap: Record<string, typeof rs.heidelberg> = {
    'westminster-confession': rs.westminsterConfession,
    'westminster-catechism': rs.westminsterCatechism,
    'westminster-larger-catechism': rs.westminsterLargerCatechism,
    'heidelberg': rs.heidelberg,
  };

  const resource = slug ? resourceMap[slug] : null;

  if (!resource) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Resource not found.</p>
      </div>
    );
  }

  return (
    <section className="py-8 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            {t(resource.title, language)}
          </h1>
          <a
            href={resource.pdfPath}
            download
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Download className="h-4 w-4" />
            {t(rs.download, language)}
          </a>
        </div>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          {t(resource.desc, language)}
        </p>
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <iframe
            src={resource.pdfPath}
            className="w-full"
            style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}
            title={t(resource.title, language)}
          />
        </div>
      </div>
    </section>
  );
}

export default function ResourceViewPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <ResourceViewContent />
      </PageLayout>
    </LanguageProvider>
  );
}
