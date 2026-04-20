import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ChevronRight, ExternalLink, Sprout } from 'lucide-react';

function YouthContent() {
  const { language } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('learning_resources')
        .select('*')
        .eq('parent_type', 'youth')
        .eq('published', true)
        .order('sort_order', { ascending: true });
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  const tl = (i: any) => {
    const k = `title_${language}` as const;
    return i[k] || i.title_en || i.title_zh;
  };
  const dl = (i: any) => {
    const k = `description_${language}` as const;
    return i[k] || i.description_en || i.description_zh;
  };

  const heading =
    language === 'zh' ? '青少年信仰成长'
    : language === 'th' ? 'การเติบโตด้านความเชื่อของเยาวชน'
    : 'Youth Faith Growth';
  const subtitle =
    language === 'zh' ? '为青少年精选的信仰学习资源 — 系统教义、圣经动画、启发课程。'
    : language === 'th' ? 'แหล่งเรียนรู้ความเชื่อสำหรับเยาวชน'
    : 'Curated faith resources for youth — doctrine, Bible animations, Alpha Youth.';

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/resources" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {language === 'zh' ? '返回学习资源' : language === 'th' ? 'กลับ' : 'Back to Resources'}
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <Sprout className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{heading}</h1>
        </div>
        <p className="text-muted-foreground mb-10">{subtitle}</p>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">…</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const isExternal = item.url?.startsWith('http');
              const content = (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {item.icon && item.icon.length <= 2
                        ? <span className="text-xl">{item.icon}</span>
                        : <Sprout className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{tl(item)}</h3>
                      {dl(item) && <p className="text-muted-foreground text-sm">{dl(item)}</p>}
                    </div>
                  </div>
                  {isExternal
                    ? <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    : <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />}
                </div>
              );
              return isExternal ? (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
                  className="block bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors group">
                  {content}
                </a>
              ) : (
                <Link key={item.id} to={item.url || '#'}
                  className="block bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors group">
                  {content}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function YouthResourcesPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <YouthContent />
      </PageLayout>
    </LanguageProvider>
  );
}
