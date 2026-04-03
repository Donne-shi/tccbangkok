import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { MapPin, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

function FloatingOrb({ className }: { className: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
      style={{ background: 'hsl(var(--accent))' }}
    />
  );
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [text, started]);

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="inline-block w-0.5 h-[1em] bg-accent ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

export default function HeroSection() {
  const { language } = useLanguage();
  const hero = translations.hero;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-primary" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, hsl(var(--accent) / 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(var(--accent) / 0.15) 0%, transparent 50%)',
        }}
      />

      {/* Floating orbs */}
      <FloatingOrb className="w-72 h-72 -top-20 -left-20 animate-[float_8s_ease-in-out_infinite]" />
      <FloatingOrb className="w-96 h-96 -bottom-32 -right-32 animate-[float_10s_ease-in-out_infinite_reverse]" />
      <FloatingOrb className="w-48 h-48 top-1/3 right-1/4 animate-[float_6s_ease-in-out_infinite_2s]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Church name with stagger */}
        <h1
          className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {t(hero.title, language)}
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl text-primary-foreground/80 mb-8"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
          }}
        >
          {t(hero.subtitle, language)}
        </p>

        {/* Theme card with glow */}
        <div
          className="relative inline-block mb-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          <div className="absolute -inset-1 bg-accent/20 rounded-xl blur-lg" />
          <div className="relative bg-card/15 backdrop-blur-sm rounded-lg px-8 py-5 border border-accent/20">
            <p className="text-sm text-primary-foreground/70 uppercase tracking-wider mb-1">
              {t(hero.themeLabel, language)}
            </p>
            <p className="font-heading text-2xl md:text-3xl text-accent font-semibold">
              {mounted ? <TypewriterText text={t(hero.theme, language)} delay={800} /> : t(hero.theme, language)}
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
          }}
        >
          <button
            onClick={() => scrollTo('location')}
            className="group inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-md font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            <MapPin className="h-5 w-5 transition-transform group-hover:scale-110" />
            {t(hero.cta1, language)}
          </button>
          <button
            onClick={() => scrollTo('sermons')}
            className="group inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm text-primary-foreground border border-primary-foreground/30 px-8 py-3 rounded-md font-semibold transition-all duration-300 hover:bg-card/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <BookOpen className="h-5 w-5 transition-transform group-hover:scale-110" />
            {t(hero.cta2, language)}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease 1.5s',
        }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex justify-center">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50 mt-2 animate-[scrollBounce_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
