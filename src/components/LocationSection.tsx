import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { MapPin, Clock } from 'lucide-react';

export default function LocationSection() {
  const { language } = useLanguage();
  const loc = translations.location;

  return (
    <section id="location" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(loc.title, language)}
        </h2>
        <div className="bg-card rounded-lg p-8 shadow-sm border border-border text-center">
          <div className="flex items-center justify-center gap-2 text-foreground mb-3">
            <MapPin className="h-5 w-5 text-accent" />
            <span className="text-lg">{t(loc.address, language)}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5 text-accent" />
            <span>{t(loc.serviceTime, language)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
