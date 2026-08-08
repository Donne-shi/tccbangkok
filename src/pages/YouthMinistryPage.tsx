import { Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, BookOpen, Music, ExternalLink, Users } from 'lucide-react';

function YouthMinistryContent() {
  const { language } = useLanguage();

  const heading =
    language === 'zh' ? '青少年服侍'
    : language === 'th' ? 'การรับใช้เยาวชน'
    : 'Youth Ministry';
  const subtitle =
    language === 'zh' ? '同工资源、敬拜团与推荐书籍。'
    : language === 'th' ? 'ทรัพยากรสำหรับผู้รับใช้ ทีมนมัสการ และหนังสือแนะนำ'
    : 'Co-worker resources, worship team, and recommended reading.';

  const coworkerTitle =
    language === 'zh' ? '同工资源' : language === 'th' ? 'ทรัพยากรผู้รับใช้' : 'Co-worker Resources';
  const bookTitle =
    language === 'zh' ? '书籍推荐' : language === 'th' ? 'หนังสือแนะนำ' : 'Recommended Books';
  const worshipTitle =
    language === 'zh' ? '青少年敬拜团' : language === 'th' ? 'ทีมนมัสการเยาวชน' : 'Youth Worship Team';
  const worshipDesc =
    language === 'zh' ? '敬拜歌曲与和弦资源' : language === 'th' ? 'เพลงนมัสการและคอร์ด' : 'Worship songs & chord resources';

  const books = [
    {
      title: 'Gospel-Centered Youth Ministry: A Practical Guide',
      desc: 'Cameron Cole & Jon Nielson',
      url: 'https://www.amazon.com/Gospel-Centered-Youth-Ministry-Practical-Guide/dp/1433546957',
    },
    {
      title: 'What Is Gospel-Centered Youth Ministry?',
      desc: 'Rooted Ministry Article',
      url: 'https://rootedministry.com/what-is-gospel-centered-youth-ministry/',
    },
  ];

  return (
    <section className="py-12 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/ministries" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {language === 'zh' ? '返回服侍' : language === 'th' ? 'กลับ' : 'Back to Ministries'}
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <Users className="h-8 w-8 text-accent" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{heading}</h1>
        </div>
        <p className="text-muted-foreground mb-10">{subtitle}</p>
        {/* Forms */}
        <div className="mb-10">
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-accent" />
            {language === 'zh' ? '表单登记' : language === 'th' ? 'แบบฟอร์มลงทะเบียน' : 'Registration Forms'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              to="/ministries/youth/volunteer-application"
              className="block bg-card rounded-lg p-6 shadow-sm border border-border hover:border-accent/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <HeartHandshake className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                    {language === 'zh' ? '青少年服侍同工申请表'
                      : language === 'th' ? 'ใบสมัครผู้รับใช้เยาวชน'
                      : 'Youth Ministry Co-worker Application'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'zh' ? '愿意加入青少年服侍团队的弟兄姊妹请填写。'
                      : language === 'th' ? 'สำหรับผู้ที่ต้องการร่วมรับใช้ในทีมเยาวชน'
                      : 'For those willing to serve on the youth ministry team.'}
                  </p>
                </div>
              </div>
            </Link>
            <Link
              to="/ministries/youth/fellowship-form"
              className="block bg-card rounded-lg p-6 shadow-sm border border-border hover:border-accent/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                    {language === 'zh' ? '青少年团契参与信息表'
                      : language === 'th' ? 'แบบฟอร์มข้อมูลผู้เข้าร่วมกลุ่มเยาวชน'
                      : 'Youth Fellowship Participation Form'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'zh' ? '参加团契的青少年请填写，我们将安排小组与关怀同工。'
                      : language === 'th' ? 'สำหรับเยาวชนที่เข้าร่วมกลุ่ม เพื่อจัดกลุ่มและผู้ดูแล'
                      : 'For youth joining fellowship; we will assign a group and mentor.'}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>


        {/* Youth Worship Team */}
        <div className="mb-10">
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Music className="h-5 w-5 text-accent" />
            {worshipTitle}
          </h2>
          <Link
            to="/ministries/youth-worship"
            className="block bg-card rounded-lg p-6 shadow-sm border border-border hover:border-accent/50 transition-colors group"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{worshipTitle}</h3>
                <p className="text-muted-foreground text-sm">{worshipDesc}</p>
              </div>
              <Music className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
          </Link>
        </div>

        {/* Co-worker Resources */}
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            {coworkerTitle}
          </h2>
          <h3 className="font-heading text-base font-medium text-muted-foreground mb-3">{bookTitle}</h3>
          <div className="space-y-4">
            {books.map((book) => (
              <a
                key={book.url}
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-card rounded-lg p-6 shadow-sm border border-border hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-semibold text-foreground mb-1">{book.title}</h4>
                      <p className="text-muted-foreground text-sm">{book.desc}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function YouthMinistryPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <YouthMinistryContent />
      </PageLayout>
    </LanguageProvider>
  );
}
