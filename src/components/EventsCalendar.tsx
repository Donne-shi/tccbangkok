import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { Clock, CalendarDays } from 'lucide-react';
import goodFridayPoster from '@/assets/good-friday-poster.png';

export default function EventsCalendar() {
  const { language } = useLanguage();
  const events = translations.events;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          {t(events.title, language)}
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          {t(events.subtitle, language)}
        </p>

        {/* Weekly schedule */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {events.weekly.map((event, i) => (
            <div key={i} className="bg-card rounded-lg p-6 shadow-sm border border-border flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {t(event.name, language)}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{t(event.day, language)} {event.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current month featured event */}
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground text-center mb-6">
            {t(events.featuredTitle, language)}
          </h3>
          <div className="max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg border border-border">
            <img
              src={goodFridayPoster}
              alt="Good Friday Service"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
