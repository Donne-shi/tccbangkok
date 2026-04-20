import { useState, useEffect } from 'react';
import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { BookOpen, ScrollText, FileText, Globe, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const iconMap: Record<string, any> = { BookOpen, ScrollText, FileText, Globe };

function ResourcesContent() {
  const { language } = useLanguage();
  const rs = translations.resourcesSection;
  const [categories, setCategories] = useState<any[]>([]);
  const [onlineResources, setOnlineResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      const { data } = await supabase
        .from('learning_resources')
        .select('*')
        .eq('published', true)
        .is('parent_type', null)
        .order('sort_order', { ascending: true });
      if (data) {
        setCategories(data.filter((r: any) => r.type === 'category'));
        setOnlineResources(data.filter((r: any) => r.type === 'online_resource'));
      }
      setLoading(false);
    };
    fetchResources();
  }, []);

  const tl = (item: any) => {
    const key = `title_${language === 'zh' ? 'zh' : language === 'th' ? 'th' : 'en'}` as string;
    return (item as any)[key] || item.title_en || item.title_zh;
  };
  const dl = (item: any) => {
    const key = `description_${language === 'zh' ? 'zh' : language === 'th' ? 'th' : 'en'}` as string;
    return (item as any)[key] || item.description_en || item.description_zh;
  };

  if (loading) {
    return (
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4 max-w-4xl text-center text-muted-foreground py-12">加载中...</div>
      </section>
    );
  }

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(rs.title, language)}
        </h1>

        <div className="space-y-4">
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || BookOpen;
            const isExternal = cat.url?.startsWith('http');
            const content = (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {typeof cat.icon === 'string' && cat.icon.length <= 2 ? (
                      <span className="text-xl">{cat.icon}</span>
                    ) : (
                      <IconComp className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{tl(cat)}</h3>
                    <p className="text-muted-foreground text-sm">{dl(cat)}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            );

            return isExternal ? (
              <a key={cat.id} href={cat.url} target="_blank" rel="noopener noreferrer"
                className="block bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors group">
                {content}
              </a>
            ) : (
              <Link key={cat.id} to={cat.url || '#'}
                className="block bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors group">
                {content}
              </Link>
            );
          })}
        </div>

        {onlineResources.length > 0 && (
          <>
            <h2 className="font-heading text-2xl font-bold text-foreground mt-12 mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              {t({ zh: '网络资源', en: 'Online Resources', th: 'แหล่งข้อมูลออนไลน์' }, language)}
            </h2>
            <div className="space-y-4">
              {onlineResources.map((res) => (
                <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer"
                  className="block bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xl">
                        {res.icon && res.icon.length <= 2 ? res.icon : <Globe className="h-5 w-5 text-primary" />}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{tl(res)}</h3>
                        <p className="text-muted-foreground text-sm">{dl(res)}</p>
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function ResourcesPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <ResourcesContent />
      </PageLayout>
    </LanguageProvider>
  );
}
