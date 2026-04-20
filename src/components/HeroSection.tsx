import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { MapPin, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

/* ── Trinity symbol (Triquetra) ─────────────────────────────────── */
function Triquetra({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="50" cy="38" r="22" />
      <circle cx="36" cy="60" r="22" />
      <circle cx="64" cy="60" r="22" />
    </svg>
  );
}

/* ── Cathedral arch as a quiet background frame ──────────────────── */
function CathedralArchFrame({ revealed }: { revealed: boolean }) {
  return (
    <svg
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMax meet"
      className="w-full h-full"
      style={{
        opacity: revealed ? 0.35 : 0,
        transition: 'opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
      }}
      aria-hidden
    >
      {/* Outer arch */}
      <path
        d="M 50 600 L 50 220 Q 50 50 200 50 Q 350 50 350 220 L 350 600"
        stroke="hsl(var(--gold))"
        strokeWidth="1"
        fill="none"
      />
      {/* Inner arch */}
      <path
        d="M 80 600 L 80 235 Q 80 80 200 80 Q 320 80 320 235 L 320 600"
        stroke="hsl(var(--gold) / 0.5)"
        strokeWidth="0.6"
        fill="none"
      />
      {/* Rose window — small, near apex */}
      <g transform="translate(200 160)" opacity="0.8">
        <circle r="36" fill="none" stroke="hsl(var(--gold))" strokeWidth="0.7" />
        <circle r="22" fill="none" stroke="hsl(var(--gold) / 0.7)" strokeWidth="0.5" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1={Math.cos(a) * 10}
              y1={Math.sin(a) * 10}
              x2={Math.cos(a) * 36}
              y2={Math.sin(a) * 36}
              stroke="hsl(var(--gold) / 0.7)"
              strokeWidth="0.4"
            />
          );
        })}
        <circle r="6" fill="hsl(var(--gold) / 0.4)" />
      </g>
    </svg>
  );
}

/* ── Per-character / per-word reveal ─────────────────────────────── */
function WordReveal({
  text,
  startDelay = 0,
  className = '',
  perWord = 140,
}: {
  text: string;
  startDelay?: number;
  className?: string;
  perWord?: number;
}) {
  const isCJK = /[\u4e00-\u9fff]/.test(text);
  const tokens = isCJK ? Array.from(text) : text.split(/(\s+)/);

  return (
    <span className={className}>
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
        return (
          <span
            key={i}
            className="inline-block"
            style={{
              animation: `word-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${startDelay + i * perWord}ms both`,
            }}
          >
            {tok}
          </span>
        );
      })}
    </span>
  );
}

function Ornament({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex items-center justify-center gap-3"
      style={{ animation: `fade-in 1s ease-out ${delay}ms both` }}
    >
      <div className="h-px bg-gradient-to-r from-transparent to-gold w-20 md:w-28" />
      <Triquetra className="w-3 h-3 text-gold" />
      <div className="h-px bg-gradient-to-l from-transparent to-gold w-20 md:w-28" />
    </div>
  );
}

export default function HeroSection() {
  const { language } = useLanguage();
  const hero = translations.hero;
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCurtainOpen(true), 150);
    const t2 = setTimeout(() => setContentRevealed(true), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const themeRaw = t(hero.theme, language);
  const theme = themeRaw.replace(/^["“"']|["”"']$/g, '');

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] flex items-center justify-center overflow-hidden film-grain"
      style={{ background: 'var(--gradient-parchment)' }}
    >
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, hsl(var(--ink) / 0.1) 100%)',
        }}
      />

      {/* Cinematic curtains */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink z-30 pointer-events-none"
        style={{
          transform: curtainOpen ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 1.2s cubic-bezier(0.7, 0, 0.3, 1)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink z-30 pointer-events-none"
        style={{
          transform: curtainOpen ? 'translateY(100%)' : 'translateY(0)',
          transition: 'transform 1.2s cubic-bezier(0.7, 0, 0.3, 1)',
        }}
      />

      {/* Cathedral arch — anchored to bottom, behind content */}
      <div className="absolute inset-x-0 bottom-0 top-[12%] flex items-end justify-center pointer-events-none">
        <div className="w-[min(560px,80vw)] h-full">
          <CathedralArchFrame revealed={contentRevealed} />
        </div>
      </div>

      {/* Floating triquetras */}
      <Triquetra
        className="absolute top-[18%] left-[6%] w-8 h-8 text-gold/25 hidden md:block"
        aria-hidden
      />
      <Triquetra
        className="absolute bottom-[20%] right-[6%] w-8 h-8 text-gold/25 hidden md:block"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-3xl mx-auto py-20">

        {/* Theme label — small caption above title */}
        <div
          className="font-display text-[0.6rem] md:text-[0.7rem] text-ink-soft tracking-[0.4em] mb-6"
          style={{
            opacity: contentRevealed ? 1 : 0,
            transition: 'opacity 1s ease 0.4s',
          }}
        >
          {t(hero.themeLabel, language).toUpperCase()}
        </div>

        {/* The cinematic title */}
        <h1 className="font-heading font-light text-ink leading-[1.1] mb-8 text-5xl md:text-7xl lg:text-8xl">
          {contentRevealed && (
            <WordReveal text={theme} startDelay={900} perWord={180} />
          )}
        </h1>

        <div style={{ opacity: contentRevealed ? 1 : 0, transition: 'opacity 1s ease 2s' }}>
          <Ornament delay={2000} />
        </div>

        {/* Church identity — quieter */}
        <p
          className="font-heading italic text-base md:text-lg text-ink-soft mt-8 mb-1"
          style={{
            opacity: contentRevealed ? 1 : 0,
            transform: contentRevealed ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 1s ease 2.4s',
          }}
        >
          {t(hero.title, language)}
        </p>
        <p
          className="font-display text-[0.6rem] md:text-[0.7rem] text-ink-soft/70 tracking-[0.35em] mb-12"
          style={{
            opacity: contentRevealed ? 1 : 0,
            transition: 'opacity 1s ease 2.6s',
          }}
        >
          · {t(hero.subtitle, language).toUpperCase()} ·
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{
            opacity: contentRevealed ? 1 : 0,
            transform: contentRevealed ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 1s ease 2.8s',
          }}
        >
          <button
            onClick={() => scrollTo('location')}
            className="group inline-flex items-center justify-center gap-2.5 bg-ink text-parchment px-8 py-3.5 font-display text-xs tracking-[0.25em] uppercase border border-ink transition-all duration-500 hover:bg-transparent hover:text-ink"
          >
            <MapPin className="h-4 w-4 transition-transform group-hover:scale-110" />
            {t(hero.cta1, language)}
          </button>
          <button
            onClick={() => scrollTo('sermons')}
            className="group inline-flex items-center justify-center gap-2.5 bg-transparent text-ink px-8 py-3.5 font-display text-xs tracking-[0.25em] uppercase border border-ink/40 transition-all duration-500 hover:border-gold hover:text-gold"
          >
            <BookOpen className="h-4 w-4 transition-transform group-hover:scale-110" />
            {t(hero.cta2, language)}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        style={{
          opacity: contentRevealed ? 1 : 0,
          transition: 'opacity 1.5s ease 3.4s',
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="font-display text-[0.55rem] text-ink-soft/60 tracking-[0.3em]">
            SCROLL
          </div>
          <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent animate-[scrollBounce_2.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
