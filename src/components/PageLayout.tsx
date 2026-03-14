import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-[88px] flex-1">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-accent hover:text-accent/80 transition-colors font-medium"
          >
            {t(translations.nav.backToHome, language)}
          </Link>
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
}
