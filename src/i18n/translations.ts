export type Language = 'en' | 'zh' | 'th';

export const translations = {
  // Navigation
  nav: {
    about: { en: 'About Us', zh: '关于我们', th: 'เกี่ยวกับเรา' },
    statementOfFaith: { en: 'Statement of Faith', zh: '信仰告白', th: 'คำแถลงศรัทธา' },
    ministryTeam: { en: 'Ministry Team', zh: '服侍团队', th: 'ทีมรับใช้' },
    constitution: { en: 'Church Constitution', zh: '教会章程', th: 'ธรรมนูญคริสตจักร' },
    location: { en: 'Location', zh: '教会地址', th: 'ที่ตั้ง' },
    annualTheme: { en: 'Annual Theme', zh: '今年主题', th: 'ธีมประจำปี' },
    sundayService: { en: 'Sunday Service', zh: '本周主日', th: 'วันอาทิตย์' },
    joinUs: { en: 'Join Us', zh: '加入我们', th: 'เข้าร่วม' },
    membershipApplication: { en: 'Membership Application', zh: '申请会友', th: 'สมัครสมาชิก' },
    ministries: { en: 'Ministries', zh: '教会服侍', th: 'การรับใช้' },
    choir: { en: 'Choir', zh: '诗班', th: 'คณะนักร้อง' },
    youth: { en: 'Youth Ministry', zh: '青少年服侍', th: 'พันธกิจเยาวชน' },
    children: { en: "Children's Ministry", zh: '儿童服侍', th: 'พันธกิจเด็ก' },
    resources: { en: 'Resources', zh: '学习资源', th: 'แหล่งเรียนรู้' },
    westminster: { en: 'Westminster Catechism', zh: '威斯敏斯特教理问答', th: 'คำสอนเวสต์มินสเตอร์' },
    heidelberg: { en: 'Heidelberg Catechism', zh: '海德堡教理问答', th: 'คำสอนไฮเดลเบิร์ก' },
  },

  // Hero section
  hero: {
    title: {
      en: 'Trinity Community Church',
      zh: '三一社区教会',
      th: 'คริสตจักรชุมชนตรีเอกานุภาพ',
    },
    subtitle: {
      en: 'Bangkok, Thailand',
      zh: '泰国曼谷',
      th: 'กรุงเทพฯ ประเทศไทย',
    },
    themeLabel: {
      en: '2024 Annual Theme',
      zh: '2024年度主题',
      th: 'ธีมประจำปี 2024',
    },
    theme: {
      en: '"Growing Together in Christ"',
      zh: '"在基督里一同成长"',
      th: '"เติบโตร่วมกันในพระคริสต์"',
    },
    cta1: { en: 'Find Us', zh: '教会地址', th: 'ค้นหาเรา' },
    cta2: { en: "This Week's Sermon", zh: '本周讲道', th: 'คำเทศนาสัปดาห์นี้' },
  },

  // Statement of Faith
  faith: {
    title: { en: 'Statement of Faith', zh: '信仰告白', th: 'คำแถลงศรัทธา' },
    articles: [
      {
        en: 'We believe that the entire Bible is inspired by God, and that the original texts are without error, and are the complete and sole revelation concerning salvation. The Bible contains the truths we should believe and the duties we should fulfill in our faith.',
        zh: '我们相信整本《圣经》都是上帝所默示的，且原文无谬误，是关乎救恩的全备和唯一的启示。圣经包含我们信仰中所当信的真理及当尽的本分。',
        th: 'เราเชื่อว่าพระคัมภีร์ทั้งเล่มได้รับการดลใจจากพระเจ้า และต้นฉบับไม่มีข้อผิดพลาด เป็นการเปิดเผยที่สมบูรณ์และเป็นหนึ่งเดียวเกี่ยวกับความรอด',
      },
      {
        en: 'We believe in the Triune God—Father, Son, and Holy Spirit—and believe that Jesus Christ is true God and true man. We believe in His atoning death and bodily resurrection, and believe He is the only Way, the Truth, the Life, and our sole source of salvation.',
        zh: '我们相信三位一体的上帝——圣父、圣子和圣灵，相信耶稣基督是真上帝，亦是真人。我们相信他的赎罪之死和肉身复活，相信他是唯一的道路、真理、生命，是我们的唯一的救赎之源。',
        th: 'เราเชื่อในพระเจ้าตรีเอกานุภาพ—พระบิดา พระบุตร และพระวิญญาณบริสุทธิ์—และเชื่อว่าพระเยซูคริสต์เป็นพระเจ้าแท้และมนุษย์แท้',
      },
      {
        en: 'We believe that God created a good world, that humanity fell into sin, and that God, in His grace and love, through the life, work, and suffering of Jesus Christ, provided us a path of redemption and renewal.',
        zh: '我们相信上帝创造的世界甚好，人类在罪中堕落，上帝在祂的恩典和爱中，通过耶稣基督的生命、工作和受难，为我们提供了一条救赎和更新的道路。',
        th: 'เราเชื่อว่าพระเจ้าทรงสร้างโลกที่ดี มนุษย์ตกในบาป และพระเจ้าในพระคุณและความรักของพระองค์ ทรงจัดเตรียมทางแห่งการไถ่และการฟื้นฟู',
      },
      {
        en: 'We receive the heritage of the early church, taking the Apostles\' Creed, the Nicene Creed, the Chalcedonian Creed, and the Athanasian Creed as accurate and concise expressions of biblical truth.',
        zh: '我们领受早期教会的传承，以《使徒信经》、《尼西亚信经》、《迦克敦信经》和《亚塔那修信经》为对圣经真理准确、简洁的表达。',
        th: 'เรารับมรดกของคริสตจักรยุคแรก โดยถือว่าหลักข้อเชื่อของอัครทูต หลักข้อเชื่อไนซีน หลักข้อเชื่อคาลซีดอน และหลักข้อเชื่ออาธานาเซียส เป็นการแสดงออกที่ถูกต้องของความจริงในพระคัมภีร์',
      },
      {
        en: 'We accept the five fundamental principles of the Reformation: "Scripture Alone, Christ Alone, Grace Alone, Faith Alone, Glory to God Alone," as the basic principles for our life, work, and church witness.',
        zh: '我们接受宗教改革后的五项基本原则，即"惟独圣经、惟独基督、惟独恩典、惟独信心、惟独归荣耀给上帝"，将其作为生活、工作和教会见证的基本原则。',
        th: 'เรายอมรับหลักการพื้นฐานห้าประการของการปฏิรูป: "พระคัมภีร์เท่านั้น พระคริสต์เท่านั้น พระคุณเท่านั้น ความเชื่อเท่านั้น ถวายเกียรติแด่พระเจ้าเท่านั้น"',
      },
      {
        en: 'We believe that the church today, relying on the great power of the Holy Spirit, continually renews individuals, families, and the world through the proclamation of the Gospel.',
        zh: '我们相信，今天的教会依靠圣灵的大能，通过宣讲福音，不断更新个人、家庭和世界。',
        th: 'เราเชื่อว่าคริสตจักรในปัจจุบัน โดยอาศัยฤทธิ์เดชอันยิ่งใหญ่ของพระวิญญาณบริสุทธิ์ ฟื้นฟูบุคคล ครอบครัว และโลกอย่างต่อเนื่องผ่านการประกาศพระกิตติคุณ',
      },
    ],
  },

  // Ministry team
  team: {
    title: { en: 'Ministry Team', zh: '服侍团队', th: 'ทีมรับใช้' },
    members: [
      { name: 'Pastor Mac Wiener', role: { en: 'Pastor', zh: '麦克牧师', th: 'ศิษยาภิบาล' } },
      { name: 'Elder Caleb Luo', role: { en: 'Elder', zh: '罗坚长老', th: 'ผู้ปกครอง' } },
      { name: 'Elder Martin Zhang', role: { en: 'Elder', zh: '张马丁长老', th: 'ผู้ปกครอง' } },
    ],
  },

  // Sermons
  sermons: {
    title: { en: 'Sunday Service', zh: '本周主日', th: 'นมัสการวันอาทิตย์' },
    subtitle: { en: 'Weekly Sermons', zh: '每周讲道', th: 'คำเทศนาประจำสัปดาห์' },
    play: { en: 'Play', zh: '播放', th: 'เล่น' },
    noSermons: { en: 'Sermons coming soon.', zh: '讲道音频即将上线。', th: 'คำเทศนาเร็วๆ นี้' },
  },

  // Membership
  membership: {
    title: { en: 'Membership Application', zh: '申请会友', th: 'สมัครสมาชิก' },
    intro: {
      en: 'We warmly invite you to join Trinity Community Church. Please fill in the form below.',
      zh: '我们诚挚邀请您加入三一社区教会。请填写以下表格。',
      th: 'เราขอเชิญชวนคุณเข้าร่วมคริสตจักรชุมชนตรีเอกานุภาพ กรุณากรอกแบบฟอร์มด้านล่าง',
    },
    nameLabel: { en: 'Full Name', zh: '姓名', th: 'ชื่อ-นามสกุล' },
    emailLabel: { en: 'Email', zh: '电子邮箱', th: 'อีเมล' },
    phoneLabel: { en: 'Phone', zh: '电话', th: 'โทรศัพท์' },
    typeLabel: { en: 'Membership Type', zh: '会友类型', th: 'ประเภทสมาชิก' },
    types: [
      {
        en: 'Transfer membership from another church',
        zh: '从其他教会转移会籍',
        th: 'โอนสมาชิกภาพจากคริสตจักรอื่น',
      },
      {
        en: 'Associate Member (retain membership elsewhere)',
        zh: '副会友（保留其他教会会籍）',
        th: 'สมาชิกสมทบ (คงสมาชิกภาพที่อื่น)',
      },
      {
        en: 'Baptized but not a member of any church',
        zh: '已受洗但不是任何教会的正式成员',
        th: 'รับบัพติศมาแล้วแต่ไม่ได้เป็นสมาชิกคริสตจักรใด',
      },
      {
        en: 'Seek baptism and full membership',
        zh: '寻求受洗并成为正式会友',
        th: 'ต้องการรับบัพติศมาและเป็นสมาชิกเต็มรูปแบบ',
      },
    ],
    childrenLabel: { en: 'Children (names, ages, baptismal status)', zh: '子女信息（姓名、年龄、受洗状况）', th: 'บุตร (ชื่อ อายุ สถานะบัพติศมา)' },
    messageLabel: { en: 'Additional Message', zh: '其他信息', th: 'ข้อความเพิ่มเติม' },
    submit: { en: 'Submit Application', zh: '提交申请', th: 'ส่งใบสมัคร' },
    success: { en: 'Application submitted! We will contact you soon.', zh: '申请已提交！我们将尽快与您联系。', th: 'ส่งใบสมัครแล้ว! เราจะติดต่อคุณเร็วๆ นี้' },
  },

  // Ministries
  ministriesSection: {
    title: { en: 'Church Ministries', zh: '教会服侍', th: 'การรับใช้ของคริสตจักร' },
    choir: {
      title: { en: 'Choir', zh: '诗班', th: 'คณะนักร้อง' },
      desc: { en: 'Praising God through music and song in our worship services.', zh: '在崇拜中以音乐和诗歌赞美上帝。', th: 'สรรเสริญพระเจ้าผ่านดนตรีและบทเพลงในการนมัสการ' },
    },
    youth: {
      title: { en: 'Youth Ministry', zh: '青少年服侍', th: 'พันธกิจเยาวชน' },
      desc: { en: 'Nurturing the next generation through fellowship, study, and service.', zh: '通过团契、学习和服侍培养下一代。', th: 'ฟูมฟักคนรุ่นต่อไปผ่านสามัคคีธรรม การศึกษา และการรับใช้' },
    },
    children: {
      title: { en: "Children's Ministry", zh: '儿童服侍', th: 'พันธกิจเด็ก' },
      desc: { en: 'Teaching children the love of God through age-appropriate lessons and activities.', zh: '通过适龄课程和活动教导儿童认识上帝的爱。', th: 'สอนเด็กๆ เกี่ยวกับความรักของพระเจ้าผ่านบทเรียนและกิจกรรมที่เหมาะสมกับวัย' },
    },
  },

  // Resources
  resourcesSection: {
    title: { en: 'Learning Resources', zh: '学习资源', th: 'แหล่งเรียนรู้' },
    westminster: {
      title: { en: 'Westminster Shorter Catechism', zh: '威斯敏斯特小要理问答', th: 'คำสอนสั้นเวสต์มินสเตอร์' },
      desc: { en: 'A foundational Reformed catechism summarizing Christian doctrine in question-and-answer format.', zh: '以问答形式概括基督教教义的改革宗基础要理问答。', th: 'คำสอนปฏิรูปพื้นฐานที่สรุปหลักคำสอนคริสเตียนในรูปแบบถาม-ตอบ' },
    },
    heidelberg: {
      title: { en: 'Heidelberg Catechism', zh: '海德堡教理问答', th: 'คำสอนไฮเดลเบิร์ก' },
      desc: { en: 'A warm and personal catechism exploring human misery, redemption, and gratitude.', zh: '一部温暖而个人化的教理问答，探讨人的苦难、救赎和感恩。', th: 'คำสอนที่อบอุ่นและเป็นส่วนตัว สำรวจความทุกข์ การไถ่ และความกตัญญูของมนุษย์' },
    },
  },

  // Location
  location: {
    title: { en: 'Find Us', zh: '教会地址', th: 'ค้นหาเรา' },
    address: { en: 'Bangkok, Thailand', zh: '泰国曼谷', th: 'กรุงเทพฯ ประเทศไทย' },
    serviceTime: { en: 'Sunday Service: 10:00 AM', zh: '主日崇拜：上午10:00', th: 'นมัสการวันอาทิตย์: 10:00 น.' },
  },

  // Footer
  footer: {
    copyright: {
      en: '© 2024 Trinity Community Church (Bangkok). All rights reserved.',
      zh: '© 2024 三一社区教会（曼谷）。保留所有权利。',
      th: '© 2024 คริสตจักรชุมชนตรีเอกานุภาพ (กรุงเทพฯ) สงวนลิขสิทธิ์',
    },
  },
};

export function t(obj: Record<Language, string>, lang: Language): string {
  return obj[lang] || obj.en;
}
