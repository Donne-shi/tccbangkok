import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import EventsCalendar from '@/components/EventsCalendar';

export default function EventsPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <EventsCalendar />
      </PageLayout>
    </LanguageProvider>
  );
}
