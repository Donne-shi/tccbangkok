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
import ThisWeekSermon from '@/components/ThisWeekSermon';
import FeedbackButton from '@/components/FeedbackButton';

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
    {
      title: translations.nav.events,
      desc: { en: 'Weekly gatherings & events', zh: '每周聚会与活动', th: 'การรวมตัวประจำสัปดาห์' },
      icon: CalendarDays, to: '/events',
    },
    {
      title: translations.nav.giving,
      desc: { en: 'Support our ministry', zh: '支持我们的事工', th: 'สนับสนุนพันธกิจ' },
      icon: HandHeart, to: '/giving',
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
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 bg-accent/10">
                  <link.icon className="h-6 w-6 text-accent" />
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

function SundayReminderSection() {
  const { language } = useLanguage();
  const t = {
    title: { en: 'Sunday Worship Reminders', zh: '主日崇拜提醒', th: 'การเตือนความจำการนมัสการวันอาทิตย์' },
    items: [
      {
        icon: BookOpen,
        text: {
          en: 'Please bring your own Bible to worship',
          zh: '请携带自己的圣经来参加崇拜',
          th: 'กรุณานำคัมภีร์ไบเบิลของตนเองมาร่วมนมัสการ'
        }
      },
      {
        icon: Heart,
        text: {
          en: 'Free Bibles available for seekers or those who forgot',
          zh: '有免费的圣经可供慕道友或临时忘带的弟兄姊妹使用',
          th: 'มีคัมภีร์ไบเบิลฟรีสำหรับผู้แสวงหาหรือผู้ที่ลืมนำมา'
        }
      },
      {
        icon: Users,
        text: {
          en: 'Please help children learn appropriate behavior and quietness during worship',
          zh: '训练孩子们在主日崇拜过程中有合宜的举止，并保持安静',
          th: 'กรุณาช่วยสอนเด็กๆ ให้มีพฤติกรรมที่เหมาะสมและเงียบในระหว่างการนมัสการ'
        }
      }
    ]
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f]">
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
              {language === 'zh' ? t.title.zh : language === 'th' ? t.title.th : t.title.en}
            </h2>
            <div className="w-16 h-1 bg-[#d4af37] mx-auto rounded-full" />
          </div>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-6">
          {t.items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 100} direction="up">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-[#d4af37]" />
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  {language === 'zh' ? item.text.zh : language === 'th' ? item.text.th : item.text.en}
                </p>
              </div>
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
        <main className="pt-[68px]">
          <HeroSection />
          <ThisWeekSermon />
          <QuickLinksSection />
          <LocationSectionAnimated />
        </main>
        <Footer />
        <FeedbackButton />
      </div>
    </LanguageProvider>
  );
};

export default Index;
