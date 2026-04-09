import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, Pause, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  published: boolean;
}

function DevotionalsList() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<DevotionalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('devotional_posts')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });
      if (data) setPosts(data as any);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const getTitle = (post: DevotionalPost) => {
    if (language === 'zh') return post.title_zh || post.title_en;
    if (language === 'th') return post.title_th || post.title_zh || post.title_en;
    return post.title_en || post.title_zh;
  };

  const labels = {
    title: { en: 'Devotional Sharing', zh: '灵修分享', th: 'การแบ่งปันภักดี' },
    subtitle: { en: 'Nourish your soul with daily reflections', zh: '每日灵修，滋养灵魂', th: 'เสริมสร้างจิตวิญญาณด้วยการใคร่ครวญ' },
    readMore: { en: 'Read More', zh: '阅读全文', th: 'อ่านเพิ่มเติม' },
    noContent: { en: 'No devotional posts yet', zh: '暂无灵修分享', th: 'ยังไม่มีการแบ่งปัน' },
    loading: { en: 'Loading...', zh: '加载中...', th: 'กำลังโหลด...' },
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {labels.title[language]}
          </h1>
          <p className="text-muted-foreground">{labels.subtitle[language]}</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{labels.loading[language]}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">{labels.noContent[language]}</div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {posts.map(post => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link to={`/devotionals/${post.slug}`} className="block group">
                        <h2 className="font-heading text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                          {getTitle(post)}
                        </h2>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                        <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{post.author}</span>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-3">{post.content.slice(0, 200)}...</p>
                      <div className="flex items-center gap-3 mt-4">
                        <Link to={`/devotionals/${post.slug}`}>
                          <Button variant="outline" size="sm">
                            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                            {labels.readMore[language]}
                          </Button>
                        </Link>
                        {post.audio_url && (
                          <span className="text-xs text-accent flex items-center gap-1">
                            <Play className="h-3 w-3" /> 
                            {{ en: 'Audio available', zh: '有音频', th: 'มีเสียง' }[language]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function DevotionalsPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <DevotionalsList />
      </PageLayout>
    </LanguageProvider>
  );
}
