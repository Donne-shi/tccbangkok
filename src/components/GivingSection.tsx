import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { Heart, CreditCard } from 'lucide-react';

export default function GivingSection() {
  const { language } = useLanguage();
  const giving = translations.giving;

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          {t(giving.title, language)}
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          {t(giving.subtitle, language)}
        </p>

        <div className="bg-card rounded-lg p-8 shadow-sm border border-border max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
            {t(giving.onlineGiving, language)}
          </h3>
          <p className="text-muted-foreground text-sm mb-6">Online Giving</p>

          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-md">
              <CreditCard className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">{t(giving.nameLabel, language)}</p>
                <p className="font-semibold text-foreground">XICHEN FENG</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-md">
              <CreditCard className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">KBank ({t(giving.accountLabel, language)})</p>
                <p className="font-semibold text-foreground font-mono tracking-wider">9217277871</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-md">
              <CreditCard className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">KBank</p>
                <p className="font-semibold text-foreground font-mono tracking-wider">—</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
