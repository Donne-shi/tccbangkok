import { useState } from 'react';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, Music, Youtube, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface WorshipSong {
  title: string;
  key: string;
  video?: string;
  chordUrl?: string;
  isNew?: boolean;
}

const currentSongs: WorshipSong[] = [
  { title: 'Praise', key: 'A', video: 'https://www.youtube.com/watch?v=gFWwW6Pi7hA', chordUrl: 'https://www.ultimate-guitar.com/search.php?search_type=title&value=praise+elevation+worship' },
  { title: 'Holy Forever', key: 'E-F', video: 'https://www.youtube.com/watch?v=IkHgxKemCRk', chordUrl: 'https://www.worshiptogether.com/songs/holy-forever-chris-tomlin/' },
  { title: 'Cornerstone', key: 'D', video: 'https://www.youtube.com/watch?v=izrk-erhDdk', chordUrl: 'https://www.worshiptogether.com/songs/cornerstone-hillsong-live/' },
  { title: 'How Great Is Our God', key: 'G', video: 'https://www.youtube.com/watch?v=KBD18rsVJHk', chordUrl: 'https://www.worshiptogether.com/songs/how-great-is-our-god-chris-tomlin/' },
  { title: 'Your Grace Is Enough', key: 'G', video: 'https://www.youtube.com/watch?v=FCGRMJF4rJw', chordUrl: 'https://www.worshiptogether.com/songs/your-grace-is-enough/' },
  { title: 'Here I Am to Worship', key: 'C', video: 'https://www.youtube.com/watch?v=03G52K9X2hQ', chordUrl: 'https://www.worshiptogether.com/songs/here-i-am-to-worship-tim-hughes/' },
  { title: 'More Than Able', key: 'G-A', video: 'https://www.youtube.com/watch?v=dQ1xxoP7NJk', chordUrl: 'https://www.worshiptogether.com/songs/more-than-able-elevation-worship/' },
  { title: 'What a Beautiful Name', key: 'D', video: 'https://www.youtube.com/watch?v=nQWFzMvCfLE', chordUrl: 'https://www.worshiptogether.com/songs/what-a-beautiful-name-hillsong-worship/' },
  { title: 'King of Kings', key: 'D', video: 'https://www.youtube.com/watch?v=dQl4izxPeNU', chordUrl: 'https://www.worshiptogether.com/songs/king-of-kings-hillsong-worship/' },
  { title: 'Oceans (Where Feet May Fail)', key: 'D', video: 'https://www.youtube.com/watch?v=dy9nwe9_xzw', chordUrl: 'https://www.worshiptogether.com/songs/oceans-where-feet-may-fail-hillsong-united/' },
  { title: 'My Lighthouse', key: 'C', video: 'https://www.youtube.com/watch?v=reAlJKv7ptU', chordUrl: 'https://www.worshiptogether.com/songs/my-lighthouse-rend-collective/' },
  { title: 'Way Maker', key: 'C', video: 'https://www.youtube.com/watch?v=25nnpMM-Eo4', chordUrl: 'https://www.worshiptogether.com/songs/way-maker-sinach/' },
  { title: 'Still', key: 'C', video: 'https://www.youtube.com/watch?v=H7pJb49vVQY', chordUrl: 'https://www.worshiptogether.com/songs/still-hillsong-live/' },
  { title: '10,000 Reasons (Bless the Lord)', key: 'C', video: 'https://www.youtube.com/watch?v=XtwIT8JjddM', chordUrl: 'https://www.worshiptogether.com/songs/10000-reasons-bless-the-lord-matt-redman/' },
  { title: 'Who Am I', key: 'E-G', video: 'https://www.youtube.com/watch?v=3rT8Re1EIQc', chordUrl: 'https://www.worshiptogether.com/songs/who-am-i-casting-crowns/' },
  { title: 'Hosanna', key: 'E', video: 'https://www.youtube.com/watch?v=hnMevXQutyE', chordUrl: 'https://www.worshiptogether.com/songs/hosanna-hillsong/' },
  { title: 'In Christ Alone', key: 'G-A', video: 'https://www.youtube.com/watch?v=8NfvW3gJ16s' },
  { title: 'Amazing Grace (My Chains Are Gone)', key: 'E-G', video: 'https://www.youtube.com/watch?v=KKo3T0j9qqo', chordUrl: 'https://www.worshiptogether.com/songs/amazing-grace-my-chains-are-gone-chris-tomlin/' },
  { title: 'Beautiful Savior', key: 'F-G' },
  { title: 'Through It All', key: 'E-G' },
  { title: 'One Way', key: 'A' },
  { title: 'I Speak Jesus', key: 'E', video: 'https://www.youtube.com/watch?v=PcmqSfr1ENY' },
  { title: 'Living Hope', key: 'G-A', video: 'https://www.youtube.com/watch?v=u-1fwZtKJSM', chordUrl: 'https://www.worshiptogether.com/songs/living-hope-phil-wickham/' },
  { title: 'Jesus I Need You', key: 'D', video: 'https://www.youtube.com/watch?v=lKM-8CZRplI' },
  { title: 'Shout to the Lord', key: 'E-A' },
  { title: 'Endless Praise', key: 'D', video: 'https://www.youtube.com/watch?v=xjQfe6OwH64' },
  { title: 'Goodness of God', key: 'G-A', video: 'https://www.youtube.com/watch?v=n3t6CdeiN1M', chordUrl: 'https://www.worshiptogether.com/songs/goodness-of-god-bethel-music/' },
  { title: 'Confidence', key: 'D', video: 'https://www.youtube.com/watch?v=KA9kSBv1QrI' },
  { title: 'I Will Follow', key: '', chordUrl: 'https://www.worshiptogether.com/songs/i-will-follow-chris-tomlin/' },
  { title: 'Lord, I Offer My Life to You', key: '', video: 'https://www.youtube.com/watch?v=FTLGBfv4xaM' },
];

const newSongs: WorshipSong[] = [
  { title: 'Endless Praise', key: 'D', video: 'https://www.youtube.com/watch?v=xjQfe6OwH64', isNew: true },
  { title: 'Shout to the Lord', key: 'E-A', isNew: true },
  { title: 'Jesus I Need You', key: 'D', video: 'https://www.youtube.com/watch?v=lKM-8CZRplI', isNew: true },
  { title: 'Through It All', key: 'E-G', isNew: true },
  { title: 'One Way', key: 'A', isNew: true },
  { title: 'I Speak Jesus', key: 'E', video: 'https://www.youtube.com/watch?v=PcmqSfr1ENY', isNew: true },
  { title: 'Song of the Saints', key: '', video: 'https://www.youtube.com/watch?v=3c-piIO3cFk', isNew: true },
  { title: 'Love of God', key: '', video: 'https://www.youtube.com/watch?v=2LapBD802O0', isNew: true },
  { title: 'You Are Good', key: '', isNew: true },
  { title: 'God So Loved', key: '', video: 'https://www.youtube.com/watch?v=E7i6c54KEfc', isNew: true },
  { title: 'New Wine', key: '', video: 'https://www.youtube.com/watch?v=1ozGKlOzEVc', isNew: true },
];

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function SongCard({ song, expandedId, onToggle }: { song: WorshipSong; expandedId: string | null; onToggle: (id: string) => void }) {
  const id = song.title;
  const isExpanded = expandedId === id;
  const videoId = song.video ? getYouTubeId(song.video) : null;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground text-base">{song.title}</h3>
              {song.isNew && (
                <Badge variant="secondary" className="bg-accent/15 text-accent text-xs">NEW</Badge>
              )}
            </div>
            {song.key && (
              <p className="text-sm text-muted-foreground mt-0.5">Key of {song.key}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {song.chordUrl && (
              <a
                href={song.chordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline px-2 py-1 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors"
                title="View Chords"
              >
                <Music className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Chords</span>
              </a>
            )}
            {videoId && (
              <button
                onClick={() => onToggle(id)}
                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${
                  isExpanded
                    ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                    : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                }`}
              >
                {isExpanded ? <X className="h-3.5 w-3.5" /> : <Youtube className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{isExpanded ? 'Close' : 'Play'}</span>
              </button>
            )}
            {song.video && !videoId && (
              <a
                href={song.video}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline px-2 py-1 rounded-md bg-red-500/10"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
      {isExpanded && videoId && (
        <div className="border-t border-border">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={song.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function YouthWorshipContent() {
  const { language } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'new'>('all');

  const handleToggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const labels = {
    title: { en: 'Youth Worship Songs', zh: '青少年敬拜歌曲', th: 'เพลงนมัสการเยาวชน' },
    back: { en: 'Back to Ministries', zh: '返回服侍', th: 'กลับไปที่พันธกิจ' },
    allSongs: { en: 'All Songs', zh: '所有歌曲', th: 'เพลงทั้งหมด' },
    newSongs: { en: 'New Songs', zh: '新歌学习', th: 'เพลงใหม่' },
    subtitle: { en: 'Worship songs for youth ministry service', zh: '青少年敬拜服侍歌曲列表', th: 'รายการเพลงนมัสการสำหรับเยาวชน' },
  };

  const l = (key: keyof typeof labels) => labels[key][language] || labels[key].en;

  const displaySongs = activeTab === 'new' ? newSongs : currentSongs;

  return (
    <section className="py-8 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/ministries"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {l('back')}
        </Link>

        <div className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
            🎵 {l('title')}
          </h1>
          <p className="text-muted-foreground">{l('subtitle')}</p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setActiveTab('all'); setExpandedId(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {l('allSongs')} ({currentSongs.length})
          </button>
          <button
            onClick={() => { setActiveTab('new'); setExpandedId(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'new'
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {l('newSongs')} ({newSongs.length})
          </button>
        </div>

        {/* Song list */}
        <div className="space-y-3">
          {displaySongs.map((song, i) => (
            <SongCard
              key={`${activeTab}-${i}`}
              song={song}
              expandedId={expandedId}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function YouthWorshipPage() {
  return (
    <LanguageProvider>
      <PageLayout>
        <YouthWorshipContent />
      </PageLayout>
    </LanguageProvider>
  );
}
