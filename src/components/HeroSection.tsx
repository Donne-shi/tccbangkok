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

/* ── Stained-glass cathedral arch (abstract geometric) ──────────── */
function CathedralArch({ revealed }: { revealed: boolean }) {
  return (
    <svg
      viewBox="0 0 400 520"
      className="w-full h-full"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
        transition: 'all 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
      }}
      aria-hidden
    >
      <defs>
        <linearGradient id="goldStroke" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--gold-bright))" />
          <stop offset="100%" stopColor="hsl(var(--gold))" />
        </linearGradient>
        <clipPath id="archClip">
          <path d="M 40 520 L 40 200 Q 40 40 200 40 Q 360 40 360 200 L 360 520 Z" />
        </clipPath>
      </defs>

      {/* Outer arch frame */}
      <path
        d="M 40 520 L 40 200 Q 40 40 200 40 Q 360 40 360 200 L 360 520"
        stroke="url(#goldStroke)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner arch */}
      <path
        d="M 70 520 L 70 215 Q 70 70 200 70 Q 330 70 330 215 L 330 520"
        stroke="hsl(var(--gold) / 0.4)"
        strokeWidth="0.8"
        fill="none"
      />

      {/* Stained glass grid inside arch */}
      <g clipPath="url(#archClip)" opacity="0.55">
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => {
            const x = 40 + col * 54;
            const y = 60 + row * 58;
            const tones = [
              'hsl(var(--gold) / 0.18)',
              'hsl(var(--gold-bright) / 0.12)',
              'hsl(var(--ink) / 0.08)',
              'hsl(var(--gold-soft) / 0.22)',
            ];
            const fill = tones[(row + col) % tones.length];
            return (
              <rect
                key={`${row}-${col}`}
                x={x}
                y={y}
                width={52}
                height={56}
                fill={fill}
                stroke="hsl(var(--gold) / 0.35)"
                strokeWidth="0.5"
              />
            );
          })
        )}
        {/* Central rose window */}
        <g transform="translate(200 200)">
          <circle r="48" fill="none" stroke="hsl(var(--gold))" strokeWidth="1" />
          <circle r="32" fill="none" stroke="hsl(var(--gold) / 0.6)" strokeWidth="0.7" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 16}
                y1={Math.sin(a) * 16}
                x2={Math.cos(a) * 48}
                y2={Math.sin(a) * 48}
                stroke="hsl(var(--gold) / 0.7)"
                strokeWidth="0.6"
              />
            );
          })}
          <circle r="10" fill="hsl(var(--gold) / 0.3)" stroke="hsl(var(--gold))" strokeWidth="0.8" />
        </g>
      </g>

      {/* Triquetra at apex */}
      <g transform="translate(170 90) scale(0.6)" stroke="hsl(var(--gold))" strokeWidth="1.5" fill="none">
        <circle cx="50" cy="38" r="22" />
        <circle cx="36" cy="60" r="22" />
        <circle cx="64" cy="60" r="22" />
      </g>
    </svg>
  );
}

/* ── Per-word reveal ─────────────────────────────────────────────── */
function WordReveal({
  text,
  startDelay = 0,
  className = '',
  perWord = 180,
}: {
  text: string;
  startDelay?: number;
  className?: string;
  perWord?: number;
}) {
  // Split CJK as characters, latin/thai by spaces
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

/* ── Ornamental divider ──────────────────────────────────────────── */
function Ornament({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex items-center justify-center gap-4 my-6"
      style={{ animation: `fade-in 1.2s ease-out ${delay}ms both` }}
    >
      <div
        className="h-px bg-gradient-to-r from-transparent via-gold to-transparent w-32 origin-right"
        style={{ animation: `ornament-fade 1.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both` }}
      />
      <Triquetra className="w-4 h-4 text-gold" />
      <div
        className="h-px bg-gradient-to-r from-transparent via-gold to-transparent w-32 origin-left"
        style={{ animation: `ornament-fade 1.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both` }}
      />
    </div>
  );
}

export default function HeroSection() {
  const { language } = useLanguage();
  const hero = translations.hero;
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCurtainOpen(true), 400);
    const t2 = setTimeout(() => setContentRevealed(true), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Theme line — strip surrounding quotes for cinematic display
  const themeRaw = t(hero.theme, language);
  const theme = themeRaw.replace(/^["“"']|["”"']$/g, '');

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden film-grain"
      style={{ background: 'var(--gradient-parchment)' }}
    >
      {/* Subtle parchment vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, hsl(var(--ink) / 0.12) 100%)',
        }}
      />

      {/* Subtle paper texture grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--ink)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink)) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Cinematic curtains — open on mount */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink z-30 pointer-events-none"
        style={{
          transform: curtainOpen ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 1.4s cubic-bezier(0.7, 0, 0.3, 1)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink z-30 pointer-events-none"
        style={{
          transform: curtainOpen ? 'translateY(100%)' : 'translateY(0)',
          transition: 'transform 1.4s cubic-bezier(0.7, 0, 0.3, 1)',
        }}
      />

      {/* Background cathedral arch — large, centered, behind text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[min(720px,90vw)] h-[min(820px,95vh)] opacity-90">
          <CathedralArch revealed={contentRevealed} />
        </div>
      </div>

      {/* Floating triquetras (decorative) */}
      <Triquetra
        className="absolute top-[12%] left-[8%] w-10 h-10 text-gold/30 hidden md:block"
        aria-hidden
      />
      <Triquetra
        className="absolute bottom-[14%] right-[8%] w-10 h-10 text-gold/30 hidden md:block"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
        {/* Anno Domini label */}
        <div
          className="font-display text-xs md:text-sm text-gold tracking-[0.4em] mb-4"
          style={{
            opacity: contentRevealed ? 1 : 0,
            transition: 'opacity 1s ease 0.4s',
          }}
        >
          ── ANNO&nbsp;DOMINI · MMXXVI ──
        </div>

        {/* Annual theme — the cinematic reveal */}
        <h1 className="font-heading font-light text-ink leading-[1.05] mb-2">
          <span className="block text-6xl md:text-8xl">
            {contentRevealed && (
              <WordReveal text={theme} startDelay={1500} perWord={220} />
            )}
          </span>
        </h1>

        {/* Theme label (small, restrained) */}
        <div
          className="font-display text-[0.65rem] md:text-xs text-ink-soft tracking-[0.35em] mt-4 mb-2"
          style={{
            opacity: contentRevealed ? 1 : 0,
            transition: 'opacity 1.2s ease 2.8s',
          }}
        >
          {t(hero.themeLabel, language).toUpperCase()}
        </div>

        <Ornament delay={3200} />

        {/* Church name — quiet, italic, secondary */}
        <p
          className="font-heading italic text-lg md:text-xl text-ink-soft mb-1"
          style={{
            opacity: contentRevealed ? 1 : 0,
            transform: contentRevealed ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 1s ease 3.4s',
          }}
        >
          {t(hero.title, language)}
        </p>
        <p
          className="font-display text-[0.7rem] md:text-xs text-ink-soft/70 tracking-[0.3em] mb-10"
          style={{
            opacity: contentRevealed ? 1 : 0,
            transition: 'opacity 1s ease 3.6s',
          }}
        >
          · {t(hero.subtitle, language).toUpperCase()} ·
        </p>

        {/* CTA — minimal, classical */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{
            opacity: contentRevealed ? 1 : 0,
            transform: contentRevealed ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 1s ease 3.8s',
          }}
        >
          <button
            onClick={() => scrollTo('location')}
            className="group inline-flex items-center gap-2.5 bg-ink text-parchment px-8 py-3.5 font-display text-xs tracking-[0.25em] uppercase border border-ink transition-all duration-500 hover:bg-transparent hover:text-ink"
          >
            <MapPin className="h-4 w-4 transition-transform group-hover:scale-110" />
            {t(hero.cta1, language)}
          </button>
          <button
            onClick={() => scrollTo('sermons')}
            className="group inline-flex items-center gap-2.5 bg-transparent text-ink px-8 py-3.5 font-display text-xs tracking-[0.25em] uppercase border border-ink/40 transition-all duration-500 hover:border-gold hover:text-gold"
          >
            <BookOpen className="h-4 w-4 transition-transform group-hover:scale-110" />
            {t(hero.cta2, language)}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        style={{
          opacity: contentRevealed ? 1 : 0,
          transition: 'opacity 1.5s ease 4.2s',
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="font-display text-[0.55rem] text-ink-soft/60 tracking-[0.3em]">SCROLL</div>
          <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent animate-[scrollBounce_2.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
