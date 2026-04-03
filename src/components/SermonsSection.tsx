import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { Music } from 'lucide-react';

const sampleSermons = [
  { date: '2026-03-10', title: { en: 'The Grace of God', zh: '上帝的恩典', th: 'พระคุณของพระเจ้า' }, speaker: 'Pastor Mac Wiener' },
  { date: '2026-03-03', title: { en: 'Walking in Faith', zh: '凭信心行走', th: 'เดินในความเชื่อ' }, speaker: 'Elder Caleb Luo' },
  { date: '2026-02-25', title: { en: 'The Body of Christ', zh: '基督的身体', th: 'พระกายของพระคริสต์' }, speaker: 'Elder Martin Zhang' },
];

export default function SermonsSection() {
  const { language } = useLanguage();
  const sermons = translations.sermons;

  return (
    <section id="sermons" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
          {t(sermons.title, language)}
        </h2>
        <p className="text-muted-foreground text-center mb-12">{t(sermons.subtitle, language)}</p>
        <div className="space-y-4">
          {sampleSermons.map((sermon, i) => (
            <div
              key={i}
              className="bg-card rounded-lg p-5 shadow-sm border border-border flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Music className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-lg font-semibold text-foreground truncate">
                  {t(sermon.title, language)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {sermon.date} · {sermon.speaker}
                </p>
              </div>
              <button className="flex-shrink-0 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                {t(sermons.play, language)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
