import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Music, ChevronRight, CalendarDays, User } from 'lucide-react';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import type { Language } from '@/i18n/translations';

interface LatestSermon {
  slug: string;
  date: string;
  title_en: string;
  title_zh: string;
  title_th: string;
  speaker: string;
  series_en: string | null;
  series_zh: string | null;
  series_th: string | null;
  audio_url: string | null;
  ppt_url: string | null;
}

const labels = {
  title: { en: "This Week's Sermon", zh: '本周讲道', th: 'คำเทศนาสัปดาห์นี้' },
  listen: { en: 'Listen & View', zh: '收听与查看', th: 'ฟังและดู' },
  viewAll: { en: 'View All Sermons', zh: '查看所有讲道', th: 'ดูคำเทศนาทั้งหมด' },
  noSermon: { en: 'No sermon available yet', zh: '暂无讲道内容', th: 'ยังไม่มีคำเทศนา' },
};

function lv(en: string, zh: string, th: string, lang: Language) {
  return lang === 'zh' ? zh : lang === 'th' ? th : en;
}

export default function ThisWeekSermon() {
  const { language } = useLanguage();
  const [sermon, setSermon] = useState<LatestSermon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('sermons')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();
      if (data) setSermon(data);
      setLoading(false);
    })();
  }, []);

  const l = (key: keyof typeof labels) => labels[key][language];

  if (loading) return null;

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4 max-w-4xl">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            {l('title')}
          </h2>
        </ScrollReveal>

        {sermon ? (
          <ScrollReveal delay={100}>
            <Link
              to={`/sermons/${sermon.slug}`}
              className="block bg-background rounded-xl p-6 md:p-8 shadow-md border border-border hover:shadow-lg hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music className="h-7 w-7 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {lv(sermon.title_en, sermon.title_zh, sermon.title_th, language)}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {sermon.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {sermon.speaker}
                    </span>
                  </div>
                  {(sermon.series_zh || sermon.series_en) && (
                    <span className="inline-block bg-accent/10 text-accent text-xs font-medium px-3 py-1 rounded-full">
                      {lv(sermon.series_en || '', sermon.series_zh || '', sermon.series_th || '', language)}
                    </span>
                  )}
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-accent transition-colors" />
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2 text-sm font-medium text-accent">
                {l('listen')}
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          </ScrollReveal>
        ) : (
          <p className="text-center text-muted-foreground">{l('noSermon')}</p>
        )}

        <ScrollReveal delay={200}>
          <div className="text-center mt-6">
            <Link
              to="/sermons"
              className="inline-flex items-center gap-1 text-sm text-accent hover:underline font-medium"
            >
              {l('viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
