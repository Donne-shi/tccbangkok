import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { MapPin, BookOpen } from 'lucide-react';

export default function HeroSection() {
  const { language } = useLanguage();
  const hero = translations.hero;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center">
      <div className="absolute inset-0 bg-primary" />
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
          {t(hero.title, language)}
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/80 mb-8">
          {t(hero.subtitle, language)}
        </p>
        <div className="bg-card/15 backdrop-blur-sm rounded-lg px-6 py-4 mb-10 inline-block">
          <p className="text-sm text-primary-foreground/70 uppercase tracking-wider mb-1">
            {t(hero.themeLabel, language)}
          </p>
          <p className="font-heading text-2xl md:text-3xl text-accent font-semibold">
            {t(hero.theme, language)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollTo('location')}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity duration-300"
          >
            <MapPin className="h-5 w-5" />
            {t(hero.cta1, language)}
          </button>
          <button
            onClick={() => scrollTo('sermons')}
            className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm text-primary-foreground border border-primary-foreground/30 px-8 py-3 rounded-md font-semibold hover:bg-card/30 transition-colors duration-300"
          >
            <BookOpen className="h-5 w-5" />
            {t(hero.cta2, language)}
          </button>
        </div>
      </div>
    </section>
  );
}
