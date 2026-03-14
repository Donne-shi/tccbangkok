import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import MinistryTeam from '@/components/MinistryTeam';

export default function TeamPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <MinistryTeam />
      </PageLayout>
    </LanguageProvider>
  );
}
