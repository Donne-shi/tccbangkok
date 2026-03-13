import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { User } from 'lucide-react';

export default function MinistryTeam() {
  const { language } = useLanguage();
  const team = translations.team;

  return (
    <section id="team" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          {t(team.title, language)}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {team.members.map((member, i) => (
            <div key={i} className="bg-card rounded-lg p-6 text-center shadow-sm border border-border">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{t(member.role, language)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
