import { useState } from 'react';
import { MessageSquarePlus, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';

const labels = {
  title: { en: 'Send Feedback', zh: '意见反馈', th: 'ส่งความคิดเห็น' },
  name: { en: 'Name (optional)', zh: '姓名（选填）', th: 'ชื่อ (ไม่บังคับ)' },
  email: { en: 'Email (optional)', zh: '邮箱（选填）', th: 'อีเมล (ไม่บังคับ)' },
  message: { en: 'Your feedback...', zh: '请输入您的反馈...', th: 'ความคิดเห็นของคุณ...' },
  submit: { en: 'Submit', zh: '提交', th: 'ส่ง' },
  sending: { en: 'Sending...', zh: '提交中...', th: 'กำลังส่ง...' },
  success: { en: 'Thank you for your feedback!', zh: '感谢您的反馈！', th: 'ขอบคุณสำหรับความคิดเห็น!' },
  error: { en: 'Failed to submit, please try again.', zh: '提交失败，请重试。', th: 'ส่งไม่สำเร็จ กรุณาลองใหม่' },
};

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      if (error) throw error;
      toast({ title: t(labels.success) });
      setName(''); setEmail(''); setMessage('');
      setOpen(false);
    } catch {
      toast({ title: t(labels.error), variant: 'destructive' });
    }
    setSending(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
        aria-label="Feedback"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquarePlus className="h-6 w-6" />}
      </button>

      {/* Feedback panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl p-5 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">{t(labels.title)}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label className="text-xs">{t(labels.name)}</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder={t(labels.name)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">{t(labels.email)}</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t(labels.email)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">{t(labels.message)}</Label>
              <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={t(labels.message)} rows={3} required className="mt-1" />
            </div>
            <Button type="submit" className="w-full" disabled={sending || !message.trim()}>
              {sending ? t(labels.sending) : <><Send className="h-4 w-4 mr-1" /> {t(labels.submit)}</>}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
