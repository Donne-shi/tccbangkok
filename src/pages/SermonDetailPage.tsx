import { useParams } from 'react-router-dom';
import { LanguageProvider } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations, t } from '@/i18n/translations';
import { findSermonBySlug } from '@/data/sermons';
import { Music, Download, FileText, BookOpen, User, CalendarDays } from 'lucide-react';

function SermonDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const sermon = slug ? findSermonBySlug(slug) : null;

  if (!sermon) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">
          {language === 'zh' ? '未找到该讲道。' : language === 'th' ? 'ไม่พบคำเทศนา' : 'Sermon not found.'}
        </p>
      </div>
    );
  }

  const detailLabels = {
    speaker: { en: 'Speaker', zh: '讲员', th: 'ผู้เทศนา' },
    date: { en: 'Date', zh: '日期', th: 'วันที่' },
    series: { en: 'Series', zh: '系列', th: 'ชุด' },
    scripture: { en: 'Scripture', zh: '经文', th: 'พระคัมภีร์' },
    audio: { en: 'Sermon Audio', zh: '讲道音频', th: 'เสียงคำเทศนา' },
    audioComingSoon: { en: 'Audio coming soon', zh: '音频即将上线', th: 'เสียงเร็วๆ นี้' },
    ppt: { en: 'Sermon Slides', zh: '讲道幻灯片', th: 'สไลด์คำเทศนา' },
    pptComingSoon: { en: 'Slides coming soon', zh: '幻灯片即将上线', th: 'สไลด์เร็วๆ นี้' },
    downloadPpt: { en: 'Download Slides', zh: '下载幻灯片', th: 'ดาวน์โหลดสไลด์' },
    listenOnline: { en: 'Listen Online', zh: '在线收听', th: 'ฟังออนไลน์' },
  };

  return (
    <section className="py-8 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          {sermon.series && (
            <span className="inline-block bg-accent/10 text-accent text-sm font-medium px-3 py-1 rounded-full mb-3">
              {t(sermon.series, language)}
            </span>
          )}
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-foreground mb-4">
            {t(sermon.title, language)}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              <span>{sermon.speaker}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-accent" />
              <span>{sermon.date}</span>
            </div>
            {sermon.scripture && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <span>{t(sermon.scripture, language)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Audio section */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Music className="h-5 w-5 text-accent" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {t(detailLabels.audio, language)}
              </h2>
            </div>
            {sermon.audioPath ? (
              <audio controls className="w-full" preload="none">
                <source src={sermon.audioPath} type="audio/mpeg" />
              </audio>
            ) : (
              <div className="bg-secondary rounded-md p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {t(detailLabels.audioComingSoon, language)}
                </p>
              </div>
            )}
          </div>

          {/* PPT section */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {t(detailLabels.ppt, language)}
              </h2>
            </div>
            {sermon.pptPath ? (
              <a
                href={sermon.pptPath}
                download
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity w-full justify-center"
              >
                <Download className="h-4 w-4" />
                {t(detailLabels.downloadPpt, language)}
              </a>
            ) : (
              <div className="bg-secondary rounded-md p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {t(detailLabels.pptComingSoon, language)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SermonDetailPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <SermonDetailContent />
      </PageLayout>
    </LanguageProvider>
  );
}
