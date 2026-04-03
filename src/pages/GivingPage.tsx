import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import GivingSection from '@/components/GivingSection';

export default function GivingPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <GivingSection />
      </PageLayout>
    </LanguageProvider>
  );
}
