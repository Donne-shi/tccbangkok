import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Play, Pause, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface DevotionalPost {
  id: string;
  title_zh: string;
  title_en: string;
  title_th: string;
  content: string;
  author: string;
  date: string;
  slug: string;
  audio_url: string | null;
}

function DevotionalDetail() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [post, setPost] = useState<DevotionalPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('devotional_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      if (data) setPost(data as any);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  const getTitle = (p: DevotionalPost) => {
    if (language === 'zh') return p.title_zh || p.title_en;
    if (language === 'th') return p.title_th || p.title_zh || p.title_en;
    return p.title_en || p.title_zh;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground">加载中...</div>;
  if (!post) return <div className="py-20 text-center text-muted-foreground">未找到文章</div>;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/devotionals" className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" />
          {{ en: 'Back to Devotionals', zh: '返回灵修分享', th: 'กลับไปหน้ารายการ' }[language]}
        </Link>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          {getTitle(post)}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{post.date}</span>
          <span className="flex items-center gap-1"><User className="h-4 w-4" />{post.author}</span>
        </div>

        {post.audio_url && (
          <div className="bg-card border border-border rounded-lg p-4 mb-8">
            <audio
              ref={audioRef}
              src={post.audio_url}
              onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
              onEnded={() => setPlaying(false)}
            />
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={togglePlay} className="shrink-0">
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={([v]) => { if (audioRef.current) audioRef.current.currentTime = v; }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          </div>
        )}

        <div className="prose prose-lg max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </div>
    </section>
  );
}

export default function DevotionalDetailPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <DevotionalDetail />
      </PageLayout>
    </LanguageProvider>
  );
}
