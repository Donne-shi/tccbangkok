// 2026 Christian & Jewish liturgical calendar
// Jewish dates from Hebcal; Christian dates per Western tradition (with notes for Eastern Orthodox where relevant)

export type FeastTradition = 'christian' | 'jewish';

export interface Feast {
  date: string; // ISO YYYY-MM-DD
  tradition: FeastTradition;
  name: { en: string; zh: string; th: string };
  desc: { en: string; zh: string; th: string };
}

export const feasts2026: Feast[] = [
  // ===== Christian =====
  {
    date: '2026-01-06',
    tradition: 'christian',
    name: { en: 'Epiphany', zh: '主显节', th: 'วันเอพิฟานี' },
    desc: {
      en: 'Celebrates the revelation of Christ to the Gentiles (the Magi).',
      zh: '纪念基督向外邦人（东方博士）的显现。',
      th: 'ระลึกถึงการสำแดงพระคริสต์แก่คนต่างชาติ (โหราจารย์)',
    },
  },
  {
    date: '2026-02-18',
    tradition: 'christian',
    name: { en: 'Ash Wednesday', zh: '圣灰星期三', th: 'วันพุธรับเถ้า' },
    desc: {
      en: 'Beginning of Lent — 40 days of repentance leading to Easter.',
      zh: '大斋期开始 —— 通往复活节的四十天悔改之旅。',
      th: 'เริ่มต้นเทศกาลมหาพรต 40 วันแห่งการกลับใจ',
    },
  },
  {
    date: '2026-03-29',
    tradition: 'christian',
    name: { en: 'Palm Sunday', zh: '棕枝主日', th: 'วันอาทิตย์ทางตาล' },
    desc: {
      en: "Commemorates Jesus' triumphal entry into Jerusalem.",
      zh: '纪念耶稣荣进耶路撒冷。',
      th: 'ระลึกการเสด็จเข้ากรุงเยรูซาเล็มอย่างผู้พิชิต',
    },
  },
  {
    date: '2026-04-02',
    tradition: 'christian',
    name: { en: 'Maundy Thursday', zh: '濯足节', th: 'วันพฤหัสศักดิ์สิทธิ์' },
    desc: {
      en: 'The Last Supper and institution of the Lord’s Supper.',
      zh: '最后的晚餐与圣餐礼的设立。',
      th: 'อาหารมื้อสุดท้ายและการตั้งศีลมหาสนิท',
    },
  },
  {
    date: '2026-04-03',
    tradition: 'christian',
    name: { en: 'Good Friday', zh: '受难日', th: 'วันศุกร์ประเสริฐ' },
    desc: {
      en: 'Commemorates the crucifixion and death of Jesus Christ.',
      zh: '纪念耶稣基督被钉十字架与受死。',
      th: 'ระลึกการตรึงกางเขนและการสิ้นพระชนม์ของพระเยซู',
    },
  },
  {
    date: '2026-04-05',
    tradition: 'christian',
    name: { en: 'Easter Sunday', zh: '复活节', th: 'วันอีสเตอร์' },
    desc: {
      en: 'The resurrection of Jesus Christ — the heart of the Christian faith.',
      zh: '耶稣基督复活 —— 基督信仰的核心。',
      th: 'การคืนพระชนม์ของพระเยซูคริสต์ — หัวใจแห่งความเชื่อคริสเตียน',
    },
  },
  {
    date: '2026-05-14',
    tradition: 'christian',
    name: { en: 'Ascension Day', zh: '升天节', th: 'วันเสด็จขึ้นสวรรค์' },
    desc: {
      en: 'The ascension of Christ to heaven, 40 days after Easter.',
      zh: '复活节后第四十天，基督升天。',
      th: 'การเสด็จขึ้นสวรรค์ของพระคริสต์ 40 วันหลังอีสเตอร์',
    },
  },
  {
    date: '2026-05-24',
    tradition: 'christian',
    name: { en: 'Pentecost', zh: '五旬节', th: 'วันเพ็นเทคอสต์' },
    desc: {
      en: 'The outpouring of the Holy Spirit — the birthday of the Church.',
      zh: '圣灵降临 —— 教会的生日。',
      th: 'การเทพระวิญญาณบริสุทธิ์ — วันกำเนิดคริสตจักร',
    },
  },
  {
    date: '2026-05-31',
    tradition: 'christian',
    name: { en: 'Trinity Sunday', zh: '三一主日', th: 'วันอาทิตย์ตรีเอกานุภาพ' },
    desc: {
      en: 'Celebrates the doctrine of the Holy Trinity.',
      zh: '庆祝三位一体的真理。',
      th: 'เฉลิมฉลองหลักข้อเชื่อตรีเอกานุภาพ',
    },
  },
  {
    date: '2026-10-31',
    tradition: 'christian',
    name: { en: 'Reformation Day', zh: '宗教改革纪念日', th: 'วันปฏิรูปศาสนา' },
    desc: {
      en: 'Commemorates Martin Luther’s 95 Theses (1517).',
      zh: '纪念马丁·路德于 1517 年发表《九十五条论纲》。',
      th: 'ระลึกถึง 95 ข้อของมาร์ติน ลูเธอร์ (1517)',
    },
  },
  {
    date: '2026-11-29',
    tradition: 'christian',
    name: { en: 'First Sunday of Advent', zh: '将临期首主日', th: 'วันอาทิตย์แรกแห่งเทศกาลเตรียมรับเสด็จ' },
    desc: {
      en: 'Beginning of Advent — preparation for Christ’s coming.',
      zh: '将临期开始 —— 预备基督的降临。',
      th: 'เริ่มต้นเทศกาลเตรียมรับเสด็จพระคริสต์',
    },
  },
  {
    date: '2026-12-24',
    tradition: 'christian',
    name: { en: 'Christmas Eve', zh: '平安夜', th: 'วันคริสต์มาสอีฟ' },
    desc: {
      en: 'Vigil of the Nativity of the Lord.',
      zh: '主降生庆典前夕。',
      th: 'คืนก่อนวันคริสต์มาส',
    },
  },
  {
    date: '2026-12-25',
    tradition: 'christian',
    name: { en: 'Christmas Day', zh: '圣诞节', th: 'วันคริสต์มาส' },
    desc: {
      en: 'The birth of Jesus Christ, the Word made flesh.',
      zh: '耶稣基督降生 —— 道成了肉身。',
      th: 'การประสูติของพระเยซูคริสต์',
    },
  },

  // ===== Jewish (per Hebcal 2026; biblical feasts the church should know) =====
  {
    date: '2026-03-03',
    tradition: 'jewish',
    name: { en: 'Purim', zh: '普珥节', th: 'เทศกาลปูริม' },
    desc: {
      en: 'Commemorates the deliverance of the Jews recorded in Esther.',
      zh: '纪念以斯帖记中犹太人得拯救。',
      th: 'ระลึกการช่วยกู้ชาวยิวในพระธรรมเอสเธอร์',
    },
  },
  {
    date: '2026-04-02',
    tradition: 'jewish',
    name: { en: 'Passover (Pesach) begins', zh: '逾越节开始', th: 'เริ่มเทศกาลปัสกา' },
    desc: {
      en: 'Commemorates the Exodus from Egypt — the foundational redemption story.',
      zh: '纪念以色列出埃及 —— 救赎历史的根基。',
      th: 'ระลึกการอพยพออกจากอียิปต์',
    },
  },
  {
    date: '2026-04-09',
    tradition: 'jewish',
    name: { en: 'Passover ends', zh: '逾越节结束', th: 'สิ้นสุดปัสกา' },
    desc: {
      en: 'Last day of the seven-day feast of Unleavened Bread.',
      zh: '七日除酵节的最后一天。',
      th: 'วันสุดท้ายของเทศกาลขนมปังไร้เชื้อ 7 วัน',
    },
  },
  {
    date: '2026-05-22',
    tradition: 'jewish',
    name: { en: 'Shavuot (Feast of Weeks)', zh: '七七节（五旬节）', th: 'เทศกาลชาวูโอท' },
    desc: {
      en: 'Celebrates the giving of the Torah at Sinai — falls 50 days after Passover.',
      zh: '庆祝在西奈山赐下妥拉，逾越节后第五十日。',
      th: 'เฉลิมฉลองการประทานโทราห์ที่ภูเขาซีนาย',
    },
  },
  {
    date: '2026-09-12',
    tradition: 'jewish',
    name: { en: 'Rosh Hashanah', zh: '犹太新年', th: 'โรช ฮาชานาห์' },
    desc: {
      en: 'Jewish New Year — Feast of Trumpets.',
      zh: '犹太新年 —— 吹角节。',
      th: 'ปีใหม่ของชาวยิว — เทศกาลเป่าแตร',
    },
  },
  {
    date: '2026-09-21',
    tradition: 'jewish',
    name: { en: 'Yom Kippur', zh: '赎罪日', th: 'ยม คิปปูร์' },
    desc: {
      en: 'Day of Atonement — the holiest day of the Jewish year.',
      zh: '赎罪日 —— 犹太年中最神圣的日子。',
      th: 'วันลบมลทิน — วันศักดิ์สิทธิ์ที่สุดของชาวยิว',
    },
  },
  {
    date: '2026-09-26',
    tradition: 'jewish',
    name: { en: 'Sukkot (Feast of Tabernacles)', zh: '住棚节', th: 'เทศกาลอยู่เพิง' },
    desc: {
      en: 'Seven-day feast remembering Israel’s wilderness journey.',
      zh: '七日的节期，纪念以色列人在旷野的旅程。',
      th: 'เทศกาล 7 วันระลึกการเดินทางในถิ่นทุรกันดาร',
    },
  },
  {
    date: '2026-12-05',
    tradition: 'jewish',
    name: { en: 'Hanukkah begins', zh: '修殿节（光明节）开始', th: 'เริ่มเทศกาลฮานุกกะห์' },
    desc: {
      en: 'Festival of Dedication — celebrates the rededication of the Temple (John 10:22).',
      zh: '修殿节 —— 庆祝圣殿重新被分别为圣（约 10:22）。',
      th: 'เทศกาลถวายพระวิหาร (ยอห์น 10:22)',
    },
  },
];
