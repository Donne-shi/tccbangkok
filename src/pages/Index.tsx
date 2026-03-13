import { LanguageProvider } from '@/i18n/LanguageContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StatementOfFaith from '@/components/StatementOfFaith';
import MinistryTeam from '@/components/MinistryTeam';
import ConstitutionSection from '@/components/ConstitutionSection';
import LocationSection from '@/components/LocationSection';
import SermonsSection from '@/components/SermonsSection';
import MembershipForm from '@/components/MembershipForm';
import MinistriesSection from '@/components/MinistriesSection';
import ResourcesSection from '@/components/ResourcesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Header />
        <main className="pt-[88px]">
          <HeroSection />
          <StatementOfFaith />
          <MinistryTeam />
          <ConstitutionSection />
          <SermonsSection />
          <MinistriesSection />
          <ResourcesSection />
          <LocationSection />
          <MembershipForm />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
