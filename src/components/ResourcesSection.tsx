import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { BookOpen } from 'lucide-react';

export default function ResourcesSection() {
  const { language } = useLanguage();
  const rs = translations.resourcesSection;

  const resources = [rs.westminster, rs.heidelberg];

  return (
    <section id="resources" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(rs.title, language)}
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {resources.map((resource, i) => (
            <div key={i} className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {t(resource.title, language)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(resource.desc, language)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
