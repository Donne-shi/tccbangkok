import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { Music, Users, Baby } from 'lucide-react';

export default function MinistriesSection() {
  const { language } = useLanguage();
  const ms = translations.ministriesSection;

  const ministries = [
    { ...ms.choir, icon: Music },
    { ...ms.youth, icon: Users },
    { ...ms.children, icon: Baby },
  ];

  return (
    <section id="ministries" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(ms.title, language)}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {ministries.map((ministry, i) => (
            <div key={i} className="bg-card rounded-lg overflow-hidden shadow-sm border border-border group">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={ministry.img}
                  alt={t(ministry.title, language)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {t(ministry.title, language)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(ministry.desc, language)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
