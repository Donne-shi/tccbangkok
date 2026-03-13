import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';

export default function StatementOfFaith() {
  const { language } = useLanguage();
  const faith = translations.faith;

  return (
    <section id="faith" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12 animate-fade-in">
          {t(faith.title, language)}
        </h2>
        <div className="space-y-6">
          {faith.articles.map((article, i) => (
            <div
              key={i}
              className="bg-card rounded-lg p-6 shadow-sm border border-border animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <p className="text-foreground leading-relaxed">{t(article, language)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
