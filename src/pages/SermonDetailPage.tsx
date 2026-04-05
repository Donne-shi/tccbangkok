import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { Music, Download, FileText, BookOpen, User, CalendarDays } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import DocumentViewer from '@/components/DocumentViewer';
import type { Language } from '@/i18n/translations';

interface DbSermon {
  slug: string;
  date: string;
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

const lv = (en: string | null, zh: string | null, th: string | null, lang: Language) =>
  lang === 'zh' ? zh : lang === 'th' ? th : en;

function SermonDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [sermon, setSermon] = useState<DbSermon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from('sermons')
        .select('*')
        .eq('slug', slug)
        .single();
      setSermon(data);
      setLoading(false);
    })();
  }, [slug]);

  const labels = {
    speaker: { en: 'Speaker', zh: '讲员', th: 'ผู้เทศนา' },
    date: { en: 'Date', zh: '日期', th: 'วันที่' },
    audio: { en: 'Sermon Audio', zh: '讲道音频', th: 'เสียงคำเทศนา' },
    audioComingSoon: { en: 'Audio coming soon', zh: '音频即将上线', th: 'เสียงเร็วๆ นี้' },
    ppt: { en: 'Sermon Slides', zh: '讲道幻灯片', th: 'สไลด์คำเทศนา' },
    pptComingSoon: { en: 'Slides coming soon', zh: '幻灯片即将上线', th: 'สไลด์เร็วๆ นี้' },
    downloadPpt: { en: 'Download Slides', zh: '下载幻灯片', th: 'ดาวน์โหลดสไลด์' },
    notFound: { en: 'Sermon not found.', zh: '未找到该讲道。', th: 'ไม่พบคำเทศนา' },
  };
  const l = (key: keyof typeof labels) => labels[key][language];

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading...</div>;

  if (!sermon) {
    return <div className="py-20 text-center"><p className="text-muted-foreground">{l('notFound')}</p></div>;
  }

  const title = lv(sermon.title_en, sermon.title_zh, sermon.title_th, language);
  const series = lv(sermon.series_en, sermon.series_zh, sermon.series_th, language);
  const scripture = lv(sermon.scripture_en, sermon.scripture_zh, sermon.scripture_th, language);

  return (
    <section className="py-8 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          {series && (
            <span className="inline-block bg-accent/10 text-accent text-sm font-medium px-3 py-1 rounded-full mb-3">
              {series}
            </span>
          )}
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-foreground mb-4">{title}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              <span>{sermon.speaker}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-accent" />
              <span>{sermon.date}</span>
            </div>
            {scripture && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <span>{scripture}</span>
              </div>
            )}
          </div>
        </div>

        {/* Audio */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Music className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-heading text-lg font-semibold text-foreground">{l('audio')}</h2>
          </div>
          {sermon.audio_url ? (
            <AudioPlayer src={sermon.audio_url} />
          ) : (
            <div className="bg-secondary rounded-md p-4 text-center">
              <p className="text-muted-foreground text-sm">{l('audioComingSoon')}</p>
            </div>
          )}
        </div>

        {/* Slides */}
        {sermon.ppt_url ? (
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <DocumentViewer
              url={sermon.ppt_url}
              title={l('ppt')}
              downloadLabel={l('downloadPpt')}
            />
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground">{l('ppt')}</h2>
            </div>
            <div className="bg-secondary rounded-md p-4 text-center">
              <p className="text-muted-foreground text-sm">{l('pptComingSoon')}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function SermonDetailPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <SermonDetailContent />
      </PageLayout>
    </LanguageProvider>
  );
}
