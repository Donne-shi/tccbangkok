import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';

function AlphaContent() {
  const { language } = useLanguage();
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('learning_resources')
        .select('*')
        .eq('parent_type', 'youth-alpha')
        .eq('published', true)
        .order('sort_order', { ascending: true });
      setEpisodes(data || []);
      if (data && data[0]) {
        setActiveUrl(data[0].url);
        setActiveTitle(data[0][`title_${language}`] || data[0].title_en);
      }
      setLoading(false);
    })();
  }, []);

  const tl = (i: any) => i[`title_${language}`] || i.title_en || i.title_zh;

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/resources/youth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {language === 'zh' ? '返回青少年资源' : language === 'th' ? 'กลับ' : 'Back'}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-2">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            {language === 'zh' ? '启发课程 (Alpha Youth)' : 'Alpha Youth Series'}
          </h1>
          <a href="https://alphacanada.org/youth/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            alphacanada.org/youth <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <p className="text-muted-foreground mb-8">
          {language === 'zh' ? '共10集 · 探索人生、信仰与意义。点击任意一集开始观看。'
            : language === 'th' ? '10 ตอน — สำรวจชีวิต ความเชื่อ และความหมาย'
            : '10 episodes — exploring life, faith and meaning. Click any episode to watch.'}
        </p>

        {/* Player */}
        {activeUrl && (
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mb-8">
            <div className="aspect-video bg-black">
              <iframe
                key={activeUrl}
                src={activeUrl}
                allow="encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                title={activeTitle}
              />
            </div>
            <div className="p-4 border-t border-border">
              <p className="font-heading text-base font-semibold text-foreground">{activeTitle}</p>
            </div>
          </div>
        )}

        {/* Episode list */}
        {loading ? (
          <div className="text-center text-muted-foreground py-12">…</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {episodes.map((ep) => {
              const isActive = ep.url === activeUrl;
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    setActiveUrl(ep.url);
                    setActiveTitle(tl(ep));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-left flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                    isActive
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                  }`}>
                    <Play className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{tl(ep)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function AlphaYouthPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <AlphaContent />
      </PageLayout>
    </LanguageProvider>
  );
}
