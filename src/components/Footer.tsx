import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-primary py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-primary-foreground/70 text-sm">
          {t(translations.footer.copyright, language)}
        </p>
      </div>
    </footer>
  );
}
