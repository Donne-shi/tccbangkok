import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import GivingSection from '@/components/GivingSection';
import FinanceReport from '@/components/FinanceReport';

export default function GivingPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <GivingSection />
        <FinanceReport />
      </PageLayout>
    </LanguageProvider>
  );
}
