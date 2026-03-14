import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import ConstitutionSection from '@/components/ConstitutionSection';

export default function ConstitutionPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <ConstitutionSection />
      </PageLayout>
    </LanguageProvider>
  );
}
