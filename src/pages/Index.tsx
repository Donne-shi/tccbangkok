import { LanguageProvider } from '@/i18n/LanguageContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { BookOpen, Music, Users, FileText, Heart, Church } from 'lucide-react';

function QuickLinksSection() {
  const { language } = useLanguage();
  const ql = translations.quickLinks;

  const links = [
    { ...ql.faith, icon: Heart, to: '/faith' },
    { ...ql.sermons, icon: Music, to: '/sermons' },
    { ...ql.membership, icon: Users, to: '/membership' },
    { ...ql.ministries, icon: Church, to: '/ministries' },
    { ...ql.resources, icon: BookOpen, to: '/resources' },
    { ...ql.constitution, icon: FileText, to: '/constitution' },
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(ql.title, language)}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <link.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                {t(link.title, language)}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t(link.desc, language)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Header />
        <main className="pt-[88px]">
          <HeroSection />
          <QuickLinksSection />
          <LocationSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
