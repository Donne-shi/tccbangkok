import { Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, ExternalLink, BookOpen, Headphones } from 'lucide-react';

const SOURCE_URL = 'https://cmchurch.org/%e3%80%8a%e5%ae%8b%e5%b0%9a%e8%8a%82%e4%bc%a0%e3%80%8b%e6%9c%97%e8%af%bb%e7%89%88/';
const INTRO_AUDIO = 'https://cmchurch.org/wp-content/uploads/2021/11/johnsung-00-1.mp3';

type Chapter = { title: string; url: string };
type Section = { title: string; closing?: string; chapters: Chapter[] };

const SECTIONS: Section[] = [
  {
    title: '前言',
    closing: '奋兴短歌121首《十字架十字架》',
    chapters: [],
  },
  {
    title: '第一部分：懵懂少年',
    closing: '奋兴短歌集62首《归家吧》',
    chapters: [
      { title: '一　中国使徒', url: 'https://cmchurch.org/2018/10/29/%e4%b8%80%e3%80%81%e4%b8%ad%e5%9b%bd%e4%bd%bf%e5%be%92/' },
      { title: '二　敬虔之家（1901-1909年）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%8c%e3%80%81%e6%95%ac%e8%99%94%e4%b9%8b%e5%ae%b6%ef%bc%881901-1909%e5%b9%b4%ef%bc%89/' },
      { title: '三　初历奋兴（1909-1913年）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%89%e3%80%81%e5%88%9d%e5%8e%86%e5%a5%8b%e5%85%b4%ef%bc%881909-1913%e5%b9%b4%ef%bc%89/' },
      { title: '四　中学时代（1913-1919年）', url: 'https://cmchurch.org/2018/10/29/%e5%9b%9b%e3%80%81%e4%b8%ad%e5%ad%a6%e6%97%b6%e4%bb%a3%ef%bc%881913-1919%e5%b9%b4%ef%bc%89/' },
      { title: '五　赴美留学（1919-1920年）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%94%e3%80%81%e8%b5%b4%e7%be%8e%e7%95%99%e5%ad%a6%ef%bc%881919-1920%e5%b9%b4%ef%bc%89/' },
    ],
  },
  {
    title: '第二部分：还缺一件',
    closing: '奋兴短歌集185首《少年你还缺少一件》',
    chapters: [
      { title: '六　发奋图强（1920-1921年）', url: 'https://cmchurch.org/2018/10/29/%e5%85%ad%e3%80%81%e5%8f%91%e5%a5%8b%e5%9b%be%e5%bc%ba%ef%bc%881920-1921%e5%b9%b4%ef%bc%89/' },
      { title: '七　看见异象（1922年）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%83%e3%80%81%e7%9c%8b%e8%a7%81%e5%bc%82%e8%b1%a1%ef%bc%881922%e5%b9%b4%ef%bc%89/' },
      { title: '八　大学毕业（1923年）', url: 'https://cmchurch.org/2018/10/29/%e5%85%ab%e3%80%81%e5%a4%a7%e5%ad%a6%e6%af%95%e4%b8%9a%ef%bc%881923%e5%b9%b4%ef%bc%89/' },
      { title: '九　陷入虚荣（1924-1926年）', url: 'https://cmchurch.org/2018/10/29/%e4%b9%9d%e3%80%81%e9%99%b7%e5%85%a5%e8%99%9a%e8%8d%a3%ef%bc%881924-1926%e5%b9%b4%ef%bc%89/' },
    ],
  },
  {
    title: '第三部分：被神唤醒',
    closing: '奋兴短歌集58首《你必须要重生》',
    chapters: [
      { title: '十　新派神学（1926年9月）', url: 'https://cmchurch.org/2018/10/29/%e5%8d%81%e3%80%81%e6%96%b0%e6%b4%be%e7%a5%9e%e5%ad%a6%ef%bc%881926%e5%b9%b49%e6%9c%88%ef%bc%89/' },
      { title: '十一　经历重生（1927年2月10日）', url: 'https://cmchurch.org/2018/10/29/%e5%8d%81%e4%b8%80%e3%80%81%e7%bb%8f%e5%8e%86%e9%87%8d%e7%94%9f%ef%bc%881927%e5%b9%b42%e6%9c%8810%e6%97%a5%ef%bc%89/' },
      { title: '十二　疯人院中（1927年2至8月）', url: 'https://cmchurch.org/2018/10/29/%e5%8d%81%e4%ba%8c%e3%80%81%e7%96%af%e4%ba%ba%e9%99%a2%e4%b8%ad%ef%bc%881927%e5%b9%b42%e6%9c%88%e8%87%b38%e6%9c%88%ef%bc%89/' },
      { title: '十三　撇弃粪土（1927年10月）', url: 'https://cmchurch.org/2018/10/29/%e5%8d%81%e4%b8%89%e3%80%81%e6%92%87%e5%bc%83%e7%b2%aa%e5%9c%9f%ef%bc%881927%e5%b9%b410%e6%9c%88%ef%bc%89/' },
    ],
  },
  {
    title: '第四部分：三年实践',
    closing: '奋兴短歌集122首《在各各他山上》',
    chapters: [
      { title: '十四　回到老家（1927年11月）', url: 'https://cmchurch.org/2018/10/29/%e5%8d%81%e5%9b%9b%e3%80%81%e5%9b%9e%e5%88%b0%e8%80%81%e5%ae%b6%ef%bc%881927%e5%b9%b411%e6%9c%88%ef%bc%89/' },
      { title: '十五　在乡传道（1928-1930年）', url: 'https://cmchurch.org/2018/10/29/%e5%8d%81%e4%ba%94%e3%80%81%e5%9c%a8%e4%b9%a1%e4%bc%a0%e9%81%93%ef%bc%881928-1930%e5%b9%b4%ef%bc%89/' },
      { title: '十六　神的约束（1930年）', url: 'https://cmchurch.org/2018/10/29/%e5%8d%81%e5%85%ad%e3%80%81%e7%a5%9e%e7%9a%84%e7%ba%a6%e6%9d%9f%ef%bc%881930%e5%b9%b4%ef%bc%89/' },
    ],
  },
  {
    title: '第五部分：「门」的时期',
    closing: '奋兴短歌集66首《罪恶出去活水进来》',
    chapters: [
      { title: '十七　初出茅庐（1930-1931年浙苏冀京）', url: 'https://cmchurch.org/2018/10/29/%e5%8d%81%e4%b8%83%e3%80%81%e5%88%9d%e5%87%ba%e8%8c%85%e5%ba%90%ef%bc%881930-1931%e5%b9%b4%e6%b5%99%e8%8b%8f%e5%86%80%e4%ba%ac%ef%bc%89/' },
      { title: '十八　神的引导（1931年京沪赣）', url: 'https://cmchurch.org/2018/10/29/%e5%8d%81%e5%85%ab%e3%80%81%e7%a5%9e%e7%9a%84%e5%bc%95%e5%af%bc%ef%bc%881931%e5%b9%b4%e4%ba%ac%e6%b2%aa%e8%b5%a3%ef%bc%89/' },
      { title: '十九　复兴秘诀（1931年赣皖沪）', url: 'https://cmchurch.org/2018/10/29/%e5%8d%81%e4%b9%9d%e3%80%81%e5%a4%8d%e5%85%b4%e7%a7%98%e8%af%80%ef%bc%881931%e5%b9%b43%e6%9c%88%e8%b5%a3%e7%9a%96%e6%b2%aa%ef%bc%89/' },
      { title: '二十　加入团队（1931年苏鲁）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%8c%e5%8d%81%e3%80%81%e5%8a%a0%e5%85%a5%e5%9b%a2%e9%98%9f%ef%bc%881931%e5%b9%b4%e8%8b%8f%e9%b2%81%ef%bc%89/' },
      { title: '二十一　沿海布道（1931年鲁沪闽）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%8c%e5%8d%81%e4%b8%80%e3%80%81%e6%b2%bf%e6%b5%b7%e5%b8%83%e9%81%93%ef%bc%881931%e5%b9%b4%e9%b2%81%e6%b2%aa%e9%97%bd%ef%bc%89/' },
      { title: '二十二　东北布道（1931年辽黑吉）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%8c%e5%8d%81%e4%ba%8c%e3%80%81%e4%b8%9c%e5%8c%97%e5%b8%83%e9%81%93%ef%bc%881931%e5%b9%b4%e8%be%bd%e9%bb%91%e5%90%89%ef%bc%89/' },
      { title: '二十三　医病恩赐（1931-1932年鲁沪）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%8c%e5%8d%81%e4%b8%89%e3%80%81%e5%8c%bb%e7%97%85%e6%81%a9%e8%b5%90%ef%bc%881931-1932%e5%b9%b4%e9%b2%81%e6%b2%aa%ef%bc%89/' },
      { title: '二十四　华南布道（1932年港粤桂闽）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%8c%e5%8d%81%e5%9b%9b%e3%80%81%e5%8d%8e%e5%8d%97%e5%b8%83%e9%81%93%ef%bc%881932%e5%b9%b4%e6%b8%af%e7%b2%a4%e6%a1%82%e9%97%bd%ef%bc%89/' },
      { title: '二十五　巩固成果（1932年沪粤）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%8c%e5%8d%81%e4%ba%94%e3%80%81%e5%b7%a9%e5%9b%ba%e6%88%90%e6%9e%9c%ef%bc%881932%e5%b9%b4%e6%b2%aa%e7%b2%a4%ef%bc%89/' },
      { title: '二十六　华北布道（1932-1933年鄂冀京津豫鲁晋）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%8c%e5%8d%81%e5%85%ad%e3%80%81%e5%8d%8e%e5%8c%97%e5%b8%83%e9%81%93%ef%bc%881932-1933%e5%b9%b4%e9%84%82%e5%86%80%e4%ba%ac%e6%b4%a5%e8%b1%ab%e9%b2%81%e6%99%8b%ef%bc%89/' },
      { title: '二十七　聚散有时（1933年冀蒙京湘）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%8c%e5%8d%81%e4%b8%83%e3%80%81%e8%81%9a%e6%95%a3%e6%9c%89%e6%97%b6%ef%bc%881933%e5%b9%b4%e5%86%80%e8%92%99%e4%ba%ac%e6%b9%98%ef%bc%89/' },
    ],
  },
  {
    title: '第六部分：「鸽」的时期',
    closing: '奋兴短歌集18首《我离了主就不能做》',
    chapters: [
      { title: '二十八　信心之鸽（1934年苏皖鲁津京浙）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%8c%e5%8d%81%e5%85%ab%e3%80%81%e4%bf%a1%e5%bf%83%e4%b9%8b%e9%b8%bd%ef%bc%881934%e5%b9%b4%e8%8b%8f%e7%9a%96%e9%b2%81%e6%b4%a5%e4%ba%ac%e6%b5%99%ef%bc%89/' },
      { title: '二十九　恩门大开（1934-1935年闽苏浙粤津京冀菲）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%8c%e5%8d%81%e4%b9%9d%e3%80%81%e6%81%a9%e9%97%a8%e5%a4%a7%e5%bc%80%ef%bc%881934-1935%e5%b9%b4%e9%97%bd%e8%8b%8f%e6%b5%99%e7%b2%a4%e6%b4%a5%e4%ba%ac%e5%86%80%e8%8f%b2%ef%bc%89/' },
      { title: '三十　南洋初渡（1935年新马印）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%89%e5%8d%81%e3%80%81%e5%8d%97%e6%b4%8b%e5%88%9d%e6%b8%a1%ef%bc%881935%e5%b9%b4%e6%96%b0%e9%a9%ac%e5%8d%b0%ef%bc%89/' },
      { title: '三十一　时不我待（1935-1936年苏冀津京鲁沪闽台粤）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%89%e5%8d%81%e4%b8%80%e3%80%81%e6%97%b6%e4%b8%8d%e6%88%91%e5%be%85%ef%bc%881935-1936%e5%b9%b4%e8%8b%8f%e5%86%80%e6%b4%a5%e4%ba%ac%e9%b2%81%e6%b2%aa%e9%97%bd%e5%8f%b0%e7%b2%a4%ef%bc%89/' },
      { title: '三十二　再渡南洋（1936年新马缅）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%89%e5%8d%81%e4%ba%8c%e3%80%81%e5%86%8d%e6%b8%a1%e5%8d%97%e6%b4%8b%ef%bc%881936%e5%b9%b4%e6%96%b0%e9%a9%ac%e7%bc%85%ef%bc%89/' },
      { title: '三十三　国难前夜（1937年粤闽苏浙豫晋）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%89%e5%8d%81%e4%b8%89%e3%80%81%e5%9b%bd%e9%9a%be%e5%89%8d%e5%a4%9c%ef%bc%881937%e5%b9%b4%e7%b2%a4%e9%97%bd%e8%8b%8f%e6%b5%99%e8%b1%ab%e6%99%8b%ef%bc%89/' },
      { title: '三十四　逆行精兵（1937-1938年浙鲁豫陕晋皖沪闽）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%89%e5%8d%81%e5%9b%9b%e3%80%81%e9%80%86%e8%a1%8c%e7%b2%be%e5%85%b5%ef%bc%881937-1938%e5%b9%b4%e6%b5%99%e9%b2%81%e8%b1%ab%e9%99%95%e6%99%8b%e7%9a%96%e6%b2%aa%e9%97%bd%ef%bc%89/' },
      { title: '三十五　见缝插针（1938年越滇）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%89%e5%8d%81%e4%ba%94%e3%80%81%e8%a7%81%e7%bc%9d%e6%8f%92%e9%92%88%ef%bc%881938%e5%b9%b4%e8%b6%8a%e6%bb%87%ef%bc%89/' },
      { title: '三十六　三渡南洋（1938年泰新马）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%89%e5%8d%81%e5%85%ad%e3%80%81%e4%b8%89%e6%b8%a1%e5%8d%97%e6%b4%8b%ef%bc%881938%e5%b9%b4%e6%b3%b0%e6%96%b0%e9%a9%ac%ef%bc%89/' },
      { title: '三十七　初到印尼（1939年印新）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%89%e5%8d%81%e4%b8%83%e3%80%81%e5%88%9d%e5%88%b0%e5%8d%b0%e5%b0%bc%ef%bc%881939%e5%b9%b4%e5%8d%b0%e6%96%b0%ef%bc%89/' },
      { title: '三十八　四渡南洋（1939年泰）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%89%e5%8d%81%e5%85%ab%e3%80%81%e5%9b%9b%e6%b8%a1%e5%8d%97%e6%b4%8b%ef%bc%881939%e5%b9%b4%e6%b3%b0%ef%bc%89/' },
      { title: '三十九　雾锁南洋（1939年下半年印马新）', url: 'https://cmchurch.org/2018/10/29/%e4%b8%89%e5%8d%81%e4%b9%9d%e3%80%81%e9%9b%be%e9%94%81%e5%8d%97%e6%b4%8b%ef%bc%881939%e5%b9%b4%e4%b8%8b%e5%8d%8a%e5%b9%b4%e5%8d%b0%e9%a9%ac%e6%96%b0%ef%bc%89/' },
    ],
  },
  {
    title: '第七部分：灵程高峰',
    closing: '奋兴短歌集174首《主耶稣啊想起了祢》',
    chapters: [
      { title: '四十　夜间歌唱（1940-1942年）', url: 'https://cmchurch.org/2018/10/29/%e5%9b%9b%e5%8d%81%e3%80%81%e5%a4%9c%e9%97%b4%e6%ad%8c%e5%94%b1%ef%bc%881940-1942%e5%b9%b4%ef%bc%89/' },
      { title: '四十一　最后争战（1943-1944年）', url: 'https://cmchurch.org/2018/10/29/%e4%ba%94%e5%8d%81%e4%ba%8c%e3%80%81%e6%9c%80%e5%90%8e%e4%ba%89%e6%88%98%ef%bc%881943-1944%ef%bc%89/' },
      { title: '四十二　瑕难掩瑜', url: 'https://cmchurch.org/2018/10/29/%e5%9b%9b%e5%8d%81%e4%ba%8c%e3%80%81%e7%91%95%e9%9a%be%e6%8e%a9%e7%91%9c/' },
      { title: '四十三　正直无伪（王明道的评价）', url: 'https://cmchurch.org/2018/10/29/%e5%9b%9b%e5%8d%81%e4%b8%89%e3%80%81%e6%ad%a3%e7%9b%b4%e6%97%a0%e4%bc%aa%ef%bc%88%e7%8e%8b%e6%98%8e%e9%81%93%e7%9a%84%e8%af%84%e4%bb%b7%ef%bc%89/' },
      { title: '后记', url: 'https://cmchurch.org/2021/10/29/%e5%90%8e%e8%ae%b0/' },
    ],
  },
  {
    title: '附录：见证',
    closing: '奋兴短歌集176首《人算什么祢竟顾念》',
    chapters: [
      { title: '长女宋天婴的见证', url: 'https://cmchurch.org/2018/10/29/%e5%ae%8b%e5%b0%9a%e8%8a%82%e9%95%bf%e5%a5%b3%e5%ae%8b%e5%a4%a9%e5%a9%b4%e7%9a%84%e8%a7%81%e8%af%81/' },
      { title: '次女宋天真的见证', url: 'https://cmchurch.org/2018/10/29/%e5%ae%8b%e5%b0%9a%e8%8a%82%e6%ac%a1%e5%a5%b3%e5%ae%8b%e5%a4%a9%e7%9c%9f%e7%9a%84%e8%a7%81%e8%af%81/' },
      { title: '十二位牧者的见证', url: 'https://cmchurch.org/2018/10/29/%e5%8d%81%e4%ba%8c%e4%bd%8d%e7%89%a7%e8%80%85%e7%9a%84%e8%a7%81%e8%af%81/' },
    ],
  },
];

function JohnSungContent() {
  const { language } = useLanguage();

  const heading =
    language === 'zh' ? '《宋尚节传》朗读版'
    : language === 'th' ? 'ชีวประวัติของ จอห์น ซ่ง (ฉบับเสียงอ่าน)'
    : 'Biography of John Sung (Audio Edition)';

  const subtitle =
    language === 'zh'
      ? '宋尚节博士（1901–1944）是华人教会历史上最伟大的布道家之一。他十五年的事奉硕果累累，对华人教会产生深远影响。本朗读版根据《灵历集光》《失而复得的日记》等史料整理。'
      : language === 'th'
      ? 'ดร. จอห์น ซ่ง (1901–1944) นักประกาศข่าวประเสริฐผู้ยิ่งใหญ่ในประวัติศาสตร์คริสตจักรจีน รับใช้พระเจ้าเพียง 15 ปี แต่ส่งผลกระทบลึกซึ้งต่อคริสตจักรจีนทั่วโลก'
      : 'Dr. John Sung (1901–1944) is regarded as one of the greatest evangelists in Chinese church history. His 15-year ministry bore lasting fruit across Asia.';

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/resources/youth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {language === 'zh' ? '返回青少年信仰成长' : language === 'th' ? 'กลับ' : 'Back to Youth Resources'}
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="h-8 w-8 text-accent" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{heading}</h1>
        </div>
        <p className="text-muted-foreground mb-8 leading-relaxed">{subtitle}</p>

        {/* Source attribution */}
        <div className="bg-secondary border border-border rounded-lg p-5 mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'zh' ? '内容来源' : language === 'th' ? 'แหล่งที่มา' : 'Source'}
          </p>
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            cmchurch.org · 基督、使命与教会
            <ExternalLink className="h-4 w-4" />
          </a>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {language === 'zh'
              ? '原作者：刘翼凌教授（1903–1994）。本页面为目录索引，所有章节内容与音频均托管于原网站，版权归原作者及发布方所有。'
              : language === 'th'
              ? 'ผู้เขียนต้นฉบับ: ศาสตราจารย์ Liu Yiling (1903–1994). หน้านี้เป็นสารบัญ เนื้อหาและเสียงทั้งหมดอยู่ที่เว็บไซต์ต้นทาง'
              : 'Original author: Prof. Liu Yiling (1903–1994). This page is an index; all chapter text and audio are hosted on the source site and remain the property of the original publisher.'}
          </p>
        </div>

        {/* Intro audio */}
        <div className="bg-card border border-border rounded-lg p-5 mb-10 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Headphones className="h-5 w-5 text-accent" />
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {language === 'zh' ? '前言朗读' : language === 'th' ? 'คำนำ (เสียง)' : 'Preface Audio'}
            </h2>
          </div>
          <audio controls preload="none" className="w-full">
            <source src={INTRO_AUDIO} type="audio/mpeg" />
          </audio>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((sec, i) => (
            <div key={i}>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                {sec.title}
              </h2>
              {sec.chapters.length > 0 && (
                <div className="space-y-2 mb-3">
                  {sec.chapters.map((c, j) => (
                    <a
                      key={j}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-border hover:border-primary/50 transition-colors group"
                    >
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {c.title}
                      </span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}
              {sec.closing && (
                <p className="text-xs text-muted-foreground italic pl-1">
                  {language === 'zh' ? '结束曲：' : language === 'th' ? 'เพลงปิด: ' : 'Closing hymn: '}
                  {sec.closing}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer attribution */}
        <div className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          {language === 'zh' ? '内容转载自 ' : language === 'th' ? 'เนื้อหาจาก ' : 'Content from '}
          <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            cmchurch.org
          </a>
        </div>
      </div>
    </section>
  );
}

export default function JohnSungBiographyPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <JohnSungContent />
      </PageLayout>
    </LanguageProvider>
  );
}
