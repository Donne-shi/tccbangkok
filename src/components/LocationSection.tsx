import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { MapPin, Clock } from 'lucide-react';

export default function LocationSection() {
  const { language } = useLanguage();
  const loc = translations.location;

  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.2!2d100.6308!3d13.5997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d604f0a5b51e1%3A0x0!2s99%2F558+Moo+8+Srinakarin+Road+Bang+Muang+Mueang+Samut+Prakan+10270!5e0!3m2!1sen!2sth!4v1700000000000";

  return (
    <section id="location" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(loc.title, language)}
        </h2>
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="aspect-video w-full">
            <iframe
              src={mapSrc}
              title="Bangkok Trinity Community Church Location"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
              <span className="text-lg">{t(loc.address, language)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 text-accent flex-shrink-0" />
              <span>{t(loc.serviceTime, language)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
