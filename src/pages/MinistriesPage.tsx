import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import MinistriesSection from '@/components/MinistriesSection';

export default function MinistriesPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <MinistriesSection />
      </PageLayout>
    </LanguageProvider>
  );
}
