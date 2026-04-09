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
      label: t(nav.sundayService, language),
      to: '/sermons',
      single: true,
    },
    {
      label: t(nav.ministries, language),
      to: '/ministries',
      single: true,
    },
    {
      label: t(nav.events, language),
      to: '/events',
      single: true,
    },
    {
      label: t(nav.giving, language),
      to: '/giving',
      single: true,
    },
    {
      label: t(nav.sundaySchool, language),
      to: '/sunday-school',
      single: true,
    },
    {
      label: t(nav.resources, language),
      to: '/resources',
      single: true,
    },
    {
      label: t(nav.contactUs, language),
      items: [
        { label: t(nav.joinUs, language), to: '/membership' },
      ],
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
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Language bar */}
      <div className="bg-primary">
        <div className="container mx-auto flex items-center justify-between py-1.5 px-4">
          <span className="text-primary-foreground text-xs sm:text-sm font-medium tracking-wide">
            为基督和祂荣耀的国度
          </span>
          <div className="flex gap-1">
            {(Object.keys(langLabels) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-0.5 text-sm rounded-sm transition-colors duration-300 ${
                  language === lang
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-primary-foreground/80 hover:text-primary-foreground'
                }`}
              >
                {langLabels[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-card/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-3" onClick={closeMobile}>
            <img src={churchLogo} alt="Church Logo" className="h-8 w-8 object-contain" />
            <span className="font-heading text-lg font-semibold text-foreground hidden sm:block">
              {t(translations.hero.title, language)}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
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
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors duration-300"
                  >
                    {dd.label}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === dd.label ? null : dd.label)}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors duration-300"
                    >
                      {dd.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    {openDropdown === dd.label && (
                      <div className="absolute top-full left-0 bg-card rounded-md shadow-lg border border-border py-1 min-w-[220px] animate-fade-in">
                        {dd.items!.map((item) =>
                          item.to.startsWith('/#') ? (
                            <button
                              key={item.label}
                              onClick={() => handleNavClick(item.to)}
                              className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-accent transition-colors duration-200"
                            >
                              {item.label}
                            </button>
                          ) : (
                            <Link
                              key={item.label}
                              to={item.to}
                              onClick={closeMobile}
                              className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-accent transition-colors duration-200"
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

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-foreground">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-card border-t border-border animate-fade-in">
            <div className="container mx-auto py-4 px-4 space-y-2">
              {dropdowns.map((dd) => (
                <div key={dd.label}>
                  {dd.single ? (
                    <Link
                      to={dd.to!}
                      onClick={closeMobile}
                      className="block w-full text-left py-2 text-sm font-medium text-foreground hover:text-accent"
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
                            className="block w-full text-left pl-4 py-1.5 text-sm text-foreground hover:text-accent"
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={closeMobile}
                            className="block w-full text-left pl-4 py-1.5 text-sm text-foreground hover:text-accent"
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
      </div>
    </header>
  );
}
