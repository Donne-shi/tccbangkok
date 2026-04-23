import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Language } from '@/i18n/translations';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Star, CheckCircle2, Heart, Music, BookOpen, GraduationCap, Users,
  MessageSquare, Church, HandHeart, UsersRound, Megaphone, Briefcase,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Lang = Language;
const tt = (obj: Record<Lang, string>, lang: Lang) => obj[lang] || obj.en;

const T = {
  pageTitle: { en: 'Church Satisfaction Survey', zh: '教会满意度调查问卷', th: 'แบบสำรวจความพึงพอใจคริสตจักร' },
  intro: {
    en: 'Your honest feedback helps us serve God and build up the church family. This survey is fully anonymous — no identifying information is collected.',
    zh: '您的诚实反馈将帮助我们更好地服侍神，建造这个属灵大家庭。本问卷完全匿名，不收集任何身份信息。',
    th: 'ความคิดเห็นที่จริงใจของท่านจะช่วยให้เรารับใช้พระเจ้าและสร้างคริสตจักรได้ดียิ่งขึ้น แบบสำรวจนี้ไม่ระบุตัวตนโดยสิ้นเชิง',
  },
  estimateTime: { en: 'Estimated time: 8–10 minutes', zh: '预计填写时间：8–10 分钟', th: 'ใช้เวลาประมาณ 8–10 นาที' },
  ratingHint: { en: '1 = Needs improvement · 5 = Excellent · Tap a star again to clear', zh: '1 = 需要改善 · 5 = 非常好 · 再次点击可清除', th: '1 = ควรปรับปรุง · 5 = ดีมาก' },
  npsHint: { en: '0 = Not at all · 10 = Definitely', zh: '0 = 完全不会 · 10 = 一定会', th: '0 = ไม่เลย · 10 = แน่นอน' },
  optional: { en: '(Optional)', zh: '（选填）', th: '(ไม่บังคับ)' },
  submit: { en: 'Submit Survey', zh: '提交问卷', th: 'ส่งแบบสำรวจ' },
  submitting: { en: 'Submitting...', zh: '提交中...', th: 'กำลังส่ง...' },
  thankYouTitle: { en: 'Thank You!', zh: '感谢您的反馈！', th: 'ขอบคุณ!' },
  thankYouBody: {
    en: 'Your response has been recorded anonymously. May the Lord bless you abundantly.',
    zh: '您的回应已匿名记录。愿主大大祝福您！',
    th: 'คำตอบของท่านได้รับการบันทึกแบบไม่ระบุตัวตน ขอพระเจ้าทรงอวยพรท่าน',
  },
  fillAgain: { en: 'Submit Another', zh: '再填一份', th: 'ส่งอีกครั้ง' },
  successToast: { en: 'Submitted successfully', zh: '提交成功', th: 'ส่งสำเร็จ' },
  errorToast: { en: 'Submission failed, please try again', zh: '提交失败，请重试', th: 'ส่งไม่สำเร็จ' },

  // Section titles
  sBackground: { en: 'About You (Anonymous)', zh: '关于您（匿名）', th: 'เกี่ยวกับท่าน (ไม่ระบุตัวตน)' },
  sChurchOverall: { en: '1. Overall Church Impression & Belonging', zh: '一、教会整体印象与归属感', th: '1. ภาพรวมและความรู้สึกเป็นส่วนหนึ่งของคริสตจักร' },
  sFlow: { en: '2-A. Sunday Worship — Flow & Arrangement', zh: '二之一、主日崇拜 — 流程与安排', th: '2-A. การนมัสการ — ลำดับและการจัดการ' },
  sMusic: { en: '2-B. Sunday Worship — Music', zh: '二之二、主日崇拜 — 敬拜诗歌', th: '2-B. การนมัสการ — เพลงนมัสการ' },
  sSermon: { en: '2-C. Sunday Worship — Sermon', zh: '二之三、主日崇拜 — 讲道内容', th: '2-C. การนมัสการ — คำเทศนา' },
  sSS: { en: '3. Sunday School & Children/Youth Ministry', zh: '三、主日学与儿少事工', th: '3. โรงเรียนวันอาทิตย์และพันธกิจเด็ก/เยาวชน' },
  sPastoral: { en: '4-A. Pastoral Care', zh: '四之一、牧养关怀', th: '4-A. การดูแลฝ่ายจิตวิญญาณ' },
  sFellowship: { en: '4-B. Small Group & Fellowship', zh: '四之二、小组与团契', th: '4-B. กลุ่มเล็กและสามัคคีธรรม' },
  sMinistry: { en: '4-C. Ministry Participation', zh: '四之三、事工参与', th: '4-C. การมีส่วนร่วมในพันธกิจ' },
  sComm: { en: '4-D. Communication & Administration', zh: '四之四、行政沟通', th: '4-D. การสื่อสารและการบริหาร' },
  sOpen: { en: '5. Open Suggestions', zh: '五、开放式建议', th: '5. ข้อเสนอแนะเพิ่มเติม' },

  // Background labels
  attendance: { en: 'How often do you attend Sunday worship?', zh: '您参加主日崇拜的频率？', th: 'ท่านมานมัสการบ่อยเพียงใด' },
  ageGroup: { en: 'Age group', zh: '年龄段', th: 'กลุ่มอายุ' },
  memberStatus: { en: 'Your relationship with the church', zh: '您与教会的关系', th: 'ความสัมพันธ์กับคริสตจักร' },
  attendedDuration: { en: 'How long have you been attending Trinity?', zh: '您来三一教会有多久了？', th: 'ท่านมาคริสตจักรนานเพียงใด' },
  prefLang: { en: 'Preferred language at church', zh: '您在教会偏好的语言', th: 'ภาษาที่ใช้' },

  // Open ended
  mostAppreciated: { en: 'What do you appreciate most about Trinity?', zh: '您最感恩 / 最喜欢三一教会的哪部分？', th: 'สิ่งที่ท่านประทับใจมากที่สุดในคริสตจักร' },
  mostImprovement: { en: 'What would you most like to see improved?', zh: '您最希望我们改进哪一部分？', th: 'สิ่งที่อยากให้ปรับปรุงมากที่สุด' },
  topicsRequested: { en: 'What sermon topics or Bible passages would you like to hear?', zh: '您希望听到的讲道主题或圣经经文？', th: 'หัวข้อคำเทศนาที่อยากฟัง' },
  additionalComments: { en: 'Any other comments or suggestions?', zh: '其他建议或反馈？', th: 'ข้อเสนอแนะอื่น ๆ' },
};

/* ── Items ── */
type Item = { key: string; label: Record<Lang, string> };

const ITEMS_OVERALL: Item[] = [
  { key: 'overall_satisfaction', label: { en: 'Overall satisfaction with our church', zh: '对本教会的整体满意度', th: 'ความพึงพอใจโดยรวมต่อคริสตจักร' } },
  { key: 'belonging_feeling', label: { en: 'Sense of belonging to this church family', zh: '对教会大家庭的归属感', th: 'ความรู้สึกเป็นส่วนหนึ่งของครอบครัวคริสตจักร' } },
  { key: 'spiritual_growth', label: { en: 'Your spiritual growth at Trinity', zh: '在本教会的属灵成长', th: 'การเติบโตฝ่ายจิตวิญญาณ' } },
  { key: 'vision_alignment', label: { en: 'Alignment with the church vision and direction', zh: '对教会异象与方向的认同', th: 'เห็นด้วยกับวิสัยทัศน์ของคริสตจักร' } },
  { key: 'welcome_atmosphere', label: { en: 'Warmth, welcome and atmosphere', zh: '温暖、欢迎与整体氛围', th: 'บรรยากาศการต้อนรับ' } },
];

const ITEMS_FLOW: Item[] = [
  { key: 'flow_overall', label: { en: 'Overall flow of the service', zh: '整体崇拜流程顺畅度', th: 'ลำดับการนมัสการโดยรวม' } },
  { key: 'flow_duration', label: { en: 'Total length of the service', zh: '崇拜时长是否合适', th: 'ระยะเวลาการนมัสการ' } },
  { key: 'flow_transitions', label: { en: 'Smoothness between segments', zh: '环节之间的衔接', th: 'การเชื่อมต่อระหว่างส่วน' } },
  { key: 'flow_punctuality', label: { en: 'Punctuality (start/end)', zh: '准时开始与结束', th: 'การเริ่มและสิ้นสุดตรงเวลา' } },
  { key: 'flow_announcements', label: { en: 'Clarity of announcements', zh: '报告/通知的清晰度', th: 'ความชัดเจนของประกาศ' } },
  { key: 'flow_welcome', label: { en: 'Welcome & hospitality for newcomers', zh: '招待与迎新', th: 'การต้อนรับผู้มาใหม่' } },
  { key: 'flow_environment', label: { en: 'Venue, seating & cleanliness', zh: '场地环境、座位、卫生', th: 'สถานที่ ที่นั่ง ความสะอาด' } },
  { key: 'flow_av', label: { en: 'Sound, projection & livestream quality', zh: '音响、投影、直播质量', th: 'ระบบเสียง ภาพฉาย ถ่ายทอดสด' } },
];

const ITEMS_MUSIC: Item[] = [
  { key: 'music_song_selection', label: { en: 'Song selection', zh: '选曲是否合宜', th: 'การเลือกเพลง' } },
  { key: 'music_theological_depth', label: { en: 'Theological depth of lyrics', zh: '歌词的神学深度', th: 'ความลึกซึ้งของเนื้อเพลง' } },
  { key: 'music_singability', label: { en: 'Easy for the congregation to sing', zh: '会众易于跟唱', th: 'ร้องตามได้ง่าย' } },
  { key: 'music_volume', label: { en: 'Volume balance', zh: '音量大小适中', th: 'ระดับเสียงที่เหมาะสม' } },
  { key: 'music_leader', label: { en: 'Worship leader guidance', zh: '敬拜带领的引导', th: 'การนำของผู้นำนมัสการ' } },
  { key: 'music_lyrics_display', label: { en: 'Lyrics projection clarity', zh: '歌词投影清晰度', th: 'ความชัดเจนของเนื้อเพลงบนจอ' } },
  { key: 'music_spiritual_atmosphere', label: { en: 'Spiritual atmosphere', zh: '属灵氛围', th: 'บรรยากาศฝ่ายจิตวิญญาณ' } },
  { key: 'music_song_balance', label: { en: 'Balance of hymns and modern songs', zh: '传统圣诗与现代敬拜歌的平衡', th: 'ความสมดุลระหว่างเพลงเก่าและใหม่' } },
];

const ITEMS_SERMON: Item[] = [
  { key: 'sermon_clarity', label: { en: 'Clarity of message', zh: '信息表达清晰度', th: 'ความชัดเจนของข่าวสาร' } },
  { key: 'sermon_biblical', label: { en: 'Faithfulness to Scripture', zh: '是否忠于圣经', th: 'ซื่อสัตย์ต่อพระคัมภีร์' } },
  { key: 'sermon_application', label: { en: 'Practical application to life', zh: '生活应用与启发', th: 'การประยุกต์ใช้ในชีวิต' } },
  { key: 'sermon_depth', label: { en: 'Spiritual / theological depth', zh: '属灵与神学深度', th: 'ความลึกซึ้งทางเทววิทยา' } },
  { key: 'sermon_delivery', label: { en: 'Delivery & engagement', zh: '讲员表达与感染力', th: 'การเทศนาและการสื่อสาร' } },
  { key: 'sermon_length', label: { en: 'Sermon length is appropriate', zh: '讲道长度合适', th: 'ความยาวของคำเทศนา' } },
  { key: 'sermon_spiritual_growth', label: { en: 'Helps your spiritual growth', zh: '对个人灵命的帮助', th: 'ช่วยให้เติบโตฝ่ายจิตวิญญาณ' } },
];

const ITEMS_SS: Item[] = [
  { key: 'ss_adult_quality', label: { en: 'Adult Sunday School quality', zh: '成人主日学质量', th: 'คุณภาพชั้นเรียนผู้ใหญ่' } },
  { key: 'ss_children_program', label: { en: "Children's ministry program", zh: '儿童事工内容', th: 'พันธกิจเด็ก' } },
  { key: 'ss_youth_program', label: { en: 'Youth ministry program', zh: '青少年事工内容', th: 'พันธกิจเยาวชน' } },
  { key: 'ss_teacher_quality', label: { en: 'Teachers / leaders quality', zh: '教师 / 带领同工水平', th: 'คุณภาพของครูและผู้นำ' } },
  { key: 'ss_curriculum', label: { en: 'Curriculum & teaching content', zh: '课程内容与教材', th: 'หลักสูตรและเนื้อหา' } },
  { key: 'ss_safety', label: { en: 'Children safety & care', zh: '儿童安全与照顾', th: 'ความปลอดภัยและการดูแลเด็ก' } },
];

const ITEMS_PASTORAL: Item[] = [
  { key: 'pastoral_care', label: { en: 'Pastoral care you receive', zh: '所感受到的牧养与关怀', th: 'การดูแลจากผู้รับใช้' } },
  { key: 'pastoral_availability', label: { en: 'Accessibility of pastors / leaders', zh: '牧者/同工的可接触度', th: 'การเข้าถึงผู้รับใช้' } },
  { key: 'pastoral_visitation', label: { en: 'Visitation and personal care', zh: '探访与个人关怀', th: 'การเยี่ยมเยียนและการดูแล' } },
  { key: 'pastoral_counseling', label: { en: 'Spiritual counseling support', zh: '属灵辅导与支持', th: 'การให้คำปรึกษาฝ่ายจิตวิญญาณ' } },
];

const ITEMS_FELLOWSHIP: Item[] = [
  { key: 'smallgroup_quality', label: { en: 'Small group quality (if you attend)', zh: '小组品质（如有参与）', th: 'คุณภาพของกลุ่มเล็ก' } },
  { key: 'smallgroup_belonging', label: { en: 'Sense of belonging in your small group', zh: '在小组中的归属感', th: 'ความรู้สึกเป็นส่วนหนึ่งในกลุ่ม' } },
  { key: 'fellowship_feeling', label: { en: 'Fellowship among brothers and sisters', zh: '弟兄姊妹之间的相交', th: 'สามัคคีธรรมระหว่างพี่น้อง' } },
];

const ITEMS_MINISTRY: Item[] = [
  { key: 'ministry_opportunity', label: { en: 'Clarity of service opportunities', zh: '服事机会的清晰度', th: 'ความชัดเจนของโอกาสรับใช้' } },
  { key: 'ministry_training', label: { en: 'Training and equipping for serving', zh: '事工培训与装备', th: 'การฝึกอบรมและการจัดเตรียม' } },
  { key: 'ministry_support', label: { en: 'Support and encouragement when serving', zh: '服事过程中获得的支持', th: 'การสนับสนุนเมื่อรับใช้' } },
];

const ITEMS_COMM: Item[] = [
  { key: 'comm_announcements', label: { en: 'Timeliness and clarity of announcements', zh: '通知的及时与清楚', th: 'ความทันเวลาของประกาศ' } },
  { key: 'comm_website', label: { en: 'Church website information', zh: '教会网站信息', th: 'ข้อมูลในเว็บไซต์' } },
  { key: 'comm_social_media', label: { en: 'Social media / group chats', zh: '社交媒体 / 群组沟通', th: 'โซเชียลมีเดียและกลุ่มแชต' } },
  { key: 'comm_transparency', label: { en: 'Financial & decision-making transparency', zh: '财务与决策的透明度', th: 'ความโปร่งใสด้านการเงินและการตัดสินใจ' } },
];

const ATTENDANCE_OPTIONS: Record<string, Record<Lang, string>> = {
  weekly: { en: 'Every Sunday', zh: '每周', th: 'ทุกอาทิตย์' },
  often: { en: '2–3 times a month', zh: '每月 2–3 次', th: '2–3 ครั้ง/เดือน' },
  sometimes: { en: 'Occasionally', zh: '偶尔', th: 'บางครั้ง' },
  rarely: { en: 'Rarely', zh: '很少', th: 'น้อยมาก' },
  first_time: { en: 'First time', zh: '第一次', th: 'ครั้งแรก' },
};
const AGE_OPTIONS: Record<string, Record<Lang, string>> = {
  under_18: { en: 'Under 18', zh: '18 岁以下', th: 'ต่ำกว่า 18' },
  '18_29': { en: '18–29', zh: '18–29 岁', th: '18–29' },
  '30_44': { en: '30–44', zh: '30–44 岁', th: '30–44' },
  '45_59': { en: '45–59', zh: '45–59 岁', th: '45–59' },
  '60_plus': { en: '60+', zh: '60 岁以上', th: '60 ขึ้นไป' },
};
const MEMBER_OPTIONS: Record<string, Record<Lang, string>> = {
  member: { en: 'Church Member', zh: '正式会友', th: 'สมาชิก' },
  regular: { en: 'Regular Attendee', zh: '常来聚会者', th: 'มาประจำ' },
  newcomer: { en: 'Newcomer', zh: '新朋友', th: 'ผู้มาใหม่' },
  visitor: { en: 'Visitor', zh: '访客', th: 'ผู้มาเยือน' },
};
const DURATION_OPTIONS: Record<string, Record<Lang, string>> = {
  lt_3m: { en: 'Less than 3 months', zh: '少于 3 个月', th: 'น้อยกว่า 3 เดือน' },
  '3m_1y': { en: '3 months – 1 year', zh: '3 个月 – 1 年', th: '3 เดือน – 1 ปี' },
  '1_3y': { en: '1 – 3 years', zh: '1 – 3 年', th: '1 – 3 ปี' },
  '3_10y': { en: '3 – 10 years', zh: '3 – 10 年', th: '3 – 10 ปี' },
  gt_10y: { en: 'More than 10 years', zh: '10 年以上', th: 'มากกว่า 10 ปี' },
};
const LANG_OPTIONS: Record<string, Record<Lang, string>> = {
  zh: { en: 'Chinese', zh: '中文', th: 'จีน' },
  en: { en: 'English', zh: '英文', th: 'อังกฤษ' },
  th: { en: 'Thai', zh: '泰文', th: 'ไทย' },
};
const SG_OPTIONS: Record<string, Record<Lang, string>> = {
  active: { en: 'Active in a small group', zh: '有固定参与小组', th: 'ร่วมกลุ่มเล็กประจำ' },
  occasional: { en: 'Occasionally', zh: '偶尔参与', th: 'ร่วมเป็นครั้งคราว' },
  none: { en: 'Not currently in a small group', zh: '目前未参与小组', th: 'ยังไม่ได้ร่วมกลุ่ม' },
};

/* ── Star rating ── */
function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === value ? 0 : n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-1 transition-transform hover:scale-110"
          aria-label={`${n} star`}
        >
          <Star className={`h-6 w-6 transition-colors ${n <= (hover || value) ? 'fill-gold text-gold' : 'text-muted-foreground/40'}`} />
        </button>
      ))}
      {value > 0 && <span className="ml-2 text-sm text-muted-foreground">{value}/5</span>}
    </div>
  );
}

function NpsScale({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: 11 }).map((_, n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === value ? -1 : n)}
          className={`w-9 h-9 rounded-md border text-sm font-medium transition-all ${
            value === n ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:border-primary hover:text-primary'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function RatingRow({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-border/50 last:border-0">
      <Label className="text-sm leading-relaxed flex-1 pr-4">{label}</Label>
      <StarRating value={value} onChange={onChange} />
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }: { icon: typeof Star; title: string; children: React.ReactNode }) {
  return (
    <Card className="border-gold/20">
      <CardHeader className="pb-3 bg-gold/5">
        <CardTitle className="flex items-center gap-2 text-lg font-heading text-ink">
          <Icon className="h-5 w-5 text-gold" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
}

function RadioField({ label, value, onChange, options, lang, cols = 'grid-cols-2 sm:grid-cols-3' }: {
  label: string; value: string; onChange: (v: string) => void;
  options: Record<string, Record<Lang, string>>; lang: Lang; cols?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className={`grid ${cols} gap-2`}>
        {Object.entries(options).map(([k, v]) => (
          <Label key={k} className="flex items-center gap-2 cursor-pointer p-2 rounded border border-border/50 hover:border-gold/40">
            <RadioGroupItem value={k} />
            <span className="text-sm">{tt(v, lang)}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}

export default function SurveyPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Background
  const [attendanceFrequency, setAttendanceFrequency] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [memberStatus, setMemberStatus] = useState('');
  const [attendedDuration, setAttendedDuration] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [smallgroupParticipation, setSmallgroupParticipation] = useState('');

  // Ratings
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const setRating = (k: string, n: number) => setRatings((p) => ({ ...p, [k]: n }));

  // NPS + textareas
  const [recommendScore, setRecommendScore] = useState(-1);
  const [churchImpressionComments, setChurchImpressionComments] = useState('');
  const [flowComments, setFlowComments] = useState('');
  const [musicComments, setMusicComments] = useState('');
  const [sermonComments, setSermonComments] = useState('');
  const [ssComments, setSsComments] = useState('');
  const [pastoralComments, setPastoralComments] = useState('');
  const [fellowshipComments, setFellowshipComments] = useState('');
  const [ministryComments, setMinistryComments] = useState('');
  const [commComments, setCommComments] = useState('');
  const [mostAppreciated, setMostAppreciated] = useState('');
  const [mostImprovement, setMostImprovement] = useState('');
  const [topicsRequested, setTopicsRequested] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');

  const reset = () => {
    setAttendanceFrequency(''); setAgeGroup(''); setMemberStatus(''); setAttendedDuration('');
    setPreferredLanguage(''); setSmallgroupParticipation(''); setRatings({}); setRecommendScore(-1);
    setChurchImpressionComments(''); setFlowComments(''); setMusicComments(''); setSermonComments('');
    setSsComments(''); setPastoralComments(''); setFellowshipComments(''); setMinistryComments('');
    setCommComments(''); setMostAppreciated(''); setMostImprovement(''); setTopicsRequested('');
    setAdditionalComments(''); setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        attendance_frequency: attendanceFrequency || null,
        age_group: ageGroup || null,
        member_status: memberStatus || null,
        attended_duration: attendedDuration || null,
        preferred_language: preferredLanguage || null,
        smallgroup_participation: smallgroupParticipation || null,
        recommend_score: recommendScore >= 0 ? recommendScore : null,
        church_impression_comments: churchImpressionComments.trim() || null,
        flow_comments: flowComments.trim() || null,
        music_comments: musicComments.trim() || null,
        sermon_comments: sermonComments.trim() || null,
        ss_comments: ssComments.trim() || null,
        pastoral_comments: pastoralComments.trim() || null,
        fellowship_comments: fellowshipComments.trim() || null,
        ministry_comments: ministryComments.trim() || null,
        comm_comments: commComments.trim() || null,
        most_appreciated: mostAppreciated.trim() || null,
        most_improvement: mostImprovement.trim() || null,
        topics_requested: topicsRequested.trim() || null,
        additional_comments: additionalComments.trim() || null,
        language_used: language,
      };
      Object.entries(ratings).forEach(([k, v]) => { if (v > 0) payload[k] = v; });
      const { error } = await supabase.from('church_survey_responses').insert(payload as never);
      if (error) throw error;
      toast({ title: tt(T.successToast, language) });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      toast({ title: tt(T.errorToast, language), variant: 'destructive' });
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 max-w-2xl">
          <Card className="border-gold/30 text-center">
            <CardContent className="py-16">
              <CheckCircle2 className="h-16 w-16 mx-auto text-gold mb-4" />
              <h2 className="text-2xl font-heading font-semibold mb-3 text-ink">{tt(T.thankYouTitle, language)}</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">{tt(T.thankYouBody, language)}</p>
              <Button onClick={reset} variant="outline">{tt(T.fillAgain, language)}</Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const renderSection = (
    icon: typeof Star,
    title: string,
    items: Item[],
    commentValue: string,
    setCommentValue: (v: string) => void,
    commentPlaceholderKey: keyof typeof T | null = null,
  ) => (
    <SectionCard icon={icon} title={title}>
      {items.map((item) => (
        <RatingRow key={item.key} label={tt(item.label, language)} value={ratings[item.key] || 0} onChange={(n) => setRating(item.key, n)} />
      ))}
      <Textarea
        className="mt-4"
        placeholder={`${tt({ en: 'Comments and suggestions', zh: '建议与意见', th: 'ความคิดเห็นและข้อเสนอแนะ' }, language)} ${tt(T.optional, language)}`}
        value={commentValue}
        onChange={(e) => setCommentValue(e.target.value)}
        maxLength={1500}
        rows={3}
      />
    </SectionCard>
  );

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-3">{tt(T.pageTitle, language)}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">{tt(T.intro, language)}</p>
          <p className="text-xs text-gold mt-3 font-medium tracking-wide uppercase">{tt(T.estimateTime, language)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Background */}
          <SectionCard icon={Users} title={tt(T.sBackground, language)}>
            <div className="space-y-5">
              <RadioField label={tt(T.attendance, language)} value={attendanceFrequency} onChange={setAttendanceFrequency} options={ATTENDANCE_OPTIONS} lang={language} cols="grid-cols-2 sm:grid-cols-3" />
              <RadioField label={tt(T.ageGroup, language)} value={ageGroup} onChange={setAgeGroup} options={AGE_OPTIONS} lang={language} cols="grid-cols-2 sm:grid-cols-5" />
              <RadioField label={tt(T.memberStatus, language)} value={memberStatus} onChange={setMemberStatus} options={MEMBER_OPTIONS} lang={language} cols="grid-cols-2 sm:grid-cols-4" />
              <RadioField label={tt(T.attendedDuration, language)} value={attendedDuration} onChange={setAttendedDuration} options={DURATION_OPTIONS} lang={language} cols="grid-cols-2 sm:grid-cols-3" />
              <RadioField label={tt(T.prefLang, language)} value={preferredLanguage} onChange={setPreferredLanguage} options={LANG_OPTIONS} lang={language} cols="grid-cols-3" />
            </div>
          </SectionCard>

          <p className="text-xs text-center text-muted-foreground italic">{tt(T.ratingHint, language)}</p>

          {/* 1. Church overall */}
          <SectionCard icon={Church} title={tt(T.sChurchOverall, language)}>
            {ITEMS_OVERALL.map((item) => (
              <RatingRow key={item.key} label={tt(item.label, language)} value={ratings[item.key] || 0} onChange={(n) => setRating(item.key, n)} />
            ))}
            <div className="pt-4 mt-2 border-t border-border/50">
              <Label className="text-sm font-medium mb-2 block">
                {tt({ en: 'How likely are you to recommend our church to a friend?', zh: '您有多大可能会向朋友推荐我们教会？', th: 'ท่านจะแนะนำคริสตจักรเราให้เพื่อนมากเพียงใด' }, language)}
              </Label>
              <p className="text-xs text-muted-foreground mb-2">{tt(T.npsHint, language)}</p>
              <NpsScale value={recommendScore} onChange={setRecommendScore} />
            </div>
            <Textarea
              className="mt-4"
              placeholder={`${tt({ en: 'Comments on overall church impression', zh: '关于教会整体印象的建议', th: 'ความคิดเห็นเกี่ยวกับคริสตจักรโดยรวม' }, language)} ${tt(T.optional, language)}`}
              value={churchImpressionComments} onChange={(e) => setChurchImpressionComments(e.target.value)} maxLength={1500} rows={3}
            />
          </SectionCard>

          {/* 2. Worship */}
          {renderSection(Heart, tt(T.sFlow, language), ITEMS_FLOW, flowComments, setFlowComments)}
          {renderSection(Music, tt(T.sMusic, language), ITEMS_MUSIC, musicComments, setMusicComments)}
          {renderSection(BookOpen, tt(T.sSermon, language), ITEMS_SERMON, sermonComments, setSermonComments)}

          {/* 3. Sunday School */}
          {renderSection(GraduationCap, tt(T.sSS, language), ITEMS_SS, ssComments, setSsComments)}

          {/* 4-A Pastoral */}
          {renderSection(HandHeart, tt(T.sPastoral, language), ITEMS_PASTORAL, pastoralComments, setPastoralComments)}

          {/* 4-B Fellowship - has extra radio */}
          <SectionCard icon={UsersRound} title={tt(T.sFellowship, language)}>
            <div className="mb-2">
              <RadioField
                label={tt({ en: 'Are you currently in a small group?', zh: '您目前是否参与小组？', th: 'ท่านอยู่ในกลุ่มเล็กหรือไม่' }, language)}
                value={smallgroupParticipation} onChange={setSmallgroupParticipation} options={SG_OPTIONS} lang={language} cols="grid-cols-1 sm:grid-cols-3"
              />
            </div>
            {ITEMS_FELLOWSHIP.map((item) => (
              <RatingRow key={item.key} label={tt(item.label, language)} value={ratings[item.key] || 0} onChange={(n) => setRating(item.key, n)} />
            ))}
            <Textarea
              className="mt-4"
              placeholder={`${tt({ en: 'Comments on fellowship and small groups', zh: '关于小组与团契的建议', th: 'ความคิดเห็นเรื่องกลุ่มเล็กและสามัคคีธรรม' }, language)} ${tt(T.optional, language)}`}
              value={fellowshipComments} onChange={(e) => setFellowshipComments(e.target.value)} maxLength={1500} rows={3}
            />
          </SectionCard>

          {/* 4-C Ministry */}
          {renderSection(Briefcase, tt(T.sMinistry, language), ITEMS_MINISTRY, ministryComments, setMinistryComments)}

          {/* 4-D Communication */}
          {renderSection(Megaphone, tt(T.sComm, language), ITEMS_COMM, commComments, setCommComments)}

          {/* 5. Open ended */}
          <SectionCard icon={MessageSquare} title={tt(T.sOpen, language)}>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-1.5 block">{tt(T.mostAppreciated, language)}</Label>
                <Textarea value={mostAppreciated} onChange={(e) => setMostAppreciated(e.target.value)} maxLength={1500} rows={3} />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">{tt(T.mostImprovement, language)}</Label>
                <Textarea value={mostImprovement} onChange={(e) => setMostImprovement(e.target.value)} maxLength={1500} rows={3} />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">{tt(T.topicsRequested, language)}</Label>
                <Textarea value={topicsRequested} onChange={(e) => setTopicsRequested(e.target.value)} maxLength={1000} rows={2} />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">{tt(T.additionalComments, language)}</Label>
                <Textarea value={additionalComments} onChange={(e) => setAdditionalComments(e.target.value)} maxLength={1500} rows={3} />
              </div>
            </div>
          </SectionCard>

          <div className="flex justify-center pt-4">
            <Button type="submit" size="lg" disabled={submitting} className="min-w-[200px]">
              {submitting ? tt(T.submitting, language) : tt(T.submit, language)}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
