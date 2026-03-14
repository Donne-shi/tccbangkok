import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import SermonsSection from '@/components/SermonsSection';

export default function SermonsPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <SermonsSection />
      </PageLayout>
    </LanguageProvider>
  );
}
