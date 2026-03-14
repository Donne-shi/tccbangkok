import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import MembershipForm from '@/components/MembershipForm';

export default function MembershipPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <MembershipForm />
      </PageLayout>
    </LanguageProvider>
  );
}
