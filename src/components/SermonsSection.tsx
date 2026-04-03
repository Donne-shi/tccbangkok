import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { Music, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sermonsByYear, years } from '@/data/sermons';
import type { Sermon } from '@/data/sermons';

export default function SermonsSection() {
  const { language } = useLanguage();
  const sermonsT = translations.sermons;
  const [activeYear, setActiveYear] = useState(years[0]);

  const sermons = sermonsByYear[activeYear] || [];

  // Group by series
  const grouped: { series: Sermon['series']; items: Sermon[] }[] = [];
  let currentGroup: typeof grouped[0] | null = null;

  for (const sermon of sermons) {
    const seriesKey = sermon.series ? t(sermon.series, 'en') : '__none__';
    if (!currentGroup || (currentGroup.series ? t(currentGroup.series, 'en') : '__none__') !== seriesKey) {
      currentGroup = { series: sermon.series || undefined, items: [] };
      grouped.push(currentGroup);
    }
    currentGroup.items.push(sermon);
  }

  return (
    <section id="sermons" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
          {t(sermonsT.title, language)}
        </h2>
        <p className="text-muted-foreground text-center mb-8">{t(sermonsT.subtitle, language)}</p>

        {/* Year tabs */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeYear === year
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Sermon list */}
        <div className="space-y-8">
          {grouped.map((group, gi) => (
            <div key={gi}>
              {group.series && (
                <div className="flex items-center gap-2 mb-3">
                  <ChevronRight className="h-4 w-4 text-accent" />
                  <h3 className="font-heading text-lg font-semibold text-accent">
                    {t(group.series, language)}
                  </h3>
                </div>
              )}
              <div className="space-y-3">
                {group.items.map((sermon, i) => (
                  <Link
                    key={i}
                    to={`/sermons/${sermon.slug}`}
                    className="bg-card rounded-lg p-5 shadow-sm border border-border flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-accent/20 block"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Music className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-base font-semibold text-foreground truncate">
                        {t(sermon.title, language)}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {sermon.date} · {sermon.speaker}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
