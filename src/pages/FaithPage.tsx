import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import StatementOfFaith from '@/components/StatementOfFaith';

export default function FaithPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <StatementOfFaith />
      </PageLayout>
    </LanguageProvider>
  );
}
