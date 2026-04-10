import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, Music, ExternalLink, BookOpen, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type HymnGroup = {
  id: string;
  title: string;
  hymns: { zh: string; en?: string; audioZh?: string; audioEn?: string; video?: string }[];
};

const hymnGroups: HymnGroup[] = [
  {
    id: 'i101', title: '01、团组聚会1月份诗歌',
    hymns: [
      { zh: '快来拥祂为王', en: 'Crown Him with Many Crowns', audioZh: 'https://cmacmc.org/wp-content/uploads/2024/10/crown-him-with-many-crowns-ch.mp3', audioEn: 'https://cmacmc.org/wp-content/uploads/2024/10/crown-him-with-many-crowns.mp3', video: 'https://www.youtube.com/watch?v=q6od8s_xOJ8' },
      { zh: '我知谁掌管明天', en: 'I Know Who Holds Tomorrow', video: 'https://www.youtube.com/watch?v=ifG3JDA9ezk' },
      { zh: '万福源头', en: 'Come Thou Fount of Every Blessing', video: 'https://www.youtube.com/watch?v=Qy85IAWenIs' },
    ],
  },
  {
    id: 'i102', title: '02、团组聚会2月份诗歌',
    hymns: [
      { zh: '祢真伟大', en: 'How Great Thou Art', video: 'https://www.youtube.com/watch?v=2A6yUWnpPig' },
      { zh: '全程主领', en: 'All the Way My Savior Leads Me', video: 'https://www.youtube.com/watch?v=oM3wMt5lLSw' },
      { zh: '我宁愿有耶稣', en: "I'd Rather Have Jesus", video: 'https://www.youtube.com/watch?v=Xs-l5GkOERw' },
    ],
  },
  {
    id: 'i103', title: '03、团组聚会3月份诗歌',
    hymns: [
      { zh: '圣哉、圣哉、圣哉', en: 'Holy, Holy, Holy!', video: 'https://www.youtube.com/watch?v=9xlosxk20fg' },
      { zh: '坐在宝座上圣洁羔羊', video: 'https://www.youtube.com/watch?v=HtGiy4M6NMI' },
      { zh: '古旧十架', en: 'The Old Rugged Cross', video: 'https://www.youtube.com/watch?v=C9Iz8bliBwc' },
    ],
  },
  {
    id: 'i104', title: '04、团组聚会4月份诗歌',
    hymns: [
      { zh: '因祂活着', en: 'Because He Lives', video: 'https://www.youtube.com/watch?v=r1Fzv-GHN7k' },
      { zh: '祢若不压橄榄成渣', video: 'https://www.youtube.com/watch?v=SjHYej6Lm10' },
      { zh: '祢信实何广大', en: 'Great Is Thy Faithfulness', video: 'https://www.youtube.com/watch?v=sdZnsZ3AH-A' },
    ],
  },
  {
    id: 'i105', title: '05、团组聚会5月份诗歌',
    hymns: [
      { zh: '我深知所信的是谁', en: 'I Know Whom I Have Believed', video: 'https://www.youtube.com/watch?v=MZCmhponHiw' },
      { zh: '愿开我眼', en: 'Open My Eyes, That I May See', video: 'https://www.youtube.com/watch?v=XxuU-D5sfRw' },
      { zh: '一生跟随祢', video: 'https://www.youtube.com/watch?v=QREPLcsOyWU' },
    ],
  },
  {
    id: 'i106', title: '06、团组聚会6月份诗歌',
    hymns: [
      { zh: '奇妙的策士', video: 'https://www.youtube.com/watch?v=tX8bLLiHJBA' },
      { zh: '奇妙生命之道', en: 'Wonderful Words of Life', video: 'https://www.youtube.com/watch?v=KLGAO-rmZuo' },
      { zh: '成为我异象', en: 'Be Thou My Vision', video: 'https://www.youtube.com/watch?v=THZIg3XV0k8' },
    ],
  },
  {
    id: 'i107', title: '07、团组聚会7月份诗歌',
    hymns: [
      { zh: '惟在基督里', en: 'In Christ Alone', video: 'https://www.youtube.com/watch?v=8NfvW3gJ16s' },
      { zh: '奇异恩典', en: 'Amazing Grace', video: 'https://www.youtube.com/watch?v=GIu-Zw5lf0s' },
      { zh: '坚固保障', en: 'A Mighty Fortress Is Our God', video: 'https://www.youtube.com/watch?v=qF1r4Tg24mw' },
    ],
  },
  {
    id: 'i108', title: '08、团组聚会8月份诗歌',
    hymns: [
      { zh: '神哪！我要赞美祢', video: 'https://www.youtube.com/watch?v=T3Nvsx4b7CQ' },
      { zh: '祂藏我灵', en: 'He Hideth My Soul', video: 'https://www.youtube.com/watch?v=f0VfzCiw8js' },
      { zh: '恳求全能王来临', en: 'Come, Thou Almighty King', video: 'https://www.youtube.com/watch?v=K6hRnB7iGSU' },
    ],
  },
  {
    id: 'i109', title: '09、团组聚会9月份诗歌',
    hymns: [
      { zh: '有一位神', video: 'https://www.youtube.com/watch?v=b3oivk4W7EY' },
      { zh: '主耶和华是我牧者', en: "The Lord's My Shepherd", video: 'https://www.youtube.com/watch?v=jyqv9DVK8u8' },
      { zh: '耶稣恩友', en: 'What a Friend We Have in Jesus', video: 'https://www.youtube.com/watch?v=_EkytZFcA70' },
    ],
  },
  {
    id: 'i110', title: '10、团组聚会10月份诗歌',
    hymns: [
      { zh: '我的神，我的父，我的磐石', video: 'https://www.youtube.com/watch?v=YGKAdp-i7TE' },
      { zh: '赞祂赞祂', en: 'Praise Him! Praise Him!', video: 'https://www.youtube.com/watch?v=8r8sfjdhoTo' },
      { zh: '齐颂耶稣之名大能', en: "All Hail the Power of Jesus' Name", video: 'https://www.youtube.com/watch?v=_J65SxPZwAE' },
    ],
  },
  {
    id: 'i111', title: '11、团组聚会11月份诗歌',
    hymns: [
      { zh: '从亘古到永远' },
      { zh: '神的路', en: "God's Way" },
      { zh: '有福的确据', en: 'Blessed Assurance' },
    ],
  },
  {
    id: 'i112', title: '12、团组聚会12月份诗歌',
    hymns: [
      { zh: '我的心，你要称颂耶和华' },
      { zh: '如鹿渴慕', en: 'As the Deer Panteth' },
      { zh: '献上活祭', en: 'My Living Sacrifice' },
    ],
  },
  {
    id: 'i201', title: '13、祷告会每月第1周诗歌',
    hymns: [
      { zh: '主我愿单属祢' },
      { zh: '祷告良辰', en: 'Sweet Hour of Prayer' },
      { zh: '愿神向我吹气', en: 'Breathe On Me, Breath of God' },
    ],
  },
  {
    id: 'i202', title: '14、祷告会每月第2周诗歌',
    hymns: [
      { zh: '我的神我要敬拜祢' },
      { zh: '当转眼仰望耶稣', en: 'Turn Your Eyes Upon Jesus' },
      { zh: '只有宝血', en: 'Nothing But the Blood' },
    ],
  },
  {
    id: 'i203', title: '15、祷告会每月第3周诗歌',
    hymns: [
      { zh: '在我的内心里' },
      { zh: '我曾求主，让我成长', en: 'Prayer Answered by Crosses' },
      { zh: '主我愿像祢', en: 'O To Be Like Thee' },
    ],
  },
  {
    id: 'i204', title: '16、祷告会每月第4周诗歌',
    hymns: [
      { zh: '祢的话' },
      { zh: '我听救主说道', en: 'I Hear the Saviour Say' },
      { zh: '我只做怜悯债户', en: 'A Debtor to Mercy Alone' },
    ],
  },
  {
    id: 'i205', title: '17、祷告会每月第5周诗歌',
    hymns: [
      { zh: '亲爱主，牵我手', en: 'Precious Lord, Take My Hand' },
      { zh: '我时刻需要祢', en: 'I Need Thee Every Hour' },
      { zh: '我需要有祢在我生命中' },
    ],
  },
  {
    id: 'i301', title: '18、擘饼聚会每季第1个月诗歌',
    hymns: [
      { zh: '靠近十架', en: 'Near the Cross' },
      { zh: '更亲近恩主', en: 'Draw Me Nearer' },
      { zh: '家在那边', en: 'O Think of the Home Over There' },
    ],
  },
  {
    id: 'i302', title: '19、擘饼聚会每季第2个月诗歌',
    hymns: [
      { zh: '怎能如此', en: 'And Can It Be That I Should Gain' },
      { zh: '与主更亲近', en: 'Nearer, My God, to Thee' },
      { zh: '擘生命饼', en: 'Break Thou the Bread of Life' },
    ],
  },
  {
    id: 'i303', title: '20、擘饼聚会每季第3个月诗歌',
    hymns: [
      { zh: '领我到髑髅地', en: 'Lead Me to Calvary' },
      { zh: '同聚美地', en: 'In The Sweet By and By' },
      { zh: '只愿得着祢' },
    ],
  },
  {
    id: 'i401', title: '21、主日崇拜——宣召（Call to Worship）',
    hymns: [
      { zh: '荣耀归于真神', en: 'To God Be the Glory' },
      { zh: '荣耀归与至高神', en: 'Glory To God In The Highest' },
      { zh: '敬拜主', en: 'Majesty' },
      { zh: '每当我瞻仰祢的圣洁', en: 'When I Look Into Your Holiness' },
      { zh: '耶和华神已掌权' },
      { zh: '祢坐着为王' },
      { zh: '愿祢崇高' },
      { zh: '耶和华祢是我的神' },
      { zh: '注目看耶稣' },
      { zh: '永恒的主' },
      { zh: '求祢国度降临' },
    ],
  },
  {
    id: 'i402', title: '22、主日崇拜——赞美（Praise）',
    hymns: [
      { zh: '我口发出，天韵歌声', en: 'Begin, My Tongue, Some Heavenly Theme' },
      { zh: '我灵，赞美天上君王', en: 'Praise, My Soul, the King of Heaven' },
      { zh: '赞美上主，全能真神', en: 'Praise to the Lord, the Almighty' },
      { zh: '敬拜至高王', en: 'O Worship the King' },
      { zh: '祂名称为奇妙', en: 'His Name Is Wonderful' },
      { zh: '耶稣发光', en: 'Shine, Jesus, Shine' },
      { zh: '我唱神的伟大权能', en: 'I Sing the Mighty Power of God' },
      { zh: '神的作为何其奥秘', en: 'God Moves in a Mysterious Way' },
      { zh: '不朽无形独一全智神', en: 'Immortal, Invisible, God Only Wise' },
      { zh: '亚伯拉罕称颂之神', en: 'The God of Abraham Praise' },
      { zh: '耶稣必作王', en: 'Jesus Shall Reign' },
    ],
  },
  {
    id: 'i403', title: '23、主日崇拜——认罪（Confession）',
    hymns: [
      { zh: '求主察看', en: 'Search Me, O God' },
      { zh: '主，我要回家', en: "Lord, I'm Coming Home" },
      { zh: '我从深处向祢求告' },
      { zh: '诗篇三十二篇' },
      { zh: '祢是我神' },
      { zh: '转回' },
    ],
  },
  {
    id: 'i404', title: '24、主日崇拜——赦免（Forgiveness）',
    hymns: [
      { zh: '我们伟大的救主', en: 'Our Great Saviour' },
      { zh: '耶稣拯救', en: 'Jesus Saves' },
      { zh: '宝血有力量', en: 'There is Power In the Blood' },
      { zh: '耶稣温柔慈声', en: 'Softly and Tenderly' },
      { zh: '但有君王恩典声', en: "There's a Voice of Sovereign Grace" },
      { zh: '神圣之爱', en: 'Love Divine, All Loves Excelling' },
    ],
  },
  {
    id: 'i405', title: '25、主日崇拜——确据（Assurance）',
    hymns: [
      { zh: '信靠耶稣', en: 'Trusting Jesus' },
      { zh: '照我本相', en: 'Just As I Am' },
      { zh: '站立在应许上', en: 'Standing On the Promises' },
      { zh: '坚固磐石', en: 'The Solid Rock' },
      { zh: '万古磐石为我开', en: 'Rock of Ages, Cleft for Me' },
      { zh: '千古帮助', en: 'O God, Our Help in Ages Past' },
      { zh: '安稳在耶稣手臂', en: 'Safe in the Arms of Jesus' },
      { zh: '平安有时如宁静河', en: 'When Peace, Like a River' },
      { zh: '信靠耶稣如此甜蜜', en: "'Tis So Sweet to Trust in Jesus" },
      { zh: '不是我，乃是基督在里面活', en: 'Yet Not I But Through Christ In Me' },
      { zh: '耶和华的心' },
      { zh: '祢的爱不离不弃' },
    ],
  },
  {
    id: 'i406', title: '26、主日崇拜——感恩（Thanksgiving）',
    hymns: [
      { zh: '数算主恩', en: 'Count Your Blessings' },
      { zh: '天父必看顾你', en: "Be Not Dismayed Whate'er Befall" },
      { zh: '一万个理由', en: '10,000 Reasons' },
      { zh: '与我同住', en: 'Abide With Me' },
      { zh: '靠近祢', en: 'Close to Thee' },
      { zh: '求主像牧人引导我们', en: 'Savior, Like a Shepherd Lead Us' },
    ],
  },
  {
    id: 'i407', title: '27、主日崇拜——委身（Dedication）',
    hymns: [
      { zh: '信靠顺服', en: 'Trust and Obey' },
      { zh: '将你最好的献给主', en: 'Give of Your Best to the Master' },
      { zh: '我向耶稣交出所有', en: 'All to Jesus I Surrender' },
      { zh: '主耶稣我爱祢', en: 'My Jesus, I Love Thee' },
      { zh: '祂领我行', en: 'He Leadeth Me' },
      { zh: '更高之处', en: 'Higher Ground' },
      { zh: '我生命求主管理', en: 'Take My Life, and Let It Be' },
      { zh: '十架之路意味着牺牲', en: 'The Way of the Cross Means Sacrifice' },
      { zh: '主军前进', en: 'Onward, Christian Soldiers' },
      { zh: '认识祢，耶稣', en: 'Knowing You, Jesus' },
      { zh: '今要祂自己', en: 'Himself' },
      { zh: '未及之地', en: 'The Regions Beyond' },
      { zh: '惟独耶稣', en: 'Jesus Only' },
      { zh: '竭诚献上' },
    ],
  },
  {
    id: 'i408', title: '28、主日崇拜——受难日/逾越节',
    hymns: [
      { zh: '为我受伤', en: 'Wounded for Me' },
      { zh: '哀哉救主竟流宝血', en: 'Alas, and Did My Savior Bleed' },
      { zh: '当我仰望奇妙十架', en: 'When I Survey the Wondrous Cross' },
      { zh: '祢是我永远的救主' },
    ],
  },
  {
    id: 'i409', title: '29、主日崇拜——复活节/初熟节',
    hymns: [
      { zh: '基督我主今复活', en: 'Christ the Lord Is Risen Today' },
      { zh: '我事奉复活救主', en: 'I Serve a Risen Savior' },
      { zh: '基督复活', en: 'Christ Arose' },
      { zh: '有一活泉', en: 'Praise for the Fountain Opened' },
      { zh: '祂是主', en: 'He Is Lord' },
    ],
  },
  {
    id: 'i410', title: '30、主日崇拜——五旬节/七七节',
    hymns: [
      { zh: '圣灵作我身心之主', en: "Hover O'er Me, Holy Spirit" },
      { zh: '恳求圣灵降临我心', en: 'Spirit of God, Descend Upon My Heart' },
      { zh: '教会的唯一根基', en: "The Church's One Foundation" },
    ],
  },
  {
    id: 'i411', title: '31、主日崇拜——感恩节',
    hymns: [
      { zh: '同往锡安', en: 'Marching to Zion' },
      { zh: '这是天父世界', en: "This Is My Father's World" },
      { zh: '感谢神', en: 'Thanks to God for My Redeemer' },
      { zh: '献上感恩', en: 'Give Thanks' },
    ],
  },
  {
    id: 'i412', title: '32、主日崇拜——将临节',
    hymns: [
      { zh: '以马内利', en: 'Emmanuel' },
      { zh: '以马内利来临', en: 'O Come, O Come, Emmanuel' },
      { zh: '普世欢腾', en: 'Joy To the World' },
    ],
  },
  {
    id: 'i413', title: '33、主日崇拜——圣诞节',
    hymns: [
      { zh: '齐来，宗主信徒', en: 'O Come, All Ye Faithful' },
      { zh: '是何婴孩', en: 'What Child Is This' },
      { zh: '听啊！传令天使唱', en: 'Hark! The Herald Angels Sing' },
      { zh: '天使来自荣耀国度', en: 'Angels From the Realms of Glory' },
      { zh: '从荣耀降临', en: 'Down From His Glory' },
      { zh: '宁静的伯利恒' },
    ],
  },
];

function HymnContent() {
  const { language } = useLanguage();

  const pageTitle = { en: 'Hymn Recommendations', zh: '诗歌推荐', th: 'แนะนำเพลงสรรเสริญ' };
  const backLabel = { en: '← Back to Ministries', zh: '← 返回教会服侍', th: '← กลับไปการรับใช้' };
  const t = (obj: Record<string, string>) => obj[language] || obj.en;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link to="/ministries" className="text-accent hover:underline text-sm mb-6 inline-block">
        {t(backLabel)}
      </Link>

      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          {t(pageTitle)}
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-4">
          精选151首敬拜诗歌，分为33组，适用于团契小组聚会、祷告会、擘饼聚会和主日崇拜。
        </p>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>诗歌包括三种类型：<strong>传统圣诗</strong>（Hymns）、<strong>福音歌曲</strong>（Gospel Songs）、<strong>赞美短歌</strong>（Praise Choruses）。</p>
          <p>主日崇拜诗歌顺序：宣召 → 赞美 → 交通（认罪、赦免、确据） → 回应（感恩、委身）。</p>
        </div>
      </div>

      {/* Psalter Section */}
      <div className="mb-10 bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-accent" />
          </div>
          <h2 className="font-heading text-xl font-semibold text-foreground">诗篇圣咏（Psalter）</h2>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          诗篇是神所默示的诗歌，颂唱诗篇就是用主耶稣基督自己的歌与祂一同歌唱。推荐使用《The Book of Psalms for Worship》，中文版译为《耶和华的歌》。
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="https://h.land/blog/182814" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
            <ExternalLink className="h-3.5 w-3.5" /> 清唱版
          </a>
          <a href="https://psalter.org/sing/psalter?psalter_in=worship&psalm_in=1A" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
            <ExternalLink className="h-3.5 w-3.5" /> 曲调版
          </a>
          <a href="https://cmacmc.org/wp-content/uploads/2024/10/the-book-of-psalms-for-worship.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
            <ExternalLink className="h-3.5 w-3.5" /> 歌谱PDF (50MB)
          </a>
        </div>
      </div>

      {/* Hymn Groups */}
      <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
        <Music className="inline h-6 w-6 text-accent mr-2" />
        敬拜诗选（151首）
      </h2>

      <Accordion type="multiple" className="space-y-2">
        {hymnGroups.map((group) => (
          <AccordionItem key={group.id} value={group.id} className="bg-card rounded-lg border border-border px-4">
            <AccordionTrigger className="text-sm font-semibold text-foreground hover:text-accent py-3">
              {group.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pb-2">
                {group.hymns.map((hymn, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground min-w-[1.5rem] text-right">{idx + 1}.</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-foreground font-medium">{hymn.zh}</span>
                      {hymn.en && <span className="text-muted-foreground">{hymn.en}</span>}
                      {hymn.video && (
                        <a href={hymn.video} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600 inline-flex items-center" title="YouTube">
                          <Youtube className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-8 text-center">
        <a
          href="https://cmchurch.org/2023/03/23/worship-songs/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent hover:underline text-sm"
        >
          <ExternalLink className="h-4 w-4" />
          查看完整歌词与领唱音频（来源：基督、使命与教会）
        </a>
      </div>
    </div>
  );
}

export default function HymnRecommendationPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <HymnContent />
      </PageLayout>
    </LanguageProvider>
  );
}
