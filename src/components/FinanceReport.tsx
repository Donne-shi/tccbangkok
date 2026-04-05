import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Lock, Eye } from 'lucide-react';
import finance2025 from '@/assets/finance-2025.jpg';

const reports: Record<string, string> = {
  '2025': finance2025,
};

export default function FinanceReport() {
  const { language } = useLanguage();
  const [password, setPassword] = useState('');
  const [unlockedYear, setUnlockedYear] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const labels = {
    title: { en: 'Financial Report', zh: '教会财务报告', th: 'รายงานการเงิน' },
    placeholder: { en: 'Enter year to view report', zh: '输入年份查看报告', th: 'ป้อนปีเพื่อดูรายงาน' },
    button: { en: 'View', zh: '查看', th: 'ดู' },
    error: { en: 'Incorrect password', zh: '密码错误', th: 'รหัสผ่านไม่ถูกต้อง' },
    lock: { en: 'Enter the year as password to view financial details', zh: '请输入对应年份作为密码查看财务详情', th: 'กรอกปีเป็นรหัสผ่านเพื่อดูรายละเอียดการเงิน' },
  };

  const t = (obj: Record<string, string>) => obj[language] || obj.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();
    if (reports[trimmed]) {
      setUnlockedYear(trimmed);
      setError(false);
    } else {
      setError(true);
      setUnlockedYear(null);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
          {t(labels.title)}
        </h2>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          {t(labels.lock)}
        </p>

        <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder={t(labels.placeholder)}
              className="pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Eye className="h-4 w-4" />
            {t(labels.button)}
          </button>
        </form>

        {error && (
          <p className="text-destructive text-center text-sm mb-4">{t(labels.error)}</p>
        )}

        {unlockedYear && reports[unlockedYear] && (
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm animate-fade-in">
            <img
              src={reports[unlockedYear]}
              alt={`Finance Report ${unlockedYear}`}
              className="w-full h-auto"
            />
          </div>
        )}
      </div>
    </section>
  );
}
