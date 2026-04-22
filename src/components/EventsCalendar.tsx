import { useMemo, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { Clock, CalendarDays, Sparkles, Star } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { feasts2026, type Feast } from '@/data/feasts';
import { cn } from '@/lib/utils';
import goodFridayPoster from '@/assets/good-friday-poster.png';

function parseISO(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function EventsCalendar() {
  const { language } = useLanguage();
  const events = translations.events;

  const [month, setMonth] = useState<Date>(new Date(2026, new Date().getMonth(), 1));
  const [selected, setSelected] = useState<Date | undefined>();

  const christianDates = useMemo(
    () => feasts2026.filter((f) => f.tradition === 'christian').map((f) => parseISO(f.date)),
    [],
  );
  const jewishDates = useMemo(
    () => feasts2026.filter((f) => f.tradition === 'jewish').map((f) => parseISO(f.date)),
    [],
  );

  const selectedFeast: Feast | undefined = useMemo(() => {
    if (!selected) return undefined;
    return feasts2026.find((f) => sameDay(parseISO(f.date), selected));
  }, [selected]);

  const today = new Date();
  const upcoming = useMemo(
    () =>
      feasts2026
        .filter((f) => parseISO(f.date) >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
        .slice(0, 6),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const fmtDate = (iso: string) => {
    const d = parseISO(iso);
    const locale = language === 'zh' ? 'zh-CN' : language === 'th' ? 'th-TH' : 'en-US';
    return d.toLocaleDateString(locale, { month: 'long', day: 'numeric' });
  };

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
        <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
          {t(events.weeklyTitle, language)}
        </h3>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {events.weekly.map((event, i) => (
            <div
              key={i}
              className="bg-card rounded-lg p-6 shadow-sm border border-border flex gap-4 items-start"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {t(event.name, language)}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                  <Clock className="h-4 w-4" />
                  <span>
                    {t(event.day, language)} {event.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Liturgical Calendar */}
        <div className="mb-16">
          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
            {t(events.calendarTitle, language)}
          </h3>
          <p className="text-muted-foreground text-sm mb-6">{t(events.calendarHint, language)}</p>

          <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
            {/* Calendar */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-2 mx-auto">
              <Calendar
                mode="single"
                selected={selected}
                onSelect={setSelected}
                month={month}
                onMonthChange={setMonth}
                fromDate={new Date(2026, 0, 1)}
                toDate={new Date(2026, 11, 31)}
                modifiers={{ christian: christianDates, jewish: jewishDates }}
                modifiersClassNames={{
                  christian:
                    'relative font-semibold text-accent-foreground bg-accent/30 hover:bg-accent/50 rounded-md',
                  jewish:
                    'relative font-semibold text-primary bg-primary/15 hover:bg-primary/25 rounded-md',
                }}
                className={cn('p-3 pointer-events-auto')}
              />
              <div className="flex items-center justify-center gap-4 px-3 pb-3 pt-1 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-sm bg-accent/50" />
                  {t(events.legendChristian, language)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-sm bg-primary/30" />
                  {t(events.legendJewish, language)}
                </span>
              </div>
            </div>

            {/* Detail / Upcoming */}
            <div className="space-y-4">
              {selectedFeast ? (
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {selectedFeast.tradition === 'christian' ? (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        {t(events.legendChristian, language)}
                      </>
                    ) : (
                      <>
                        <Star className="h-3.5 w-3.5 text-primary" />
                        {t(events.legendJewish, language)}
                      </>
                    )}
                    <span>· {fmtDate(selectedFeast.date)}</span>
                  </div>
                  <h4 className="font-heading text-xl font-bold text-foreground mb-2">
                    {t(selectedFeast.name, language)}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(selectedFeast.desc, language)}
                  </p>
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                  <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
                    {t(events.upcomingTitle, language)}
                  </h4>
                  <ul className="space-y-3">
                    {upcoming.map((f) => (
                      <li key={f.date}>
                        <button
                          onClick={() => {
                            const d = parseISO(f.date);
                            setSelected(d);
                            setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
                          }}
                          className="w-full text-left flex items-start gap-3 group"
                        >
                          <span
                            className={cn(
                              'shrink-0 mt-0.5 inline-flex items-center justify-center w-2 h-2 rounded-full',
                              f.tradition === 'christian' ? 'bg-accent' : 'bg-primary',
                            )}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                              {t(f.name, language)}
                            </div>
                            <div className="text-xs text-muted-foreground">{fmtDate(f.date)}</div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
