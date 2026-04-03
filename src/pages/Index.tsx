import { LanguageProvider } from '@/i18n/LanguageContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { BookOpen, Music, Users, FileText, Heart, Church, CalendarDays, HandHeart } from 'lucide-react';
import { ScrollReveal } from '@/hooks/useScrollReveal';

function QuickLinksSection() {
  const { language } = useLanguage();
  const ql = translations.quickLinks;

  const links = [
    { ...ql.faith, icon: Heart, to: '/faith', color: 'bg-red-500/10 text-red-600' },
    { ...ql.sermons, icon: Music, to: '/sermons', color: 'bg-blue-500/10 text-blue-600' },
    { ...ql.membership, icon: Users, to: '/membership', color: 'bg-green-500/10 text-green-600' },
    { ...ql.ministries, icon: Church, to: '/ministries', color: 'bg-purple-500/10 text-purple-600' },
    { ...ql.resources, icon: BookOpen, to: '/resources', color: 'bg-amber-500/10 text-amber-600' },
    { ...ql.constitution, icon: FileText, to: '/constitution', color: 'bg-teal-500/10 text-teal-600' },
    {
      title: translations.nav.events,
      desc: { en: 'Weekly gatherings & events', zh: '每周聚会与活动', th: 'การรวมตัวประจำสัปดาห์' },
      icon: CalendarDays, to: '/events', color: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      title: translations.nav.giving,
      desc: { en: 'Support our ministry', zh: '支持我们的事工', th: 'สนับสนุนพันธกิจ' },
      icon: HandHeart, to: '/giving', color: 'bg-rose-500/10 text-rose-600',
    },
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollReveal>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            {t(ql.title, language)}
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {links.map((link, i) => (
            <ScrollReveal key={i} delay={i * 80} direction="up">
              <Link
                to={link.to}
                className="block bg-card rounded-xl p-6 shadow-sm border border-border group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent/30 h-full"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${link.color}`}>
                  <link.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                  {t(link.title, language)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(link.desc, language)}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSectionAnimated() {
  return (
    <ScrollReveal>
      <LocationSection />
    </ScrollReveal>
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
          <LocationSectionAnimated />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
