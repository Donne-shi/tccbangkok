import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { Music, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Language } from '@/i18n/translations';

interface DbSermon {
  id: string;
  slug: string;
  date: string;
  year: number;
  title_en: string;
  title_zh: string;
  title_th: string;
  speaker: string;
  series_en: string | null;
  series_zh: string | null;
  series_th: string | null;
  scripture_en: string | null;
  scripture_zh: string | null;
  scripture_th: string | null;
  audio_url: string | null;
  ppt_url: string | null;
}

function getTitle(s: DbSermon, lang: Language) {
  return lang === 'zh' ? s.title_zh : lang === 'th' ? s.title_th : s.title_en;
}
function getSeries(s: DbSermon, lang: Language) {
  const v = lang === 'zh' ? s.series_zh : lang === 'th' ? s.series_th : s.series_en;
  return v || null;
}

export default function SermonsSection() {
  const { language } = useLanguage();
  const sermonsT = translations.sermons;
  const [sermons, setSermons] = useState<DbSermon[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('sermons')
        .select('*')
        .order('date', { ascending: false });
      if (data) {
        setSermons(data);
        const yrs = [...new Set(data.map(s => s.year))].sort((a, b) => b - a);
        setYears(yrs);
        if (yrs.length) setActiveYear(yrs[0]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = sermons.filter(s => s.year === activeYear);

  // Group by series
  const grouped: { seriesLabel: string | null; items: DbSermon[] }[] = [];
  let currentGroup: typeof grouped[0] | null = null;
  for (const sermon of filtered) {
    const seriesKey = sermon.series_en || '__none__';
    if (!currentGroup || (currentGroup.items[0]?.series_en || '__none__') !== seriesKey) {
      currentGroup = { seriesLabel: getSeries(sermon, language), items: [] };
      grouped.push(currentGroup);
    }
    currentGroup.items.push(sermon);
  }

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <section id="sermons" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
          {t(sermonsT.title, language)}
        </h2>
        <p className="text-muted-foreground text-center mb-8">{t(sermonsT.subtitle, language)}</p>

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

        <div className="space-y-8">
          {grouped.map((group, gi) => (
            <div key={gi}>
              {group.seriesLabel && (
                <div className="flex items-center gap-2 mb-3">
                  <ChevronRight className="h-4 w-4 text-accent" />
                  <h3 className="font-heading text-lg font-semibold text-accent">
                    {group.seriesLabel}
                  </h3>
                </div>
              )}
              <div className="space-y-3">
                {group.items.map((sermon) => (
                  <Link
                    key={sermon.id}
                    to={`/sermons/${sermon.slug}`}
                    className="bg-card rounded-lg p-5 shadow-sm border border-border flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-accent/20 block"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Music className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-base font-semibold text-foreground truncate">
                        {getTitle(sermon, language)}
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
