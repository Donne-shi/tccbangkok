import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import type { Language } from '@/i18n/translations';
import { Music, ChevronRight } from 'lucide-react';

type Sermon = {
  date: string;
  title: Record<Language, string>;
  speaker: string;
  series?: Record<Language, string>;
};

const sermonsByYear: Record<string, Sermon[]> = {
  '2026': [
    { date: '2026-03-30', title: { en: 'Nehemiah: Rise Up and Build', zh: '尼希米记：我们起来建造', th: 'เนหะมีย์: ลุกขึ้นและสร้าง' }, speaker: 'Elder Caleb Luo', series: { en: 'Nehemiah Series', zh: '尼希米记系列', th: 'ชุดเนหะมีย์' } },
    { date: '2026-03-23', title: { en: 'Nehemiah: The Call to Rebuild', zh: '尼希米记：重建的呼召', th: 'เนหะมีย์: การเรียกให้สร้างใหม่' }, speaker: 'Elder Martin Zhang', series: { en: 'Nehemiah Series', zh: '尼希米记系列', th: 'ชุดเนหะมีย์' } },
    { date: '2026-03-16', title: { en: 'Nehemiah: Prayer and Action', zh: '尼希米记：祷告与行动', th: 'เนหะมีย์: การอธิษฐานและการกระทำ' }, speaker: 'Elder Dohan', series: { en: 'Nehemiah Series', zh: '尼希米记系列', th: 'ชุดเนหะมีย์' } },
    { date: '2026-03-09', title: { en: 'Walking in the Light', zh: '在光中行走', th: 'เดินในความสว่าง' }, speaker: 'Elder Ye Qing' },
    { date: '2026-03-02', title: { en: 'The Grace of God', zh: '上帝的恩典', th: 'พระคุณของพระเจ้า' }, speaker: 'Elder Caleb Luo' },
    { date: '2026-02-23', title: { en: 'Faith and Works', zh: '信心与行为', th: 'ความเชื่อและการกระทำ' }, speaker: 'Elder Martin Zhang' },
    { date: '2026-02-16', title: { en: 'The Body of Christ', zh: '基督的身体', th: 'พระกายของพระคริสต์' }, speaker: 'Elder Dohan' },
  ],
  '2025': [
    { date: '2025-12-28', title: { en: 'Year-End Reflection', zh: '年终回顾', th: 'ทบทวนปลายปี' }, speaker: 'Elder Caleb Luo' },
    { date: '2025-12-21', title: { en: 'The Coming King', zh: '将要来的君王', th: 'กษัตริย์ที่จะเสด็จมา' }, speaker: 'Elder Martin Zhang', series: { en: 'Advent Series', zh: '降临节系列', th: 'ชุดเทศกาลอดเวนต์' } },
    { date: '2025-12-14', title: { en: 'Joy to the World', zh: '普世欢腾', th: 'ยินดีทั่วโลก' }, speaker: 'Elder Ye Qing', series: { en: 'Advent Series', zh: '降临节系列', th: 'ชุดเทศกาลอดเวนต์' } },
    { date: '2025-12-07', title: { en: 'Hope in the Darkness', zh: '黑暗中的盼望', th: 'ความหวังในความมืด' }, speaker: 'Elder Dohan', series: { en: 'Advent Series', zh: '降临节系列', th: 'ชุดเทศกาลอดเวนต์' } },
    { date: '2025-11-30', title: { en: 'Giving Thanks', zh: '感恩', th: 'การขอบพระคุณ' }, speaker: 'Elder Caleb Luo' },
    { date: '2025-11-23', title: { en: 'The Faithful God', zh: '信实的上帝', th: 'พระเจ้าผู้ซื่อสัตย์' }, speaker: 'Elder Martin Zhang' },
  ],
  '2024': [
    { date: '2024-12-29', title: { en: 'Looking Ahead', zh: '展望未来', th: 'มองไปข้างหน้า' }, speaker: 'Elder Caleb Luo' },
    { date: '2024-12-22', title: { en: 'Emmanuel: God With Us', zh: '以马内利：上帝与我们同在', th: 'อิมมานูเอล: พระเจ้าอยู่กับเรา' }, speaker: 'Elder Martin Zhang' },
    { date: '2024-12-15', title: { en: 'The Promise Fulfilled', zh: '应许的成就', th: 'พระสัญญาสำเร็จ' }, speaker: 'Elder Ye Qing' },
    { date: '2024-06-16', title: { en: 'Walking by Faith', zh: '凭信心行走', th: 'เดินโดยความเชื่อ' }, speaker: 'Elder Caleb Luo' },
    { date: '2024-06-09', title: { en: 'The Power of Prayer', zh: '祷告的力量', th: 'พลังแห่งการอธิษฐาน' }, speaker: 'Elder Martin Zhang' },
  ],
};

const years = Object.keys(sermonsByYear).sort((a, b) => Number(b) - Number(a));

export default function SermonsSection() {
  const { language } = useLanguage();
  const sermonsT = translations.sermons;
  const [activeYear, setActiveYear] = useState(years[0]);

  const sermons = sermonsByYear[activeYear] || [];

  // Group by series
  const grouped: { series: Record<Language, string> | null; items: Sermon[] }[] = [];
  let currentGroup: typeof grouped[0] | null = null;

  for (const sermon of sermons) {
    const seriesKey = sermon.series ? t(sermon.series, 'en') : '__none__';
    if (!currentGroup || (currentGroup.series ? t(currentGroup.series, 'en') : '__none__') !== seriesKey) {
      currentGroup = { series: sermon.series || null, items: [] };
      grouped.push(currentGroup);
    }
    currentGroup.items.push(sermon);
  }

  return (
    <section id="sermons" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
          {t(sermonsT.title, language)}
        </h2>
        <p className="text-muted-foreground text-center mb-8">{t(sermonsT.subtitle, language)}</p>

        {/* Year tabs */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeYear === year
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Sermon list */}
        <div className="space-y-8">
          {grouped.map((group, gi) => (
            <div key={gi}>
              {group.series && (
                <div className="flex items-center gap-2 mb-3">
                  <ChevronRight className="h-4 w-4 text-accent" />
                  <h3 className="font-heading text-lg font-semibold text-accent">
                    {t(group.series, language)}
                  </h3>
                </div>
              )}
              <div className="space-y-3">
                {group.items.map((sermon, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-lg p-5 shadow-sm border border-border flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-accent/20"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Music className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-base font-semibold text-foreground truncate">
                        {t(sermon.title, language)}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {sermon.date} · {sermon.speaker}
                      </p>
                    </div>
                    <button className="flex-shrink-0 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                      {t(sermonsT.play, language)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
