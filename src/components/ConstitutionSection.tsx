import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { Download, FileText } from 'lucide-react';

export default function ConstitutionSection() {
  const { language } = useLanguage();
  const c = translations.constitution;
  const rs = translations.resourcesSection;

  return (
    <section id="constitution" className="py-8 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            {t(c.title, language)}
          </h1>
          <a
            href="/documents/church-constitution.pdf"
            download
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Download className="h-4 w-4" />
            {t(rs.download, language)}
          </a>
        </div>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(c.desc, language)}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <iframe
            src="/documents/church-constitution.pdf"
            className="w-full"
            style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}
            title={t(c.title, language)}
          />
        </div>
      </div>
    </section>
  );
}
