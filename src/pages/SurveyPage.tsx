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
import { Star, CheckCircle2, Heart, Music, BookOpen, GraduationCap, Users, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Lang = Language;

const tt = (obj: Record<Lang, string>, lang: Lang) => obj[lang] || obj.en;

const T = {
  pageTitle: { en: 'Sunday Worship Satisfaction Survey', zh: '主日崇拜满意度问卷', th: 'แบบสำรวจความพึงพอใจการนมัสการวันอาทิตย์' },
  intro: {
    en: 'Your honest feedback helps us serve God and the church family better. This survey is fully anonymous — no identifying information is collected.',
    zh: '您的诚实反馈将帮助我们更好地服侍神和这个属灵大家庭。本问卷完全匿名，不收集任何身份信息。',
    th: 'ความคิดเห็นที่จริงใจของคุณจะช่วยให้เรารับใช้พระเจ้าและครอบครัวคริสตจักรได้ดียิ่งขึ้น แบบสำรวจนี้ไม่ระบุตัวตนโดยสิ้นเชิง',
  },
  estimateTime: { en: 'Estimated time: 5–8 minutes', zh: '预计填写时间：5–8 分钟', th: 'ใช้เวลาประมาณ 5–8 นาที' },
  required: { en: 'Required', zh: '必填', th: 'จำเป็น' },
  optional: { en: 'Optional', zh: '选填', th: 'ไม่บังคับ' },

  // Background
  backgroundTitle: { en: 'About You (Anonymous)', zh: '关于您（匿名）', th: 'เกี่ยวกับคุณ (ไม่ระบุตัวตน)' },
  attendance: { en: 'How often do you attend Sunday worship?', zh: '您参加主日崇拜的频率？', th: 'คุณมานมัสการวันอาทิตย์บ่อยเพียงใด' },
  ageGroup: { en: 'Age group', zh: '年龄段', th: 'กลุ่มอายุ' },
  memberStatus: { en: 'Your relationship with the church', zh: '您与教会的关系', th: 'ความสัมพันธ์กับคริสตจักร' },
  prefLang: { en: 'Preferred language at church', zh: '您在教会偏好的语言', th: 'ภาษาที่คุณใช้ในคริสตจักร' },

  // Sections
  s1Title: { en: '1. Worship Service Flow & Arrangement', zh: '一、崇拜流程与安排', th: '1. ลำดับและการจัดการนมัสการ' },
  s2Title: { en: '2. Worship Music', zh: '二、敬拜诗歌与音乐', th: '2. เพลงนมัสการและดนตรี' },
  s3Title: { en: '3. Sermon', zh: '三、讲道内容', th: '3. คำเทศนา' },
  s4Title: { en: '4. Sunday School & Children/Youth Ministry', zh: '四、主日学与儿少事工', th: '4. โรงเรียนวันอาทิตย์และพันธกิจเด็ก/เยาวชน' },
  s5Title: { en: '5. Overall Experience & Community', zh: '五、整体感受与团契', th: '5. ความรู้สึกโดยรวมและสามัคคีธรรม' },
  s6Title: { en: '6. Open Suggestions', zh: '六、开放式建议', th: '6. ข้อเสนอแนะเพิ่มเติม' },

  ratingHint: { en: '1 = Needs improvement · 5 = Excellent', zh: '1 = 需要改善 · 5 = 非常好', th: '1 = ควรปรับปรุง · 5 = ดีมาก' },
  npsHint: { en: '0 = Not at all · 10 = Definitely', zh: '0 = 完全不会 · 10 = 一定会', th: '0 = ไม่เลย · 10 = แน่นอน' },

  submit: { en: 'Submit Survey', zh: '提交问卷', th: 'ส่งแบบสำรวจ' },
  submitting: { en: 'Submitting...', zh: '提交中...', th: 'กำลังส่ง...' },
  thankYouTitle: { en: 'Thank You!', zh: '感谢您的反馈！', th: 'ขอบคุณ!' },
  thankYouBody: {
    en: 'Your response has been recorded anonymously. May the Lord bless you abundantly.',
    zh: '您的回应已匿名记录。愿主大大祝福您！',
    th: 'คำตอบของคุณได้รับการบันทึกแบบไม่ระบุตัวตน ขอพระเจ้าทรงอวยพรท่าน',
  },
  fillAgain: { en: 'Submit Another', zh: '再填一份', th: 'ส่งอีกครั้ง' },
  successToast: { en: 'Submitted successfully', zh: '提交成功', th: 'ส่งสำเร็จ' },
  errorToast: { en: 'Submission failed, please try again', zh: '提交失败，请重试', th: 'ส่งไม่สำเร็จ' },

  // Open ended
  mostAppreciated: { en: 'What did you appreciate most about Sunday worship?', zh: '您最感恩 / 最喜欢主日崇拜的哪部分？', th: 'สิ่งใดที่คุณชื่นชอบมากที่สุดในการนมัสการ' },
  mostImprovement: { en: 'What would you most like to see improved?', zh: '您最希望我们改进哪一部分？', th: 'สิ่งใดที่คุณอยากให้ปรับปรุงมากที่สุด' },
  topicsRequested: { en: 'What sermon topics or Bible passages would you like to hear?', zh: '您希望听到的讲道主题或圣经经文？', th: 'หัวข้อคำเทศนาหรือพระคัมภีร์ที่อยากฟัง' },
  
  additionalComments: { en: 'Any other comments or suggestions?', zh: '其他建议或反馈？', th: 'ข้อเสนอแนะอื่น ๆ' },
};

// 1-5 rating items
const SECTION1_ITEMS: { key: string; label: Record<Lang, string> }[] = [
  { key: 'flow_overall', label: { en: 'Overall flow of the service', zh: '整体崇拜流程顺畅度', th: 'ลำดับการนมัสการโดยรวม' } },
  { key: 'flow_duration', label: { en: 'Total length of the service', zh: '崇拜时长是否合适', th: 'ระยะเวลาการนมัสการ' } },
  { key: 'flow_transitions', label: { en: 'Smoothness between segments', zh: '环节之间的衔接', th: 'การเชื่อมต่อระหว่างส่วน' } },
  { key: 'flow_punctuality', label: { en: 'Punctuality (start/end)', zh: '准时开始与结束', th: 'การเริ่มและสิ้นสุดตรงเวลา' } },
  { key: 'flow_announcements', label: { en: 'Clarity of announcements', zh: '报告/通知的清晰度', th: 'ความชัดเจนของประกาศ' } },
  { key: 'flow_welcome', label: { en: 'Welcome & hospitality for newcomers', zh: '招待与迎新', th: 'การต้อนรับผู้มาใหม่' } },
  { key: 'flow_environment', label: { en: 'Venue, seating & cleanliness', zh: '场地环境、座位、卫生', th: 'สถานที่ ที่นั่ง ความสะอาด' } },
  { key: 'flow_av', label: { en: 'Sound, projection & livestream quality', zh: '音响、投影、直播质量', th: 'ระบบเสียง ภาพฉาย ถ่ายทอดสด' } },
];

const SECTION2_ITEMS: { key: string; label: Record<Lang, string> }[] = [
  { key: 'music_song_selection', label: { en: 'Song selection', zh: '选曲是否合宜', th: 'การเลือกเพลง' } },
  { key: 'music_theological_depth', label: { en: 'Theological depth of lyrics', zh: '歌词的神学深度', th: 'ความลึกซึ้งทางเทววิทยาของเนื้อเพลง' } },
  { key: 'music_singability', label: { en: 'Easy for the congregation to sing', zh: '会众易于跟唱', th: 'ร้องตามได้ง่าย' } },
  { key: 'music_volume', label: { en: 'Volume balance', zh: '音量大小适中', th: 'ระดับเสียงที่เหมาะสม' } },
  { key: 'music_leader', label: { en: 'Worship leader guidance', zh: '敬拜带领的引导', th: 'การนำของผู้นำนมัสการ' } },
  { key: 'music_lyrics_display', label: { en: 'Lyrics projection clarity', zh: '歌词投影清晰度', th: 'ความชัดเจนของเนื้อเพลงบนจอ' } },
  { key: 'music_spiritual_atmosphere', label: { en: 'Spiritual atmosphere', zh: '属灵氛围', th: 'บรรยากาศฝ่ายจิตวิญญาณ' } },
  { key: 'music_song_balance', label: { en: 'Balance of hymns and modern songs', zh: '传统圣诗与现代敬拜歌的平衡', th: 'ความสมดุลระหว่างเพลงเก่าและใหม่' } },
];

const SECTION3_ITEMS: { key: string; label: Record<Lang, string> }[] = [
  { key: 'sermon_clarity', label: { en: 'Clarity of message', zh: '信息表达清晰度', th: 'ความชัดเจนของข่าวสาร' } },
  { key: 'sermon_biblical', label: { en: 'Faithfulness to Scripture', zh: '是否忠于圣经', th: 'ซื่อสัตย์ต่อพระคัมภีร์' } },
  { key: 'sermon_application', label: { en: 'Practical application to life', zh: '生活应用与启发', th: 'การประยุกต์ใช้ในชีวิต' } },
  { key: 'sermon_depth', label: { en: 'Spiritual / theological depth', zh: '属灵与神学深度', th: 'ความลึกซึ้งทางเทววิทยา' } },
  { key: 'sermon_delivery', label: { en: 'Delivery & engagement', zh: '讲员表达与感染力', th: 'การเทศนาและการสื่อสาร' } },
  { key: 'sermon_length', label: { en: 'Sermon length is appropriate', zh: '讲道长度合适', th: 'ความยาวของคำเทศนา' } },
  { key: 'sermon_spiritual_growth', label: { en: 'Helps your spiritual growth', zh: '对个人灵命的帮助', th: 'ช่วยให้เติบโตฝ่ายจิตวิญญาณ' } },
];

const SECTION4_ITEMS: { key: string; label: Record<Lang, string> }[] = [
  { key: 'ss_adult_quality', label: { en: 'Adult Sunday School quality', zh: '成人主日学质量', th: 'คุณภาพชั้นเรียนผู้ใหญ่' } },
  { key: 'ss_children_program', label: { en: "Children's ministry program", zh: '儿童事工内容', th: 'พันธกิจเด็ก' } },
  { key: 'ss_youth_program', label: { en: 'Youth ministry program', zh: '青少年事工内容', th: 'พันธกิจเยาวชน' } },
  { key: 'ss_teacher_quality', label: { en: 'Teachers / leaders quality', zh: '教师 / 带领同工水平', th: 'คุณภาพของครูและผู้นำ' } },
  { key: 'ss_curriculum', label: { en: 'Curriculum & teaching content', zh: '课程内容与教材', th: 'หลักสูตรและเนื้อหา' } },
  { key: 'ss_safety', label: { en: 'Children safety & care', zh: '儿童安全与照顾', th: 'ความปลอดภัยและการดูแลเด็ก' } },
];

const SECTION5_ITEMS: { key: string; label: Record<Lang, string> }[] = [
  { key: 'overall_satisfaction', label: { en: 'Overall satisfaction with Sunday worship', zh: '对主日崇拜的整体满意度', th: 'ความพึงพอใจโดยรวม' } },
  { key: 'fellowship_feeling', label: { en: 'Sense of fellowship and belonging', zh: '团契归属感', th: 'ความรู้สึกเป็นส่วนหนึ่งของชุมชน' } },
  { key: 'pastoral_care', label: { en: 'Pastoral care you receive', zh: '所感受到的牧养与关怀', th: 'การดูแลจากผู้รับใช้' } },
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

const LANG_OPTIONS: Record<string, Record<Lang, string>> = {
  zh: { en: 'Chinese', zh: '中文', th: 'จีน' },
  en: { en: 'English', zh: '英文', th: 'อังกฤษ' },
  th: { en: 'Thai', zh: '泰文', th: 'ไทย' },
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
          <Star
            className={`h-6 w-6 transition-colors ${
              n <= (hover || value) ? 'fill-gold text-gold' : 'text-muted-foreground/40'
            }`}
          />
        </button>
      ))}
      {value > 0 && <span className="ml-2 text-sm text-muted-foreground">{value}/5</span>}
    </div>
  );
}

/* ── NPS scale 0-10 ── */
function NpsScale({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: 11 }).map((_, n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === value ? -1 : n)}
          className={`w-9 h-9 rounded-md border text-sm font-medium transition-all ${
            value === n
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-input hover:border-primary hover:text-primary'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

/* ── Rating row ── */
function RatingRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-border/50 last:border-0">
      <Label className="text-sm leading-relaxed flex-1 pr-4">{label}</Label>
      <StarRating value={value} onChange={onChange} />
    </div>
  );
}

/* ── Section card ── */
function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Star;
  title: string;
  children: React.ReactNode;
}) {
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

export default function SurveyPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Background
  const [attendanceFrequency, setAttendanceFrequency] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [memberStatus, setMemberStatus] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');

  // Ratings (numeric)
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const setRating = (k: string, n: number) => setRatings((p) => ({ ...p, [k]: n }));

  // Section comments
  const [flowComments, setFlowComments] = useState('');
  const [musicComments, setMusicComments] = useState('');
  const [sermonComments, setSermonComments] = useState('');
  const [ssComments, setSsComments] = useState('');

  // NPS
  const [recommendScore, setRecommendScore] = useState(-1);

  // Open ended
  const [mostAppreciated, setMostAppreciated] = useState('');
  const [mostImprovement, setMostImprovement] = useState('');
  const [topicsRequested, setTopicsRequested] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');

  const reset = () => {
    setAttendanceFrequency('');
    setAgeGroup('');
    setMemberStatus('');
    setPreferredLanguage('');
    setRatings({});
    setFlowComments('');
    setMusicComments('');
    setSermonComments('');
    setSsComments('');
    setRecommendScore(-1);
    setMostAppreciated('');
    setMostImprovement('');
    setTopicsRequested('');
    setAdditionalComments('');
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        attendance_frequency: attendanceFrequency || null,
        age_group: ageGroup || null,
        member_status: memberStatus || null,
        preferred_language: preferredLanguage || null,
        flow_comments: flowComments.trim() || null,
        music_comments: musicComments.trim() || null,
        sermon_comments: sermonComments.trim() || null,
        ss_comments: ssComments.trim() || null,
        recommend_score: recommendScore >= 0 ? recommendScore : null,
        most_appreciated: mostAppreciated.trim() || null,
        most_improvement: mostImprovement.trim() || null,
        topics_requested: topicsRequested.trim() || null,
        additional_comments: additionalComments.trim() || null,
        language_used: language,
      };
      Object.entries(ratings).forEach(([k, v]) => {
        if (v > 0) payload[k] = v;
      });
      const { error } = await supabase.from('worship_survey_responses').insert(payload as never);
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
              <h2 className="text-2xl font-heading font-semibold mb-3 text-ink">
                {tt(T.thankYouTitle, language)}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">{tt(T.thankYouBody, language)}</p>
              <Button onClick={reset} variant="outline">
                {tt(T.fillAgain, language)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-3">
            {tt(T.pageTitle, language)}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">{tt(T.intro, language)}</p>
          <p className="text-xs text-gold mt-3 font-medium tracking-wide uppercase">
            {tt(T.estimateTime, language)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Background */}
          <SectionCard icon={Users} title={tt(T.backgroundTitle, language)}>
            <div className="space-y-5">
              <div>
                <Label className="text-sm font-medium mb-2 block">{tt(T.attendance, language)}</Label>
                <RadioGroup value={attendanceFrequency} onValueChange={setAttendanceFrequency} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(ATTENDANCE_OPTIONS).map(([k, v]) => (
                    <Label key={k} className="flex items-center gap-2 cursor-pointer p-2 rounded border border-border/50 hover:border-gold/40">
                      <RadioGroupItem value={k} />
                      <span className="text-sm">{tt(v, language)}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">{tt(T.ageGroup, language)}</Label>
                <RadioGroup value={ageGroup} onValueChange={setAgeGroup} className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.entries(AGE_OPTIONS).map(([k, v]) => (
                    <Label key={k} className="flex items-center gap-2 cursor-pointer p-2 rounded border border-border/50 hover:border-gold/40">
                      <RadioGroupItem value={k} />
                      <span className="text-sm">{tt(v, language)}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">{tt(T.memberStatus, language)}</Label>
                <RadioGroup value={memberStatus} onValueChange={setMemberStatus} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(MEMBER_OPTIONS).map(([k, v]) => (
                    <Label key={k} className="flex items-center gap-2 cursor-pointer p-2 rounded border border-border/50 hover:border-gold/40">
                      <RadioGroupItem value={k} />
                      <span className="text-sm">{tt(v, language)}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">{tt(T.prefLang, language)}</Label>
                <RadioGroup value={preferredLanguage} onValueChange={setPreferredLanguage} className="grid grid-cols-3 gap-2">
                  {Object.entries(LANG_OPTIONS).map(([k, v]) => (
                    <Label key={k} className="flex items-center gap-2 cursor-pointer p-2 rounded border border-border/50 hover:border-gold/40">
                      <RadioGroupItem value={k} />
                      <span className="text-sm">{tt(v, language)}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </SectionCard>

          <p className="text-xs text-center text-muted-foreground italic">{tt(T.ratingHint, language)}</p>

          {/* Section 1 */}
          <SectionCard icon={Heart} title={tt(T.s1Title, language)}>
            {SECTION1_ITEMS.map((item) => (
              <RatingRow
                key={item.key}
                label={tt(item.label, language)}
                value={ratings[item.key] || 0}
                onChange={(n) => setRating(item.key, n)}
              />
            ))}
            <Textarea
              className="mt-4"
              placeholder={tt({ en: 'Comments on the service flow (optional)', zh: '关于流程的建议（选填）', th: 'ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)' }, language)}
              value={flowComments}
              onChange={(e) => setFlowComments(e.target.value)}
              maxLength={1000}
              rows={3}
            />
          </SectionCard>

          {/* Section 2 */}
          <SectionCard icon={Music} title={tt(T.s2Title, language)}>
            {SECTION2_ITEMS.map((item) => (
              <RatingRow
                key={item.key}
                label={tt(item.label, language)}
                value={ratings[item.key] || 0}
                onChange={(n) => setRating(item.key, n)}
              />
            ))}
            <Textarea
              className="mt-4"
              placeholder={tt({ en: 'Comments on worship music (optional)', zh: '关于诗歌的建议（选填）', th: 'ข้อเสนอแนะเพิ่มเติม' }, language)}
              value={musicComments}
              onChange={(e) => setMusicComments(e.target.value)}
              maxLength={1000}
              rows={3}
            />
          </SectionCard>

          {/* Section 3 */}
          <SectionCard icon={BookOpen} title={tt(T.s3Title, language)}>
            {SECTION3_ITEMS.map((item) => (
              <RatingRow
                key={item.key}
                label={tt(item.label, language)}
                value={ratings[item.key] || 0}
                onChange={(n) => setRating(item.key, n)}
              />
            ))}
            <Textarea
              className="mt-4"
              placeholder={tt({ en: 'Comments on the sermon (optional)', zh: '关于讲道的建议（选填）', th: 'ข้อเสนอแนะเพิ่มเติม' }, language)}
              value={sermonComments}
              onChange={(e) => setSermonComments(e.target.value)}
              maxLength={1000}
              rows={3}
            />
          </SectionCard>

          {/* Section 4 */}
          <SectionCard icon={GraduationCap} title={tt(T.s4Title, language)}>
            {SECTION4_ITEMS.map((item) => (
              <RatingRow
                key={item.key}
                label={tt(item.label, language)}
                value={ratings[item.key] || 0}
                onChange={(n) => setRating(item.key, n)}
              />
            ))}
            <Textarea
              className="mt-4"
              placeholder={tt({ en: 'Comments on Sunday School (optional)', zh: '关于主日学的建议（选填）', th: 'ข้อเสนอแนะเพิ่มเติม' }, language)}
              value={ssComments}
              onChange={(e) => setSsComments(e.target.value)}
              maxLength={1000}
              rows={3}
            />
          </SectionCard>

          {/* Section 5 */}
          <SectionCard icon={Heart} title={tt(T.s5Title, language)}>
            {SECTION5_ITEMS.map((item) => (
              <RatingRow
                key={item.key}
                label={tt(item.label, language)}
                value={ratings[item.key] || 0}
                onChange={(n) => setRating(item.key, n)}
              />
            ))}
            <div className="pt-4 border-t border-border/50">
              <Label className="text-sm font-medium mb-2 block">
                {tt({ en: 'How likely are you to recommend our church to a friend?', zh: '您有多大可能会向朋友推荐我们教会？', th: 'คุณจะแนะนำคริสตจักรของเราให้เพื่อนมากเพียงใด' }, language)}
              </Label>
              <p className="text-xs text-muted-foreground mb-2">{tt(T.npsHint, language)}</p>
              <NpsScale value={recommendScore} onChange={setRecommendScore} />
            </div>
          </SectionCard>

          {/* Section 6 - Open ended */}
          <SectionCard icon={MessageSquare} title={tt(T.s6Title, language)}>
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
