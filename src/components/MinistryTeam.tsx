import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { User } from 'lucide-react';
import teamPhoto from '@/assets/team-photo.jpg';

export default function MinistryTeam() {
  const { language } = useLanguage();
  const team = translations.team;

  return (
    <section id="team" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
          {t(team.title, language)}
        </h2>

        {/* Team photo */}
        <div className="rounded-lg overflow-hidden shadow-lg border border-border mb-12">
          <img
            src={teamPhoto}
            alt="Ministry Team"
            className="w-full object-cover"
          />
        </div>

        {/* Elders */}
        <h3 className="font-heading text-2xl font-semibold text-foreground text-center mb-6">
          {t(team.elders, language)}
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
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

        {/* Deacons */}
        <h3 className="font-heading text-2xl font-semibold text-foreground text-center mb-6">
          {t(team.deacons, language)}
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {team.deaconMembers.map((member, i) => (
            <div key={i} className="bg-card rounded-lg p-6 text-center shadow-sm border border-border">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-accent-foreground" />
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
