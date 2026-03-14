import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { FileText } from 'lucide-react';

export default function ConstitutionSection() {
  const { language } = useLanguage();
  const c = translations.constitution;

  return (
    <section id="constitution" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(c.title, language)}
        </h2>
        <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <p className="text-foreground leading-relaxed">{t(c.desc, language)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
