import { useState } from 'react';
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const dropdowns = [
    {
      label: t(nav.about, language),
      items: [
        { label: t(nav.statementOfFaith, language), id: 'faith' },
        { label: t(nav.ministryTeam, language), id: 'team' },
        { label: t(nav.constitution, language), id: 'constitution' },
        { label: t(nav.location, language), id: 'location' },
        { label: t(nav.annualTheme, language), id: 'hero' },
      ],
    },
    {
      label: t(nav.sundayService, language),
      items: [{ label: t(nav.sundayService, language), id: 'sermons' }],
      single: true,
    },
    {
      label: t(nav.joinUs, language),
      items: [{ label: t(nav.membershipApplication, language), id: 'membership' }],
      single: true,
    },
    {
      label: t(nav.ministries, language),
      items: [
        { label: t(nav.choir, language), id: 'ministries' },
        { label: t(nav.youth, language), id: 'ministries' },
        { label: t(nav.children, language), id: 'ministries' },
      ],
    },
    {
      label: t(nav.resources, language),
      items: [
        { label: t(nav.westminster, language), id: 'resources' },
        { label: t(nav.heidelberg, language), id: 'resources' },
      ],
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Language bar */}
      <div className="bg-primary">
        <div className="container mx-auto flex justify-end py-1.5 px-4">
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
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-3">
            <img src={churchLogo} alt="TCC Logo" className="h-10 w-auto" />
            <span className="font-heading text-lg font-semibold text-foreground hidden sm:block">
              {t(translations.hero.title, language)}
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {dropdowns.map((dd) => (
              <div
                key={dd.label}
                className="relative"
                onMouseEnter={() => !dd.single && setOpenDropdown(dd.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => dd.single ? scrollTo(dd.items[0].id) : setOpenDropdown(openDropdown === dd.label ? null : dd.label)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors duration-300"
                >
                  {dd.label}
                  {!dd.single && <ChevronDown className="h-3.5 w-3.5" />}
                </button>
                {!dd.single && openDropdown === dd.label && (
                  <div className="absolute top-full left-0 bg-card rounded-md shadow-lg border border-border py-1 min-w-[200px] animate-fade-in">
                    {dd.items.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => scrollTo(item.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-accent transition-colors duration-200"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
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
                    <button
                      onClick={() => scrollTo(dd.items[0].id)}
                      className="block w-full text-left py-2 text-sm font-medium text-foreground hover:text-accent"
                    >
                      {dd.label}
                    </button>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-muted-foreground py-2">{dd.label}</p>
                      {dd.items.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => scrollTo(item.id)}
                          className="block w-full text-left pl-4 py-1.5 text-sm text-foreground hover:text-accent"
                        >
                          {item.label}
                        </button>
                      ))}
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
