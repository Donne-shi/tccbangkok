import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import type { Language } from '@/i18n/translations';
import { ChevronDown, Menu, X } from 'lucide-react';
import churchLogo from '@/assets/church-logo.png';

const langLabels: Record<Language, string> = { en: 'EN', zh: '中文', th: 'ไทย' };

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const nav = translations.nav;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const dropdowns = [
    {
      label: t(nav.about, language),
      items: [
        { label: t(nav.statementOfFaith, language), to: '/faith' },
        { label: t(nav.ministryTeam, language), to: '/team' },
        { label: t(nav.constitution, language), to: '/constitution' },
        { label: t(nav.location, language), to: '/#location' },
      ],
    },
    {
      label: t(nav.shepherding, language),
      items: [
        { label: t(nav.sundayService, language), to: '/sermons' },
        { label: t(nav.devotional, language), to: '/devotionals' },
      ],
    },
    { label: t(nav.ministries, language), to: '/ministries', single: true },
    { label: t(nav.events, language), to: '/events', single: true },
    { label: t(nav.giving, language), to: '/giving', single: true },
    { label: t(nav.sundaySchool, language), to: '/sunday-school', single: true },
    { label: t(nav.resources, language), to: '/resources', single: true },
    {
      label: t(nav.contactUs, language),
      items: [{ label: t(nav.joinUs, language), to: '/membership' }],
    },
  ];

  const handleNavClick = (to: string) => {
    closeMobile();
    if (to.startsWith('/#')) {
      const id = to.slice(2);
      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = to;
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-parchment/85 backdrop-blur-md border-b border-gold/20">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMobile}>
          <img src={churchLogo} alt="Church Logo" className="h-9 w-9 object-contain" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-heading text-base font-semibold text-ink">
              {t(translations.hero.title, language)}
            </span>
            <span className="font-display text-[0.55rem] text-gold tracking-[0.3em]">
              FOR HIS GLORY
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-0.5">
          {dropdowns.map((dd) => (
            <div
              key={dd.label}
              className="relative"
              onMouseEnter={() => !dd.single && setOpenDropdown(dd.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {dd.single ? (
                <Link
                  to={dd.to!}
                  className="flex items-center gap-1 px-2 py-2 text-[0.82rem] whitespace-nowrap text-ink hover:text-gold transition-colors duration-300"
                >
                  {dd.label}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === dd.label ? null : dd.label)}
                    className="flex items-center gap-1 px-2 py-2 text-[0.82rem] whitespace-nowrap text-ink hover:text-gold transition-colors duration-300"
                  >
                    {dd.label}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {openDropdown === dd.label && (
                    <div className="absolute top-full left-0 bg-parchment border border-gold/30 py-1 min-w-[220px] animate-fade-in shadow-lg">
                      {dd.items!.map((item) =>
                        item.to.startsWith('/#') ? (
                          <button
                            key={item.label}
                            onClick={() => handleNavClick(item.to)}
                            className="block w-full text-left px-4 py-2 text-sm text-ink hover:bg-gold/10 hover:text-gold transition-colors duration-200"
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={closeMobile}
                            className="block w-full text-left px-4 py-2 text-sm text-ink hover:bg-gold/10 hover:text-gold transition-colors duration-200"
                          >
                            {item.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Language switcher */}
        <div className="hidden md:flex items-center gap-1 border-l border-gold/30 pl-3 shrink-0">
          {(Object.keys(langLabels) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 font-display text-[0.65rem] tracking-[0.2em] transition-colors duration-300 ${
                language === lang
                  ? 'text-gold border-b border-gold'
                  : 'text-ink-soft hover:text-gold'
              }`}
            >
              {langLabels[lang]}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-ink">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-parchment border-t border-gold/20 animate-fade-in">
          <div className="container mx-auto py-4 px-4 space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-gold/20 mb-2">
              {(Object.keys(langLabels) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 font-display text-xs tracking-[0.2em] ${
                    language === lang ? 'text-gold border border-gold' : 'text-ink-soft'
                  }`}
                >
                  {langLabels[lang]}
                </button>
              ))}
            </div>
            {dropdowns.map((dd) => (
              <div key={dd.label}>
                {dd.single ? (
                  <Link
                    to={dd.to!}
                    onClick={closeMobile}
                    className="block w-full text-left py-2 text-sm font-medium text-ink hover:text-gold"
                  >
                    {dd.label}
                  </Link>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-muted-foreground py-2">{dd.label}</p>
                    {dd.items!.map((item) =>
                      item.to.startsWith('/#') ? (
                        <button
                          key={item.label}
                          onClick={() => handleNavClick(item.to)}
                          className="block w-full text-left pl-4 py-1.5 text-sm text-ink hover:text-gold"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={closeMobile}
                          className="block w-full text-left pl-4 py-1.5 text-sm text-ink hover:text-gold"
                        >
                          {item.label}
                        </Link>
                      )
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
