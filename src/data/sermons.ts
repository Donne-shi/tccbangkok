import type { Language } from '@/i18n/translations';

export type Sermon = {
  slug: string;
  date: string;
  title: Record<Language, string>;
  speaker: string;
  series?: Record<Language, string>;
  scripture?: Record<Language, string>;
  audioPath?: string;
  pptPath?: string;
};

export const sermonsByYear: Record<string, Sermon[]> = {
  '2026': [
    {
      slug: '2026-03-30-nehemiah-rise-up',
      date: '2026-03-30',
      title: { en: 'Nehemiah: Rise Up and Build', zh: '尼希米记：我们起来建造', th: 'เนหะมีย์: ลุกขึ้นและสร้าง' },
      speaker: 'Elder Caleb Luo',
      series: { en: 'Nehemiah Series', zh: '尼希米记系列', th: 'ชุดเนหะมีย์' },
      scripture: { en: 'Nehemiah 2:17-20', zh: '尼希米记 2:17-20', th: 'เนหะมีย์ 2:17-20' },
      // audioPath: '/sermons/audio/2026-03-30.mp3',
      // pptPath: '/sermons/ppt/2026-03-30.pptx',
    },
    {
      slug: '2026-03-23-nehemiah-call-to-rebuild',
      date: '2026-03-23',
      title: { en: 'Nehemiah: The Call to Rebuild', zh: '尼希米记：重建的呼召', th: 'เนหะมีย์: การเรียกให้สร้างใหม่' },
      speaker: 'Elder Martin Zhang',
      series: { en: 'Nehemiah Series', zh: '尼希米记系列', th: 'ชุดเนหะมีย์' },
      scripture: { en: 'Nehemiah 1:1-11', zh: '尼希米记 1:1-11', th: 'เนหะมีย์ 1:1-11' },
    },
    {
      slug: '2026-03-16-nehemiah-prayer-action',
      date: '2026-03-16',
      title: { en: 'Nehemiah: Prayer and Action', zh: '尼希米记：祷告与行动', th: 'เนหะมีย์: การอธิษฐานและการกระทำ' },
      speaker: 'Elder Dohan',
      series: { en: 'Nehemiah Series', zh: '尼希米记系列', th: 'ชุดเนหะมีย์' },
      scripture: { en: 'Nehemiah 4:7-23', zh: '尼希米记 4:7-23', th: 'เนหะมีย์ 4:7-23' },
    },
    {
      slug: '2026-03-09-walking-in-light',
      date: '2026-03-09',
      title: { en: 'Walking in the Light', zh: '在光中行走', th: 'เดินในความสว่าง' },
      speaker: 'Elder Ye Qing',
      scripture: { en: '1 John 1:5-10', zh: '约翰一书 1:5-10', th: '1 ยอห์น 1:5-10' },
    },
    {
      slug: '2026-03-02-grace-of-god',
      date: '2026-03-02',
      title: { en: 'The Grace of God', zh: '上帝的恩典', th: 'พระคุณของพระเจ้า' },
      speaker: 'Elder Caleb Luo',
      scripture: { en: 'Ephesians 2:1-10', zh: '以弗所书 2:1-10', th: 'เอเฟซัส 2:1-10' },
    },
    {
      slug: '2026-02-23-faith-and-works',
      date: '2026-02-23',
      title: { en: 'Faith and Works', zh: '信心与行为', th: 'ความเชื่อและการกระทำ' },
      speaker: 'Elder Martin Zhang',
      scripture: { en: 'James 2:14-26', zh: '雅各书 2:14-26', th: 'ยากอบ 2:14-26' },
    },
    {
      slug: '2026-02-16-body-of-christ',
      date: '2026-02-16',
      title: { en: 'The Body of Christ', zh: '基督的身体', th: 'พระกายของพระคริสต์' },
      speaker: 'Elder Dohan',
      scripture: { en: '1 Corinthians 12:12-27', zh: '哥林多前书 12:12-27', th: '1 โครินธ์ 12:12-27' },
    },
  ],
  '2025': [
    {
      slug: '2025-12-28-year-end-reflection',
      date: '2025-12-28',
      title: { en: 'Year-End Reflection', zh: '年终回顾', th: 'ทบทวนปลายปี' },
      speaker: 'Elder Caleb Luo',
    },
    {
      slug: '2025-12-21-coming-king',
      date: '2025-12-21',
      title: { en: 'The Coming King', zh: '将要来的君王', th: 'กษัตริย์ที่จะเสด็จมา' },
      speaker: 'Elder Martin Zhang',
      series: { en: 'Advent Series', zh: '降临节系列', th: 'ชุดเทศกาลอดเวนต์' },
    },
    {
      slug: '2025-12-14-joy-to-world',
      date: '2025-12-14',
      title: { en: 'Joy to the World', zh: '普世欢腾', th: 'ยินดีทั่วโลก' },
      speaker: 'Elder Ye Qing',
      series: { en: 'Advent Series', zh: '降临节系列', th: 'ชุดเทศกาลอดเวนต์' },
    },
    {
      slug: '2025-12-07-hope-in-darkness',
      date: '2025-12-07',
      title: { en: 'Hope in the Darkness', zh: '黑暗中的盼望', th: 'ความหวังในความมืด' },
      speaker: 'Elder Dohan',
      series: { en: 'Advent Series', zh: '降临节系列', th: 'ชุดเทศกาลอดเวนต์' },
    },
    {
      slug: '2025-11-30-giving-thanks',
      date: '2025-11-30',
      title: { en: 'Giving Thanks', zh: '感恩', th: 'การขอบพระคุณ' },
      speaker: 'Elder Caleb Luo',
    },
    {
      slug: '2025-11-23-faithful-god',
      date: '2025-11-23',
      title: { en: 'The Faithful God', zh: '信实的上帝', th: 'พระเจ้าผู้ซื่อสัตย์' },
      speaker: 'Elder Martin Zhang',
    },
  ],
  '2024': [
    {
      slug: '2024-12-29-looking-ahead',
      date: '2024-12-29',
      title: { en: 'Looking Ahead', zh: '展望未来', th: 'มองไปข้างหน้า' },
      speaker: 'Elder Caleb Luo',
    },
    {
      slug: '2024-12-22-emmanuel',
      date: '2024-12-22',
      title: { en: 'Emmanuel: God With Us', zh: '以马内利：上帝与我们同在', th: 'อิมมานูเอล: พระเจ้าอยู่กับเรา' },
      speaker: 'Elder Martin Zhang',
    },
    {
      slug: '2024-12-15-promise-fulfilled',
      date: '2024-12-15',
      title: { en: 'The Promise Fulfilled', zh: '应许的成就', th: 'พระสัญญาสำเร็จ' },
      speaker: 'Elder Ye Qing',
    },
    {
      slug: '2024-06-16-walking-by-faith',
      date: '2024-06-16',
      title: { en: 'Walking by Faith', zh: '凭信心行走', th: 'เดินโดยความเชื่อ' },
      speaker: 'Elder Caleb Luo',
    },
    {
      slug: '2024-06-09-power-of-prayer',
      date: '2024-06-09',
      title: { en: 'The Power of Prayer', zh: '祷告的力量', th: 'พลังแห่งการอธิษฐาน' },
      speaker: 'Elder Martin Zhang',
    },
  ],
};

export const years = Object.keys(sermonsByYear).sort((a, b) => Number(b) - Number(a));

export function findSermonBySlug(slug: string): Sermon | null {
  for (const year of years) {
    const found = sermonsByYear[year].find((s) => s.slug === slug);
    if (found) return found;
  }
  return null;
}
