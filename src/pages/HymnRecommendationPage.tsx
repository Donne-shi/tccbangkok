import { useState } from 'react';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, Music, ExternalLink, BookOpen, Youtube, X } from 'lucide-react';
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
      { zh: '从亘古到永远', video: 'https://www.youtube.com/watch?v=YVqYn9E5Drk' },
      { zh: '神的路', en: "God's Way", video: 'https://www.youtube.com/watch?v=0VZRCaTi8mM' },
      { zh: '有福的确据', en: 'Blessed Assurance', video: 'https://www.youtube.com/watch?v=6kVLWxaKoLQ' },
    ],
  },
  {
    id: 'i112', title: '12、团组聚会12月份诗歌',
    hymns: [
      { zh: '我的心，你要称颂耶和华', video: 'https://www.youtube.com/watch?v=jDG0JcxdI2I' },
      { zh: '如鹿渴慕', en: 'As the Deer Panteth', video: 'https://www.youtube.com/watch?v=peZujWMjYnM' },
      { zh: '献上活祭', en: 'My Living Sacrifice', video: 'https://www.youtube.com/watch?v=KgZaGZ5YHMs' },
    ],
  },
  {
    id: 'i201', title: '13、祷告会每月第1周诗歌',
    hymns: [
      { zh: '主我愿单属祢', video: 'https://www.youtube.com/watch?v=Q6Hcy5CIiGU' },
      { zh: '祷告良辰', en: 'Sweet Hour of Prayer', video: 'https://www.youtube.com/watch?v=RLxMr2g0JOo' },
      { zh: '愿神向我吹气', en: 'Breathe On Me, Breath of God', video: 'https://www.youtube.com/watch?v=m_-WHkzJ6bI' },
    ],
  },
  {
    id: 'i202', title: '14、祷告会每月第2周诗歌',
    hymns: [
      { zh: '我的神我要敬拜祢', video: 'https://www.youtube.com/watch?v=t3LZ7vJHkDQ' },
      { zh: '当转眼仰望耶稣', en: 'Turn Your Eyes Upon Jesus', video: 'https://www.youtube.com/watch?v=wqBYMegeJKA' },
      { zh: '只有宝血', en: 'Nothing But the Blood', video: 'https://www.youtube.com/watch?v=xQz1Jk5TjXc' },
    ],
  },
  {
    id: 'i203', title: '15、祷告会每月第3周诗歌',
    hymns: [
      { zh: '在我的内心里', video: 'https://www.youtube.com/watch?v=W_CziIPbk2U' },
      { zh: '我曾求主，让我成长', en: 'Prayer Answered by Crosses', video: 'https://www.youtube.com/watch?v=uQ6H7kru6Ao' },
      { zh: '主我愿像祢', en: 'O To Be Like Thee', video: 'https://www.youtube.com/watch?v=2qGzpJdh0iY' },
    ],
  },
  {
    id: 'i204', title: '16、祷告会每月第4周诗歌',
    hymns: [
      { zh: '祢的话', video: 'https://www.youtube.com/watch?v=rvWpXOaB2NM' },
      { zh: '我听救主说道', en: 'I Hear the Saviour Say', video: 'https://www.youtube.com/watch?v=1NItCFIe0p0' },
      { zh: '我只做怜悯债户', en: 'A Debtor to Mercy Alone', video: 'https://www.youtube.com/watch?v=cFB3Dth1bes' },
    ],
  },
  {
    id: 'i205', title: '17、祷告会每月第5周诗歌',
    hymns: [
      { zh: '亲爱主，牵我手', en: 'Precious Lord, Take My Hand', video: 'https://www.youtube.com/watch?v=bJ2kJHiyqug' },
      { zh: '我时刻需要祢', en: 'I Need Thee Every Hour', video: 'https://www.youtube.com/watch?v=FNFazQDPUFo' },
      { zh: '我需要有祢在我生命中', video: 'https://www.youtube.com/watch?v=1SLBxXN0_mE' },
    ],
  },
  {
    id: 'i301', title: '18、擘饼聚会每季第1个月诗歌',
    hymns: [
      { zh: '靠近十架', en: 'Near the Cross', video: 'https://www.youtube.com/watch?v=k3RjQ-p97hE' },
      { zh: '更亲近恩主', en: 'Draw Me Nearer', video: 'https://www.youtube.com/watch?v=IG-87f9j0MI' },
      { zh: '家在那边', en: 'O Think of the Home Over There', video: 'https://www.youtube.com/watch?v=sQzF-xZ3GRM' },
    ],
  },
  {
    id: 'i302', title: '19、擘饼聚会每季第2个月诗歌',
    hymns: [
      { zh: '怎能如此', en: 'And Can It Be That I Should Gain', video: 'https://www.youtube.com/watch?v=oT-K8fkFyag' },
      { zh: '与主更亲近', en: 'Nearer, My God, to Thee', video: 'https://www.youtube.com/watch?v=w-0CS-T1Hig' },
      { zh: '擘生命饼', en: 'Break Thou the Bread of Life', video: 'https://www.youtube.com/watch?v=t8dTualr4NA' },
    ],
  },
  {
    id: 'i303', title: '20、擘饼聚会每季第3个月诗歌',
    hymns: [
      { zh: '领我到髑髅地', en: 'Lead Me to Calvary', video: 'https://www.youtube.com/watch?v=vVl2b4t3D_E' },
      { zh: '同聚美地', en: 'In The Sweet By and By', video: 'https://www.youtube.com/watch?v=P26o5e7emPQ' },
      { zh: '只愿得着祢', video: 'https://www.youtube.com/watch?v=6i-d1Cvsyxc' },
    ],
  },
  {
    id: 'i401', title: '21、主日崇拜——宣召（Call to Worship）',
    hymns: [
      { zh: '荣耀归于真神', en: 'To God Be the Glory', video: 'https://www.youtube.com/watch?v=sd6_kOgDvjU' },
      { zh: '荣耀归与至高神', en: 'Glory To God In The Highest', video: 'https://www.youtube.com/watch?v=Q5Cu9CPID9E' },
      { zh: '敬拜主', en: 'Majesty', video: 'https://www.youtube.com/watch?v=bOvP7s0h7YI' },
      { zh: '每当我瞻仰祢的圣洁', en: 'When I Look Into Your Holiness', video: 'https://www.youtube.com/watch?v=P6c0dYDLe3E' },
      { zh: '耶和华神已掌权', video: 'https://www.youtube.com/watch?v=Z6iNp6s4w3o' },
      { zh: '祢坐着为王', video: 'https://www.youtube.com/watch?v=uX5Zp5K7PUY' },
      { zh: '愿祢崇高', video: 'https://www.youtube.com/watch?v=x1TK59-2wLM' },
      { zh: '耶和华祢是我的神', video: 'https://www.youtube.com/watch?v=H7pJb49vVQY' },
      { zh: '注目看耶稣', video: 'https://www.youtube.com/watch?v=0cXS0jxQBs4' },
      { zh: '永恒的主', video: 'https://www.youtube.com/watch?v=AUj9clkF4r4' },
      { zh: '求祢国度降临', video: 'https://www.youtube.com/watch?v=cZLeSzKft2Q' },
    ],
  },
  {
    id: 'i402', title: '22、主日崇拜——赞美（Praise）',
    hymns: [
      { zh: '我口发出，天韵歌声', en: 'Begin, My Tongue, Some Heavenly Theme', video: 'https://www.youtube.com/watch?v=6TxP0RkVYjA' },
      { zh: '我灵，赞美天上君王', en: 'Praise, My Soul, the King of Heaven', video: 'https://www.youtube.com/watch?v=sL1VGo9TrYM' },
      { zh: '赞美上主，全能真神', en: 'Praise to the Lord, the Almighty', video: 'https://www.youtube.com/watch?v=7s4mGHf7r98' },
      { zh: '敬拜至高王', en: 'O Worship the King', video: 'https://www.youtube.com/watch?v=QlH7sIQJuuU' },
      { zh: '祂名称为奇妙', en: 'His Name Is Wonderful', video: 'https://www.youtube.com/watch?v=Cqpf0SHVNlI' },
      { zh: '耶稣发光', en: 'Shine, Jesus, Shine', video: 'https://www.youtube.com/watch?v=kRdB7E1LqKA' },
      { zh: '我唱神的伟大权能', en: 'I Sing the Mighty Power of God', video: 'https://www.youtube.com/watch?v=N9yMXR2g8y0' },
      { zh: '神的作为何其奥秘', en: 'God Moves in a Mysterious Way', video: 'https://www.youtube.com/watch?v=EgLi0xj-xEA' },
      { zh: '不朽无形独一全智神', en: 'Immortal, Invisible, God Only Wise', video: 'https://www.youtube.com/watch?v=JLh_0GFvPIg' },
      { zh: '亚伯拉罕称颂之神', en: 'The God of Abraham Praise', video: 'https://www.youtube.com/watch?v=0I6s6SqGHzk' },
      { zh: '耶稣必作王', en: 'Jesus Shall Reign', video: 'https://www.youtube.com/watch?v=bXz_xzYJRPA' },
    ],
  },
  {
    id: 'i403', title: '23、主日崇拜——认罪（Confession）',
    hymns: [
      { zh: '求主察看', en: 'Search Me, O God', video: 'https://www.youtube.com/watch?v=1NQdq0gKHB0' },
      { zh: '主，我要回家', en: "Lord, I'm Coming Home", video: 'https://www.youtube.com/watch?v=rYO4OKAh4WI' },
      { zh: '我从深处向祢求告', video: 'https://www.youtube.com/watch?v=Bng__bEy5N4' },
      { zh: '诗篇三十二篇', video: 'https://www.youtube.com/watch?v=m8ljXlQrlDI' },
      { zh: '祢是我神', video: 'https://www.youtube.com/watch?v=AO_t7BC9qz4' },
      { zh: '转回', video: 'https://www.youtube.com/watch?v=JcC-xIVUbhI' },
    ],
  },
  {
    id: 'i404', title: '24、主日崇拜——赦免（Forgiveness）',
    hymns: [
      { zh: '我们伟大的救主', en: 'Our Great Saviour', video: 'https://www.youtube.com/watch?v=TF-i2rCsF5o' },
      { zh: '耶稣拯救', en: 'Jesus Saves', video: 'https://www.youtube.com/watch?v=Z28RYD7bHSY' },
      { zh: '宝血有力量', en: 'There is Power In the Blood', video: 'https://www.youtube.com/watch?v=U_V5kzlBb7Q' },
      { zh: '耶稣温柔慈声', en: 'Softly and Tenderly', video: 'https://www.youtube.com/watch?v=cpnMCQbWQx0' },
      { zh: '但有君王恩典声', en: "There's a Voice of Sovereign Grace", video: 'https://www.youtube.com/watch?v=VfGHQB8rkg4' },
      { zh: '神圣之爱', en: 'Love Divine, All Loves Excelling', video: 'https://www.youtube.com/watch?v=mLi7cUY2_Qs' },
    ],
  },
  {
    id: 'i405', title: '25、主日崇拜——确据（Assurance）',
    hymns: [
      { zh: '信靠耶稣', en: 'Trusting Jesus', video: 'https://www.youtube.com/watch?v=3xNXsVFl7ek' },
      { zh: '照我本相', en: 'Just As I Am', video: 'https://www.youtube.com/watch?v=r8RK0cEBIBM' },
      { zh: '站立在应许上', en: 'Standing On the Promises', video: 'https://www.youtube.com/watch?v=cFc-aqwCy8k' },
      { zh: '坚固磐石', en: 'The Solid Rock', video: 'https://www.youtube.com/watch?v=JlMOBo0bLqU' },
      { zh: '万古磐石为我开', en: 'Rock of Ages, Cleft for Me', video: 'https://www.youtube.com/watch?v=E-g2oGJ8M4k' },
      { zh: '千古帮助', en: 'O God, Our Help in Ages Past', video: 'https://www.youtube.com/watch?v=IJF93Jw15oE' },
      { zh: '安稳在耶稣手臂', en: 'Safe in the Arms of Jesus', video: 'https://www.youtube.com/watch?v=a4nLmT1b6mA' },
      { zh: '平安有时如宁静河', en: 'When Peace, Like a River', video: 'https://www.youtube.com/watch?v=zY5o9MhL-Gw' },
      { zh: '信靠耶稣如此甜蜜', en: "'Tis So Sweet to Trust in Jesus", video: 'https://www.youtube.com/watch?v=BrmA-DI4YGo' },
      { zh: '不是我，乃是基督在里面活', en: 'Yet Not I But Through Christ In Me', video: 'https://www.youtube.com/watch?v=zundjUFazfg' },
      { zh: '耶和华的心', video: 'https://www.youtube.com/watch?v=F-j9tLaObmI' },
      { zh: '祢的爱不离不弃', video: 'https://www.youtube.com/watch?v=iIaRxLKb8jc' },
    ],
  },
  {
    id: 'i406', title: '26、主日崇拜——感恩（Thanksgiving）',
    hymns: [
      { zh: '数算主恩', en: 'Count Your Blessings', video: 'https://www.youtube.com/watch?v=LXmX-BRIHG8' },
      { zh: '天父必看顾你', en: "Be Not Dismayed Whate'er Befall", video: 'https://www.youtube.com/watch?v=YLJv6xEzmc8' },
      { zh: '一万个理由', en: '10,000 Reasons', video: 'https://www.youtube.com/watch?v=XtwIT8JjddM' },
      { zh: '与我同住', en: 'Abide With Me', video: 'https://www.youtube.com/watch?v=YJNeRg_OJYs' },
      { zh: '靠近祢', en: 'Close to Thee', video: 'https://www.youtube.com/watch?v=pIMfTCqe6jE' },
      { zh: '求主像牧人引导我们', en: 'Savior, Like a Shepherd Lead Us', video: 'https://www.youtube.com/watch?v=lJDJVjGIKhQ' },
    ],
  },
  {
    id: 'i407', title: '27、主日崇拜——委身（Dedication）',
    hymns: [
      { zh: '信靠顺服', en: 'Trust and Obey', video: 'https://www.youtube.com/watch?v=bMltvlqEM54' },
      { zh: '将你最好的献给主', en: 'Give of Your Best to the Master', video: 'https://www.youtube.com/watch?v=bHD3JgKMYPk' },
      { zh: '我向耶稣交出所有', en: 'All to Jesus I Surrender', video: 'https://www.youtube.com/watch?v=R6gSMRJtEZ0' },
      { zh: '主耶稣我爱祢', en: 'My Jesus, I Love Thee', video: 'https://www.youtube.com/watch?v=Ij_iZ4-AxaM' },
      { zh: '祂领我行', en: 'He Leadeth Me', video: 'https://www.youtube.com/watch?v=PDJDxfnD3a8' },
      { zh: '更高之处', en: 'Higher Ground', video: 'https://www.youtube.com/watch?v=6gWdMbD_mxw' },
      { zh: '我生命求主管理', en: 'Take My Life, and Let It Be', video: 'https://www.youtube.com/watch?v=hexjPb4K9Lc' },
      { zh: '十架之路意味着牺牲', en: 'The Way of the Cross Means Sacrifice', video: 'https://www.youtube.com/watch?v=MKKO0vROH80' },
      { zh: '主军前进', en: 'Onward, Christian Soldiers', video: 'https://www.youtube.com/watch?v=S3MARatvJnQ' },
      { zh: '认识祢，耶稣', en: 'Knowing You, Jesus', video: 'https://www.youtube.com/watch?v=k3r2vVH6fNI' },
      { zh: '今要祂自己', en: 'Himself', video: 'https://www.youtube.com/watch?v=cQqawOE0wTg' },
      { zh: '未及之地', en: 'The Regions Beyond', video: 'https://www.youtube.com/watch?v=l8tOBb7b9zE' },
      { zh: '惟独耶稣', en: 'Jesus Only', video: 'https://www.youtube.com/watch?v=KXMr0v-1J9I' },
      { zh: '竭诚献上', video: 'https://www.youtube.com/watch?v=nEn8pZ-tXZM' },
    ],
  },
  {
    id: 'i408', title: '28、主日崇拜——受难日/逾越节',
    hymns: [
      { zh: '为我受伤', en: 'Wounded for Me', video: 'https://www.youtube.com/watch?v=bpNMPyB7VTU' },
      { zh: '哀哉救主竟流宝血', en: 'Alas, and Did My Savior Bleed', video: 'https://www.youtube.com/watch?v=lkYq2FgK2uQ' },
      { zh: '当我仰望奇妙十架', en: 'When I Survey the Wondrous Cross', video: 'https://www.youtube.com/watch?v=_coVRiPKjUE' },
      { zh: '祢是我永远的救主', video: 'https://www.youtube.com/watch?v=BFOdx0YqXS0' },
    ],
  },
  {
    id: 'i409', title: '29、主日崇拜——复活节/初熟节',
    hymns: [
      { zh: '基督我主今复活', en: 'Christ the Lord Is Risen Today', video: 'https://www.youtube.com/watch?v=QvSHaFGMx2w' },
      { zh: '我事奉复活救主', en: 'I Serve a Risen Savior', video: 'https://www.youtube.com/watch?v=HnTlJUdZaf8' },
      { zh: '基督复活', en: 'Christ Arose', video: 'https://www.youtube.com/watch?v=XnPk1RYNO0A' },
      { zh: '有一活泉', en: 'Praise for the Fountain Opened', video: 'https://www.youtube.com/watch?v=1Mji7kHJdO4' },
      { zh: '祂是主', en: 'He Is Lord', video: 'https://www.youtube.com/watch?v=WsfqPqDBQhg' },
    ],
  },
  {
    id: 'i410', title: '30、主日崇拜——五旬节/七七节',
    hymns: [
      { zh: '圣灵作我身心之主', en: "Hover O'er Me, Holy Spirit", video: 'https://www.youtube.com/watch?v=wbsPvY0q2Nw' },
      { zh: '恳求圣灵降临我心', en: 'Spirit of God, Descend Upon My Heart', video: 'https://www.youtube.com/watch?v=E4FJKZP-r9w' },
      { zh: '教会的唯一根基', en: "The Church's One Foundation", video: 'https://www.youtube.com/watch?v=QDjWGOvkOag' },
    ],
  },
  {
    id: 'i411', title: '31、主日崇拜——感恩节',
    hymns: [
      { zh: '同往锡安', en: 'Marching to Zion', video: 'https://www.youtube.com/watch?v=kSRCi_EdG68' },
      { zh: '这是天父世界', en: "This Is My Father's World", video: 'https://www.youtube.com/watch?v=_8n3S4PwQyM' },
      { zh: '感谢神', en: 'Thanks to God for My Redeemer', video: 'https://www.youtube.com/watch?v=VL3MdsU9jEM' },
      { zh: '献上感恩', en: 'Give Thanks', video: 'https://www.youtube.com/watch?v=KKe1CMfpmGI' },
    ],
  },
  {
    id: 'i412', title: '32、主日崇拜——将临节',
    hymns: [
      { zh: '以马内利', en: 'Emmanuel', video: 'https://www.youtube.com/watch?v=VuICIVXPfWk' },
      { zh: '以马内利来临', en: 'O Come, O Come, Emmanuel', video: 'https://www.youtube.com/watch?v=7xtpJ4Q_Q-4' },
      { zh: '普世欢腾', en: 'Joy To the World', video: 'https://www.youtube.com/watch?v=JIqSP2NqMo4' },
    ],
  },
  {
    id: 'i413', title: '33、主日崇拜——圣诞节',
    hymns: [
      { zh: '齐来，宗主信徒', en: 'O Come, All Ye Faithful', video: 'https://www.youtube.com/watch?v=bBiMPn4VRWE' },
      { zh: '是何婴孩', en: 'What Child Is This', video: 'https://www.youtube.com/watch?v=aAigPXbJiQU' },
      { zh: '听啊！传令天使唱', en: 'Hark! The Herald Angels Sing', video: 'https://www.youtube.com/watch?v=a2E5yiWe_ew' },
      { zh: '天使来自荣耀国度', en: 'Angels From the Realms of Glory', video: 'https://www.youtube.com/watch?v=VSkPCKR9o5E' },
      { zh: '从荣耀降临', en: 'Down From His Glory', video: 'https://www.youtube.com/watch?v=6VcQwE82nWA' },
      { zh: '宁静的伯利恒', video: 'https://www.youtube.com/watch?v=lyZJb0WkMhI' },
    ],
  },
];

function HymnItem({ hymn, idx, videoId }: { hymn: HymnGroup['hymns'][number]; idx: number; videoId: string | null }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 text-sm">
        <span className="text-muted-foreground min-w-[1.5rem] text-right">{idx + 1}.</span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-foreground font-medium">{hymn.zh}</span>
          {hymn.en && <span className="text-muted-foreground">{hymn.en}</span>}
          {videoId && (
            <button
              onClick={() => setPlaying(!playing)}
              className="text-destructive hover:text-destructive/80 inline-flex items-center gap-1 text-xs"
              title={playing ? '关闭' : '播放'}
            >
              {playing ? <X className="h-4 w-4" /> : <Youtube className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
      {playing && videoId && (
        <div className="ml-8 rounded-lg overflow-hidden aspect-video max-w-md">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
            title={hymn.zh}
          />
        </div>
      )}
    </div>
  );
}

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
                {group.hymns.map((hymn, idx) => {
                  const videoId = hymn.video ? new URL(hymn.video).searchParams.get('v') : null;
                  return (
                    <HymnItem key={idx} hymn={hymn} idx={idx} videoId={videoId} />
                  );
                })}
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
