import { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Lock, Eye } from 'lucide-react';

export default function FinanceReport() {
  const { language } = useLanguage();
  const [reports, setReports] = useState<{ year: number; image_url: string }[]>([]);
  const [password, setPassword] = useState('');
  const [unlockedYear, setUnlockedYear] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    supabase.from('finance_reports').select('year, image_url').order('year', { ascending: false })
      .then(({ data }) => { if (data) setReports(data as any); });
  }, []);

  const labels = {
    title: { en: 'Financial Report', zh: '教会财务报告', th: 'รายงานการเงิน' },
    placeholder: { en: 'Enter year to view report', zh: '输入年份查看报告', th: 'ป้อนปีเพื่อดูรายงาน' },
    button: { en: 'View', zh: '查看', th: 'ดู' },
    error: { en: 'Incorrect password or no report for this year', zh: '密码错误或该年份暂无报告', th: 'รหัสผ่านไม่ถูกต้อง' },
    lock: { en: 'Enter the year as password to view financial details', zh: '请输入对应年份作为密码查看财务详情', th: 'กรอกปีเป็นรหัสผ่านเพื่อดูรายละเอียดการเงิน' },
  };

  const tr = (obj: Record<string, string>) => obj[language] || obj.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const yearNum = parseInt(password.trim());
    const found = reports.find(r => r.year === yearNum);
    if (found) { setUnlockedYear(yearNum); setError(false); }
    else { setError(true); setUnlockedYear(null); }
  };

  const currentReport = reports.find(r => r.year === unlockedYear);

  if (reports.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
          {tr(labels.title)}
        </h2>
        <p className="text-muted-foreground text-center mb-8 text-sm">{tr(labels.lock)}</p>

        <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder={tr(labels.placeholder)}
              className="pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Eye className="h-4 w-4" />
            {tr(labels.button)}
          </button>
        </form>

        {error && <p className="text-destructive text-center text-sm mb-4">{tr(labels.error)}</p>}

        {currentReport && (
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm animate-fade-in">
            <img src={currentReport.image_url} alt={`Finance Report ${unlockedYear}`} className="w-full h-auto" />
          </div>
        )}
      </div>
    </section>
  );
}
