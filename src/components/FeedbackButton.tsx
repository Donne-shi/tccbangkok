import { useState } from 'react';
import { MessageSquarePlus, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';

const labels = {
  title: { en: 'Church Feedback', zh: '教会反馈', th: 'ความคิดเห็นคริสตจักร' },
  placeholder: { en: 'Share your suggestions or feedback...', zh: '请输入您的建议或反馈...', th: 'แบ่งปันข้อเสนอแนะของคุณ...' },
  submit: { en: 'Submit', zh: '提交', th: 'ส่ง' },
  sending: { en: 'Sending...', zh: '提交中...', th: 'กำลังส่ง...' },
  success: { en: 'Thank you for your feedback!', zh: '感谢您的反馈！', th: 'ขอบคุณสำหรับความคิดเห็น!' },
  error: { en: 'Failed to submit, please try again.', zh: '提交失败，请重试。', th: 'ส่งไม่สำเร็จ กรุณาลองใหม่' },
  verse: {
    en: '"So then you are no longer strangers and aliens, but you are fellow citizens with the saints and members of the household of God, built on the foundation of the apostles and prophets, Christ Jesus himself being the cornerstone."',
    zh: '"这样，你们不再是外人和客旅，是与圣徒同国，是神家里的人了；并且被建造在使徒和先知的根基上，有基督耶稣自己为房角石。"',
    th: '"เหตุฉะนั้นท่านจึงไม่ใช่คนต่างด้าวต่างแดนอีกต่อไป แต่เป็นพลเมืองเดียวกับธรรมิกชน และเป็นครอบครัวของพระเจ้า"',
  },
  verseRef: { en: '— Ephesians 2:19-20', zh: '—— 以弗所书 2:19-20', th: '— เอเฟซัส 2:19-20' },
};

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const t = (obj: Record<string, string>) => obj[language] || obj.zh;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const { error } = await supabase.from('feedback').insert({
        name: '',
        email: '',
        message: message.trim(),
      });
      if (error) throw error;
      toast({ title: t(labels.success) });
      setMessage('');
      setOpen(false);
    } catch {
      toast({ title: t(labels.error), variant: 'destructive' });
    }
    setSending(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
        aria-label="Feedback"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquarePlus className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl p-5 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{t(labels.title)}</h3>

          {/* Scripture quote */}
          <div className="bg-secondary/60 rounded-lg p-3 mb-4 border border-border/50">
            <p className="text-xs text-foreground/80 italic leading-relaxed">{t(labels.verse)}</p>
            <p className="text-xs text-muted-foreground mt-1 text-right">{t(labels.verseRef)}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={t(labels.placeholder)}
              rows={4}
              required
            />
            <Button type="submit" className="w-full" disabled={sending || !message.trim()}>
              {sending ? t(labels.sending) : <><Send className="h-4 w-4 mr-1" /> {t(labels.submit)}</>}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
