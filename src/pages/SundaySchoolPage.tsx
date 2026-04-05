import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Music, Video, Download, Calendar } from 'lucide-react';
import DocumentViewer from '@/components/DocumentViewer';

function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Bilibili
  const biliMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
  if (biliMatch) return `https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&autoplay=0`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

interface SundaySchoolContent {
  id: string;
  category: string;
  title: string;
  date: string;
  year: number;
  summary: string | null;
  ppt_url: string | null;
  song_links: { title: string; url: string }[];
  video_links: { title: string; url: string }[];
}

function SundaySchoolContent() {
  const { language } = useLanguage();
  const [contents, setContents] = useState<SundaySchoolContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('youth');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from('sunday_school_content')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) {
      setContents(data.map(item => ({
        ...item,
        song_links: (item.song_links as any) || [],
        video_links: (item.video_links as any) || [],
      })));
    }
    setLoading(false);
  };

  const filtered = contents.filter(c => c.category === activeTab);
  const years = [...new Set(filtered.map(c => c.year))].sort((a, b) => b - a);

  const labels = {
    title: { en: 'Sunday School', zh: '主日学', th: 'โรงเรียนวันอาทิตย์' },
    youth: { en: 'Youth', zh: '青少年', th: 'เยาวชน' },
    children: { en: 'Children', zh: '儿童', th: 'เด็ก' },
    noContent: { en: 'No content yet', zh: '暂无内容', th: 'ยังไม่มีเนื้อหา' },
    downloadPpt: { en: 'Download PPT', zh: '下载PPT', th: 'ดาวน์โหลด PPT' },
  };

  const l = (key: keyof typeof labels) => labels[key][language] || labels[key].en;

  return (
    <section className="py-8 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
          {l('title')}
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="youth">{l('youth')}</TabsTrigger>
            <TabsTrigger value="children">{l('children')}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : years.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">{l('noContent')}</div>
            ) : (
              years.map(year => (
                <div key={year} className="mb-8">
                  <h2 className="text-xl font-bold text-primary mb-4 border-b border-border pb-2">
                    {year}
                  </h2>
                  <div className="space-y-4">
                    {filtered.filter(c => c.year === year).map(item => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(item.date).toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'th' ? 'th-TH' : 'en-US')}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {item.summary && (
                            <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                          )}
                          {item.ppt_url && (
                            <div className="mb-3">
                              <DocumentViewer
                                url={item.ppt_url}
                                downloadLabel={l('downloadPpt')}
                              />
                            </div>
                          )}
                          {/* Embedded Videos */}
                          {item.video_links.length > 0 && (
                            <div className="space-y-3 mb-3">
                              {item.video_links.map((link, i) => {
                                const embedUrl = getEmbedUrl(link.url);
                                return embedUrl ? (
                                  <div key={i}>
                                    <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-1.5">
                                      <Video className="h-3.5 w-3.5 text-primary" />
                                      {link.title}
                                    </p>
                                    <div className="relative w-full rounded-lg overflow-hidden border border-border" style={{ paddingBottom: '56.25%' }}>
                                      <iframe
                                        src={embedUrl}
                                        className="absolute inset-0 w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={link.title}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                                    <Video className="h-3.5 w-3.5" />
                                    {link.title}
                                  </a>
                                );
                              })}
                            </div>
                          )}
                          {/* Song Links */}
                          {item.song_links.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                              {item.song_links.map((link, i) => (
                                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
                                  <Music className="h-3.5 w-3.5" />
                                  {link.title}
                                </a>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default function SundaySchoolPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <SundaySchoolContent />
      </PageLayout>
    </LanguageProvider>
  );
}
