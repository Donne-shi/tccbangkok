import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, X, Lock, Upload, Edit2, Music, Video, BookOpen, DollarSign, Image, FileText, Loader2, MessageSquare, CheckCircle, Clock, Eye, Globe, ClipboardList, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkItem { title: string; url: string; }

interface FeedbackItem {
  id: string; name: string; email: string; message: string;
  status: string; created_at: string;
}

interface SSContent {
  id: string; category: string; title: string; date: string; year: number;
  summary: string | null; ppt_url: string | null;
  song_links: LinkItem[]; video_links: LinkItem[];
}

interface SermonItem {
  id: string; slug: string; date: string; year: number;
  title_en: string; title_zh: string; title_th: string;
  speaker: string;
  series_en: string | null; series_zh: string | null; series_th: string | null;
  scripture_en: string | null; scripture_zh: string | null; scripture_th: string | null;
  audio_url: string | null; ppt_url: string | null;
}

interface DevotionalItem {
  id: string; slug: string; date: string; year: number;
  title_zh: string; title_en: string; title_th: string;
  content: string; author: string;
  audio_url: string | null; published: boolean;
}

interface ResourceItem {
  id: string; type: string; parent_type: string | null;
  title_zh: string; title_en: string; title_th: string;
  description_zh: string; description_en: string; description_th: string;
  url: string | null; file_url: string | null; icon: string | null;
  sort_order: number; published: boolean;
}

/* ── Login ── */
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data, error: fnError } = await supabase.functions.invoke('verify-admin', { body: { password } });
      if (fnError) throw fnError;
      if (data?.valid) { sessionStorage.setItem('admin_verified', 'true'); onLogin(); }
      else setError('密码错误');
    } catch { setError('验证失败，请稍后重试'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Lock className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle>管理后台</CardTitle>
          <p className="text-sm text-muted-foreground">请输入管理密码</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="password" placeholder="管理密码" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? '验证中...' : '登录'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Sunday School Form ── */
function SSForm({ initial, onSave, onCancel }: { initial?: SSContent; onSave: () => void; onCancel: () => void }) {
  const { toast } = useToast();
  const [category, setCategory] = useState(initial?.category || 'youth');
  const [title, setTitle] = useState(initial?.title || '');
  const [date, setDate] = useState(initial?.date || '');
  const [summary, setSummary] = useState(initial?.summary || '');
  const [songLinks, setSongLinks] = useState<LinkItem[]>(initial?.song_links || []);
  const [videoLinks, setVideoLinks] = useState<LinkItem[]>(initial?.video_links || []);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [existingPptUrl] = useState(initial?.ppt_url || '');

  const addLink = (type: 'song' | 'video') => {
    const setter = type === 'song' ? setSongLinks : setVideoLinks;
    setter(prev => [...prev, { title: '', url: '' }]);
  };
  const updateLink = (type: 'song' | 'video', i: number, field: 'title' | 'url', value: string) => {
    const setter = type === 'song' ? setSongLinks : setVideoLinks;
    setter(prev => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  };
  const removeLink = (type: 'song' | 'video', i: number) => {
    const setter = type === 'song' ? setSongLinks : setVideoLinks;
    setter(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      let pptUrl = existingPptUrl;
      if (pptFile) {
        const ssExt = pptFile.name.split('.').pop() || 'pptx';
        const fileName = `${Date.now()}_file.${ssExt}`;
        const { error: ue } = await supabase.storage.from('sunday-school-files').upload(fileName, pptFile);
        if (ue) throw ue;
        pptUrl = supabase.storage.from('sunday-school-files').getPublicUrl(fileName).data.publicUrl;
      }
      const record = {
        category, title: title.trim(), date, year: new Date(date).getFullYear(),
        summary: summary.trim() || null, ppt_url: pptUrl || null,
        song_links: JSON.parse(JSON.stringify(songLinks.filter(l => l.title && l.url))),
        video_links: JSON.parse(JSON.stringify(videoLinks.filter(l => l.title && l.url))),
      };
      if (initial) {
        const { error } = await supabase.from('sunday_school_content').update(record).eq('id', initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('sunday_school_content').insert(record);
        if (error) throw error;
      }
      toast({ title: initial ? '更新成功' : '添加成功' }); onSave();
    } catch (err: any) { toast({ title: '保存失败', description: err.message, variant: 'destructive' }); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><Label>分类</Label>
          <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="youth">青少年主日学</SelectItem><SelectItem value="children">儿童主日学</SelectItem></SelectContent>
          </Select></div>
        <div><Label>日期</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
      </div>
      <div><Label>标题</Label><Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="课程标题" /></div>
      <div><Label>摘要</Label><Textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="课程简要描述" rows={3} /></div>
      <div><Label>PPT文件</Label>
        {existingPptUrl && !pptFile && <p className="text-xs text-muted-foreground mb-1">已有文件，上传新文件将替换</p>}
        <Input type="file" accept=".ppt,.pptx,.pdf" onChange={e => setPptFile(e.target.files?.[0] || null)} /></div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="flex items-center gap-1"><Music className="h-4 w-4" /> 诗歌链接</Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => addLink('song')}><Plus className="h-4 w-4 mr-1" /> 添加</Button>
        </div>
        {songLinks.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input placeholder="名称" value={link.title} onChange={e => updateLink('song', i, 'title', e.target.value)} className="flex-1" />
            <Input placeholder="链接URL" value={link.url} onChange={e => updateLink('song', i, 'url', e.target.value)} className="flex-1" />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeLink('song', i)}><X className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="flex items-center gap-1"><Video className="h-4 w-4" /> 视频链接</Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => addLink('video')}><Plus className="h-4 w-4 mr-1" /> 添加</Button>
        </div>
        {videoLinks.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input placeholder="名称" value={link.title} onChange={e => updateLink('video', i, 'title', e.target.value)} className="flex-1" />
            <Input placeholder="链接URL" value={link.url} onChange={e => updateLink('video', i, 'url', e.target.value)} className="flex-1" />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeLink('video', i)}><X className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>{saving ? '保存中...' : initial ? '更新' : '添加'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
      </div>
    </form>
  );
}

/* ── Sermon Form ── */
function SermonForm({ initial, onSave, onCancel }: { initial?: SermonItem; onSave: () => void; onCancel: () => void }) {
  const { toast } = useToast();
  const [date, setDate] = useState(initial?.date || '');
  const [titleZh, setTitleZh] = useState(initial?.title_zh || '');
  const [titleEn, setTitleEn] = useState(initial?.title_en || '');
  const [titleTh, setTitleTh] = useState(initial?.title_th || '');
  const [speaker, setSpeaker] = useState(initial?.speaker || '');
  const [seriesZh, setSeriesZh] = useState(initial?.series_zh || '');
  const [seriesEn, setSeriesEn] = useState(initial?.series_en || '');
  const [seriesTh, setSeriesTh] = useState(initial?.series_th || '');
  const [scriptureZh, setScriptureZh] = useState(initial?.scripture_zh || '');
  const [scriptureEn, setScriptureEn] = useState(initial?.scripture_en || '');
  const [scriptureTh, setScriptureTh] = useState(initial?.scripture_th || '');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [existingAudioUrl] = useState(initial?.audio_url || '');
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [existingPptUrl] = useState(initial?.ppt_url || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      let audioUrl = existingAudioUrl;
      if (audioFile) {
        const ext = audioFile.name.split('.').pop() || 'mp3';
        const audioName = `${Date.now()}_audio.${ext}`;
        const { error: ae } = await supabase.storage.from('sermon-audio').upload(audioName, audioFile);
        if (ae) throw ae;
        audioUrl = supabase.storage.from('sermon-audio').getPublicUrl(audioName).data.publicUrl;
      }
      let pptUrl = existingPptUrl;
      if (pptFile) {
        const pptExt = pptFile.name.split('.').pop() || 'pptx';
        const fileName = `sermons/${Date.now()}_slides.${pptExt}`;
        const { error: ue } = await supabase.storage.from('sunday-school-files').upload(fileName, pptFile);
        if (ue) throw ue;
        pptUrl = supabase.storage.from('sunday-school-files').getPublicUrl(fileName).data.publicUrl;
      }
      const slugBase = titleEn.trim() || titleZh.trim() || 'sermon';
      const slug = initial?.slug || `${date}-${slugBase.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/(^-|-$)/g, '')}`;
      const year = new Date(date).getFullYear();
      const record = {
        slug, date, year, speaker: speaker.trim(),
        title_en: titleEn.trim(), title_zh: titleZh.trim(), title_th: titleTh.trim(),
        series_en: seriesEn.trim() || null, series_zh: seriesZh.trim() || null, series_th: seriesTh.trim() || null,
        scripture_en: scriptureEn.trim() || null, scripture_zh: scriptureZh.trim() || null, scripture_th: scriptureTh.trim() || null,
        audio_url: audioUrl || null, ppt_url: pptUrl || null,
      };
      if (initial) {
        const { error } = await supabase.from('sermons').update(record).eq('id', initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('sermons').insert(record);
        if (error) throw error;
      }
      toast({ title: initial ? '更新成功' : '添加成功' }); onSave();
    } catch (err: any) { toast({ title: '保存失败', description: err.message, variant: 'destructive' }); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><Label>日期</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
        <div><Label>讲员</Label><Input value={speaker} onChange={e => setSpeaker(e.target.value)} required placeholder="讲员名称" /></div>
      </div>
      <div className="space-y-2">
        <Label>标题（中/英/泰）</Label>
        <Input value={titleZh} onChange={e => setTitleZh(e.target.value)} required placeholder="中文标题" />
        <Input value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="English Title (可选)" />
        <Input value={titleTh} onChange={e => setTitleTh(e.target.value)} placeholder="ชื่อภาษาไทย (可选)" />
      </div>
      <div className="space-y-2">
        <Label>系列（可选，中/英/泰）</Label>
        <Input value={seriesZh} onChange={e => setSeriesZh(e.target.value)} placeholder="系列名称（中文）" />
        <Input value={seriesEn} onChange={e => setSeriesEn(e.target.value)} placeholder="Series Name (English)" />
        <Input value={seriesTh} onChange={e => setSeriesTh(e.target.value)} placeholder="ชื่อชุด (ภาษาไทย)" />
      </div>
      <div className="space-y-2">
        <Label>经文（可选，中/英/泰）</Label>
        <Input value={scriptureZh} onChange={e => setScriptureZh(e.target.value)} placeholder="经文（中文）" />
        <Input value={scriptureEn} onChange={e => setScriptureEn(e.target.value)} placeholder="Scripture (English)" />
        <Input value={scriptureTh} onChange={e => setScriptureTh(e.target.value)} placeholder="พระคัมภีร์ (ภาษาไทย)" />
      </div>
      <div><Label>音频文件（可选）</Label>
        {existingAudioUrl && !audioFile && <p className="text-xs text-muted-foreground mb-1">已有音频，上传新文件将替换</p>}
        <Input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} /></div>
      <div><Label>PPT/幻灯片文件（可选）</Label>
        {existingPptUrl && !pptFile && <p className="text-xs text-muted-foreground mb-1">已有文件，上传新文件将替换</p>}
        <Input type="file" accept=".ppt,.pptx,.pdf" onChange={e => setPptFile(e.target.files?.[0] || null)} /></div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>{saving ? '保存中...' : initial ? '更新' : '添加'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
      </div>
    </form>
  );
}

/* ── Finance Report Form ── */
function FinanceForm({ initial, onSave, onCancel }: { initial?: { id: string; year: number; image_url: string }; onSave: () => void; onCancel: () => void }) {
  const { toast } = useToast();
  const [year, setYear] = useState(initial?.year?.toString() || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      let imageUrl = initial?.image_url || '';
      if (imageFile) {
        const ext = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `finance_${year}_${Date.now()}.${ext}`;
        const { error: ue } = await supabase.storage.from('finance-assets').upload(fileName, imageFile);
        if (ue) throw ue;
        imageUrl = supabase.storage.from('finance-assets').getPublicUrl(fileName).data.publicUrl;
      }
      if (!imageUrl) throw new Error('请上传图片');
      const record = { year: parseInt(year), image_url: imageUrl };
      if (initial) {
        const { error } = await supabase.from('finance_reports').update(record).eq('id', initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('finance_reports').insert(record);
        if (error) throw error;
      }
      toast({ title: initial ? '更新成功' : '添加成功' }); onSave();
    } catch (err: any) { toast({ title: '保存失败', description: err.message, variant: 'destructive' }); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><Label>年份</Label><Input type="number" value={year} onChange={e => setYear(e.target.value)} required placeholder="例如 2025" /></div>
      <div><Label>财务报告图片</Label>
        {initial?.image_url && !imageFile && <p className="text-xs text-muted-foreground mb-1">已有图片，上传新图片将替换</p>}
        <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} required={!initial} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>{saving ? '保存中...' : initial ? '更新' : '添加'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
      </div>
    </form>
  );
}

/* ── Devotional Form ── */
function DevotionalForm({ initial, onSave, onCancel }: { initial?: DevotionalItem; onSave: () => void; onCancel: () => void }) {
  const { toast } = useToast();
  const [date, setDate] = useState(initial?.date || '');
  const [titleZh, setTitleZh] = useState(initial?.title_zh || '');
  const [titleEn, setTitleEn] = useState(initial?.title_en || '');
  const [titleTh, setTitleTh] = useState(initial?.title_th || '');
  const [content, setContent] = useState(initial?.content || '');
  const [author, setAuthor] = useState(initial?.author || '');
  const [published, setPublished] = useState(initial?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const slugBase = titleZh.trim() || titleEn.trim() || 'devotional';
      const slug = initial?.slug || `${date}-${slugBase.replace(/[^a-z0-9\u4e00-\u9fff]+/gi, '-').replace(/(^-|-$)/g, '')}`;
      const year = new Date(date).getFullYear();
      const record = {
        slug, date, year, author: author.trim(), published,
        title_zh: titleZh.trim(), title_en: titleEn.trim(), title_th: titleTh.trim(),
        content: content.trim(), audio_url: initial?.audio_url || null,
      };
      if (initial) {
        const { error } = await supabase.from('devotional_posts').update(record).eq('id', initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('devotional_posts').insert(record);
        if (error) throw error;
      }
      toast({ title: initial ? '更新成功' : '添加成功' }); onSave();
    } catch (err: any) { toast({ title: '保存失败', description: err.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const handleGenerateAudio = async () => {
    if (!initial?.id) { toast({ title: '请先保存文章再生成音频', variant: 'destructive' }); return; }
    setGeneratingAudio(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-devotional-audio', {
        body: { devotionalId: initial.id, content: content.trim(), title: titleZh.trim() || titleEn.trim() },
      });
      if (error) throw error;
      toast({ title: '音频生成成功', description: data?.message || '已生成语音版本' });
      onSave();
    } catch (err: any) { toast({ title: '音频生成失败', description: err.message, variant: 'destructive' }); }
    setGeneratingAudio(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><Label>日期</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
        <div><Label>作者</Label><Input value={author} onChange={e => setAuthor(e.target.value)} required placeholder="作者名称" /></div>
      </div>
      <div className="space-y-2">
        <Label>标题（中/英/泰）</Label>
        <Input value={titleZh} onChange={e => setTitleZh(e.target.value)} required placeholder="中文标题" />
        <Input value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="English Title (可选)" />
        <Input value={titleTh} onChange={e => setTitleTh(e.target.value)} placeholder="ชื่อภาษาไทย (可选)" />
      </div>
      <div><Label>正文内容</Label>
        <Textarea value={content} onChange={e => setContent(e.target.value)} required placeholder="灵修分享内容..." rows={12} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="published" checked={published} onChange={e => setPublished(e.target.checked)} className="rounded" />
        <Label htmlFor="published">发布（勾选后前端可见）</Label>
      </div>
      {initial && (
        <div className="border border-border rounded-lg p-4 bg-secondary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">AI 音频生成</p>
              <p className="text-xs text-muted-foreground">使用AI生成灵修内容的语音版本</p>
              {initial.audio_url && <p className="text-xs text-accent mt-1">✓ 已有音频</p>}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleGenerateAudio} disabled={generatingAudio}>
              {generatingAudio ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> 生成中...</> : '生成音频'}
            </Button>
          </div>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>{saving ? '保存中...' : initial ? '更新' : '添加'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
      </div>
    </form>
  );
}

/* ── Resource Form ── */
function ResourceForm({ initial, onSave, onCancel }: { initial?: ResourceItem; onSave: () => void; onCancel: () => void }) {
  const { toast } = useToast();
  const [type, setType] = useState(initial?.type || 'online_resource');
  const [titleZh, setTitleZh] = useState(initial?.title_zh || '');
  const [titleEn, setTitleEn] = useState(initial?.title_en || '');
  const [titleTh, setTitleTh] = useState(initial?.title_th || '');
  const [descZh, setDescZh] = useState(initial?.description_zh || '');
  const [descEn, setDescEn] = useState(initial?.description_en || '');
  const [descTh, setDescTh] = useState(initial?.description_th || '');
  const [url, setUrl] = useState(initial?.url || '');
  const [icon, setIcon] = useState(initial?.icon || '');
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const record = {
        type, title_zh: titleZh.trim(), title_en: titleEn.trim(), title_th: titleTh.trim(),
        description_zh: descZh.trim(), description_en: descEn.trim(), description_th: descTh.trim(),
        url: url.trim() || null, icon: icon.trim() || null,
        sort_order: sortOrder, published,
      };
      if (initial) {
        const { error } = await supabase.from('learning_resources').update(record).eq('id', initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('learning_resources').insert(record);
        if (error) throw error;
      }
      toast({ title: initial ? '更新成功' : '添加成功' }); onSave();
    } catch (err: any) { toast({ title: '保存失败', description: err.message, variant: 'destructive' }); }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><Label>资源类型</Label>
          <Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="category">资源分类</SelectItem>
              <SelectItem value="online_resource">网络资源</SelectItem>
              <SelectItem value="document">文档资源</SelectItem>
            </SelectContent>
          </Select></div>
        <div><Label>排序</Label><Input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><Label>中文标题</Label><Input value={titleZh} onChange={e => setTitleZh(e.target.value)} required placeholder="中文标题" /></div>
        <div><Label>英文标题</Label><Input value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="English Title" /></div>
        <div><Label>泰文标题</Label><Input value={titleTh} onChange={e => setTitleTh(e.target.value)} placeholder="ชื่อภาษาไทย" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><Label>中文描述</Label><Textarea value={descZh} onChange={e => setDescZh(e.target.value)} rows={2} placeholder="中文描述" /></div>
        <div><Label>英文描述</Label><Textarea value={descEn} onChange={e => setDescEn(e.target.value)} rows={2} placeholder="English description" /></div>
        <div><Label>泰文描述</Label><Textarea value={descTh} onChange={e => setDescTh(e.target.value)} rows={2} placeholder="คำอธิบายภาษาไทย" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><Label>链接URL</Label><Input value={url} onChange={e => setUrl(e.target.value)} placeholder={type === 'category' ? '页面路径如 /resources/creeds' : 'https://...'} /></div>
        <div><Label>图标</Label><Input value={icon} onChange={e => setIcon(e.target.value)} placeholder="图标标识（如 BookOpen、📖）" /></div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="res-published" checked={published} onChange={e => setPublished(e.target.checked)} />
        <Label htmlFor="res-published">发布</Label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>{saving ? '保存中...' : initial ? '更新' : '添加'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
      </div>
    </form>
  );
}

/* ── Admin Dashboard ── */
function AdminDashboard() {
  const { toast } = useToast();
  const [mainTab, setMainTab] = useState('sunday-school');

  // Finance reports state
  const [financeReports, setFinanceReports] = useState<{ id: string; year: number; image_url: string }[]>([]);
  const [financeLoading, setFinanceLoading] = useState(true);
  const [financeShowForm, setFinanceShowForm] = useState(false);
  const [financeEditing, setFinanceEditing] = useState<{ id: string; year: number; image_url: string } | undefined>();


  // Feedback state
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  // Resources state
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourceShowForm, setResourceShowForm] = useState(false);
  const [resourceEditing, setResourceEditing] = useState<ResourceItem | undefined>();
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');

  const [ssContents, setSsContents] = useState<SSContent[]>([]);
  const [ssTab, setSsTab] = useState('youth');
  const [ssLoading, setSsLoading] = useState(true);
  const [ssShowForm, setSsShowForm] = useState(false);
  const [ssEditing, setSsEditing] = useState<SSContent | undefined>();

  // Sermons state
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [sermonsLoading, setSermonsLoading] = useState(true);
  const [sermonShowForm, setSermonShowForm] = useState(false);
  const [sermonEditing, setSermonEditing] = useState<SermonItem | undefined>();

  // Devotional state
  const [devotionals, setDevotionals] = useState<DevotionalItem[]>([]);
  const [devotionalsLoading, setDevotionalsLoading] = useState(true);
  const [devotionalShowForm, setDevotionalShowForm] = useState(false);
  const [devotionalEditing, setDevotionalEditing] = useState<DevotionalItem | undefined>();

  // Survey state
  const [surveys, setSurveys] = useState<any[]>([]);
  const [surveysLoading, setSurveysLoading] = useState(true);
  const [surveyExpandedId, setSurveyExpandedId] = useState<string | null>(null);

  const fetchSS = useCallback(async () => {
    const { data } = await supabase.from('sunday_school_content').select('*').order('date', { ascending: false });
    if (data) setSsContents(data.map(d => ({ ...d, song_links: (d.song_links as any) || [], video_links: (d.video_links as any) || [] })));
    setSsLoading(false);
  }, []);

  const fetchSermons = useCallback(async () => {
    const { data } = await supabase.from('sermons').select('*').order('date', { ascending: false });
    if (data) setSermons(data);
    setSermonsLoading(false);
  }, []);

  const fetchFinance = useCallback(async () => {
    const { data } = await supabase.from('finance_reports').select('*').order('year', { ascending: false });
    if (data) setFinanceReports(data as any);
    setFinanceLoading(false);
  }, []);

  const fetchDevotionals = useCallback(async () => {
    const { data } = await supabase.from('devotional_posts').select('*').order('date', { ascending: false });
    if (data) setDevotionals(data as any);
    setDevotionalsLoading(false);
  }, []);

  const fetchFeedback = useCallback(async () => {
    const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
    if (data) setFeedbacks(data as any);
    setFeedbackLoading(false);
  }, []);

  const fetchResources = useCallback(async () => {
    const { data } = await supabase.from('learning_resources').select('*').order('sort_order', { ascending: true });
    if (data) setResources(data as any);
    setResourcesLoading(false);
  }, []);

  const fetchSurveys = useCallback(async () => {
    const { data } = await supabase.from('church_survey_responses').select('*').order('created_at', { ascending: false });
    if (data) setSurveys(data as any);
    setSurveysLoading(false);
  }, []);

  useEffect(() => { fetchSS(); fetchSermons(); fetchFinance(); fetchDevotionals(); fetchFeedback(); fetchResources(); fetchSurveys(); }, [fetchSS, fetchSermons, fetchFinance, fetchDevotionals, fetchFeedback, fetchResources, fetchSurveys]);

  const handleDeleteSS = async (id: string) => {
    if (!confirm('确定删除？')) return;
    const { error } = await supabase.from('sunday_school_content').delete().eq('id', id);
    if (error) toast({ title: '删除失败', variant: 'destructive' }); else { toast({ title: '已删除' }); fetchSS(); }
  };

  const handleDeleteSermon = async (id: string) => {
    if (!confirm('确定删除此讲道？')) return;
    const { error } = await supabase.from('sermons').delete().eq('id', id);
    if (error) toast({ title: '删除失败', variant: 'destructive' }); else { toast({ title: '已删除' }); fetchSermons(); }
  };

  const handleDeleteFinance = async (id: string) => {
    if (!confirm('确定删除此财务报告？')) return;
    const { error } = await supabase.from('finance_reports').delete().eq('id', id);
    if (error) toast({ title: '删除失败', variant: 'destructive' }); else { toast({ title: '已删除' }); fetchFinance(); }
  };

  const handleDeleteDevotional = async (id: string) => {
    if (!confirm('确定删除此灵修分享？')) return;
    const { error } = await supabase.from('devotional_posts').delete().eq('id', id);
    if (error) toast({ title: '删除失败', variant: 'destructive' }); else { toast({ title: '已删除' }); fetchDevotionals(); }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('确定删除此反馈？')) return;
    const { error } = await supabase.from('feedback').delete().eq('id', id);
    if (error) toast({ title: '删除失败', variant: 'destructive' }); else { toast({ title: '已删除' }); fetchFeedback(); }
  };

  const handleUpdateFeedbackStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('feedback').update({ status }).eq('id', id);
    if (error) toast({ title: '更新失败', variant: 'destructive' }); else { toast({ title: '状态已更新' }); fetchFeedback(); }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('确定删除此资源？')) return;
    const { error } = await supabase.from('learning_resources').delete().eq('id', id);
    if (error) toast({ title: '删除失败', variant: 'destructive' }); else { toast({ title: '已删除' }); fetchResources(); }
  };

  const handleDeleteSurvey = async (id: string) => {
    if (!confirm('确定删除此问卷回应？')) return;
    const { error } = await supabase.from('church_survey_responses').delete().eq('id', id);
    if (error) toast({ title: '删除失败', variant: 'destructive' }); else { toast({ title: '已删除' }); fetchSurveys(); }
  };

  const handleUpdateSurveyStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('church_survey_responses').update({ status }).eq('id', id);
    if (error) toast({ title: '更新失败', variant: 'destructive' }); else { toast({ title: '状态已更新' }); fetchSurveys(); }
  };

  const filteredResources = resourceTypeFilter === 'all' ? resources : resources.filter(r => r.type === resourceTypeFilter);
  const ssFiltered = ssContents.filter(c => c.category === ssTab);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <h1 className="text-lg font-bold">教会内容管理</h1>
        <Button variant="secondary" size="sm" onClick={() => { sessionStorage.removeItem('admin_verified'); window.location.reload(); }}>退出</Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Tabs value={mainTab} onValueChange={setMainTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="sunday-school">主日学管理</TabsTrigger>
            <TabsTrigger value="sermons">讲道管理</TabsTrigger>
            <TabsTrigger value="devotionals">灵修分享</TabsTrigger>
            <TabsTrigger value="finance">财务报告</TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> 反馈管理
              {feedbacks.filter(f => f.status === 'pending').length > 0 && (
                <span className="ml-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5 leading-none">
                  {feedbacks.filter(f => f.status === 'pending').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-1">
              <Globe className="h-4 w-4" /> 学习资源
            </TabsTrigger>
            <TabsTrigger value="surveys" className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" /> 满意度问卷
              {surveys.filter(s => s.status === 'new').length > 0 && (
                <span className="ml-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5 leading-none">
                  {surveys.filter(s => s.status === 'new').length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Sunday School Tab ── */}
          <TabsContent value="sunday-school">
            {ssShowForm || ssEditing ? (
              <Card><CardHeader><CardTitle>{ssEditing ? '编辑内容' : '添加新内容'}</CardTitle></CardHeader>
                <CardContent><SSForm initial={ssEditing} onSave={() => { setSsShowForm(false); setSsEditing(undefined); fetchSS(); }} onCancel={() => { setSsShowForm(false); setSsEditing(undefined); }} /></CardContent></Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <Tabs value={ssTab} onValueChange={setSsTab}>
                    <TabsList><TabsTrigger value="youth">青少年</TabsTrigger><TabsTrigger value="children">儿童</TabsTrigger></TabsList>
                  </Tabs>
                  <Button onClick={() => setSsShowForm(true)}><Plus className="h-4 w-4 mr-1" /> 添加内容</Button>
                </div>
                {ssLoading ? <div className="text-center py-12 text-muted-foreground">加载中...</div> :
                  ssFiltered.length === 0 ? <div className="text-center py-12 text-muted-foreground">暂无内容</div> :
                  <div className="space-y-3">{ssFiltered.map(item => (
                    <Card key={item.id}><CardContent className="py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          {item.ppt_url && <span className="flex items-center gap-1"><Upload className="h-3 w-3" /> PPT</span>}
                          {item.song_links.length > 0 && <span className="flex items-center gap-1"><Music className="h-3 w-3" /> {item.song_links.length}首</span>}
                          {item.video_links.length > 0 && <span className="flex items-center gap-1"><Video className="h-3 w-3" /> {item.video_links.length}个</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => setSsEditing(item)}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSS(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </CardContent></Card>
                  ))}</div>}
              </>
            )}
          </TabsContent>

          {/* ── Sermons Tab ── */}
          <TabsContent value="sermons">
            {sermonShowForm || sermonEditing ? (
              <Card><CardHeader><CardTitle>{sermonEditing ? '编辑讲道' : '添加新讲道'}</CardTitle></CardHeader>
                <CardContent><SermonForm initial={sermonEditing} onSave={() => { setSermonShowForm(false); setSermonEditing(undefined); fetchSermons(); }} onCancel={() => { setSermonShowForm(false); setSermonEditing(undefined); }} /></CardContent></Card>
            ) : (
              <>
                <div className="flex items-center justify-end mb-6">
                  <Button onClick={() => setSermonShowForm(true)}><Plus className="h-4 w-4 mr-1" /> 添加讲道</Button>
                </div>
                {sermonsLoading ? <div className="text-center py-12 text-muted-foreground">加载中...</div> :
                  sermons.length === 0 ? <div className="text-center py-12 text-muted-foreground">暂无讲道</div> :
                  <div className="space-y-3">{sermons.map(item => (
                    <Card key={item.id}><CardContent className="py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{item.title_zh || item.title_en}</p>
                        <p className="text-sm text-muted-foreground">{item.date} · {item.speaker}</p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          {item.series_zh && <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {item.series_zh}</span>}
                          {item.audio_url && <span className="flex items-center gap-1"><Music className="h-3 w-3" /> 音频</span>}
                          {item.ppt_url && <span className="flex items-center gap-1"><Upload className="h-3 w-3" /> PPT</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => setSermonEditing(item)}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSermon(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </CardContent></Card>
                  ))}</div>}
              </>
            )}
          </TabsContent>

          {/* ── Devotionals Tab ── */}
          <TabsContent value="devotionals">
            {devotionalShowForm || devotionalEditing ? (
              <Card><CardHeader><CardTitle>{devotionalEditing ? '编辑灵修分享' : '添加灵修分享'}</CardTitle></CardHeader>
                <CardContent><DevotionalForm initial={devotionalEditing} onSave={() => { setDevotionalShowForm(false); setDevotionalEditing(undefined); fetchDevotionals(); }} onCancel={() => { setDevotionalShowForm(false); setDevotionalEditing(undefined); }} /></CardContent></Card>
            ) : (
              <>
                <div className="flex items-center justify-end mb-6">
                  <Button onClick={() => setDevotionalShowForm(true)}><Plus className="h-4 w-4 mr-1" /> 添加灵修分享</Button>
                </div>
                {devotionalsLoading ? <div className="text-center py-12 text-muted-foreground">加载中...</div> :
                  devotionals.length === 0 ? <div className="text-center py-12 text-muted-foreground">暂无灵修分享</div> :
                  <div className="space-y-3">{devotionals.map(item => (
                    <Card key={item.id}><CardContent className="py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{item.title_zh || item.title_en}</p>
                          {!item.published && <span className="text-xs bg-muted px-1.5 py-0.5 rounded">草稿</span>}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.date} · {item.author}</p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          {item.audio_url && <span className="flex items-center gap-1"><Music className="h-3 w-3" /> 有音频</span>}
                          <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {item.content.length}字</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => setDevotionalEditing(item)}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDevotional(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </CardContent></Card>
                  ))}</div>}
              </>
            )}
          </TabsContent>

          {/* ── Finance Tab ── */}
          <TabsContent value="finance">
            {financeShowForm || financeEditing ? (
              <Card><CardHeader><CardTitle>{financeEditing ? '编辑财务报告' : '添加财务报告'}</CardTitle></CardHeader>
                <CardContent><FinanceForm initial={financeEditing} onSave={() => { setFinanceShowForm(false); setFinanceEditing(undefined); fetchFinance(); }} onCancel={() => { setFinanceShowForm(false); setFinanceEditing(undefined); }} /></CardContent></Card>
            ) : (
              <>
                <div className="flex items-center justify-end mb-6">
                  <Button onClick={() => setFinanceShowForm(true)}><Plus className="h-4 w-4 mr-1" /> 添加报告</Button>
                </div>
                {financeLoading ? <div className="text-center py-12 text-muted-foreground">加载中...</div> :
                  financeReports.length === 0 ? <div className="text-center py-12 text-muted-foreground">暂无报告</div> :
                  <div className="space-y-3">{financeReports.map(item => (
                    <Card key={item.id}><CardContent className="py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1 flex items-center gap-3">
                        <Image className="h-5 w-5 text-muted-foreground shrink-0" />
                        <div>
                          <p className="font-medium">{item.year} 年度财务报告</p>
                          <p className="text-xs text-muted-foreground truncate">{item.image_url}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => setFinanceEditing(item)}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteFinance(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </CardContent></Card>
                  ))}</div>}
              </>
            )}
          </TabsContent>

          {/* ── Feedback Tab ── */}
          <TabsContent value="feedback">
            {feedbackLoading ? <div className="text-center py-12 text-muted-foreground">加载中...</div> :
              feedbacks.length === 0 ? <div className="text-center py-12 text-muted-foreground">暂无反馈</div> :
              <div className="space-y-3">{feedbacks.map(item => (
                <Card key={item.id} className={item.status === 'pending' ? 'border-accent/50' : ''}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {item.status === 'pending' && <Clock className="h-4 w-4 text-amber-500" />}
                          {item.status === 'reviewed' && <Eye className="h-4 w-4 text-blue-500" />}
                          {item.status === 'resolved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                            {item.status === 'pending' ? '待处理' : item.status === 'reviewed' ? '已查看' : '已解决'}
                          </span>
                          <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString('zh-CN')}</span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{item.message}</p>
                        {(item.name || item.email) && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {item.name && <span>姓名: {item.name}</span>}
                            {item.name && item.email && <span> · </span>}
                            {item.email && <span>邮箱: {item.email}</span>}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {item.status !== 'reviewed' && (
                          <Button variant="ghost" size="sm" onClick={() => handleUpdateFeedbackStatus(item.id, 'reviewed')} title="标记已查看">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {item.status !== 'resolved' && (
                          <Button variant="ghost" size="sm" onClick={() => handleUpdateFeedbackStatus(item.id, 'resolved')} title="标记已解决">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteFeedback(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}</div>}
          </TabsContent>

          {/* ── Resources Tab ── */}
          <TabsContent value="resources">
            {resourceShowForm || resourceEditing ? (
              <Card><CardHeader><CardTitle>{resourceEditing ? '编辑资源' : '添加新资源'}</CardTitle></CardHeader>
                <CardContent><ResourceForm initial={resourceEditing} onSave={() => { setResourceShowForm(false); setResourceEditing(undefined); fetchResources(); }} onCancel={() => { setResourceShowForm(false); setResourceEditing(undefined); }} /></CardContent></Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <Tabs value={resourceTypeFilter} onValueChange={setResourceTypeFilter}>
                    <TabsList>
                      <TabsTrigger value="all">全部</TabsTrigger>
                      <TabsTrigger value="category">分类</TabsTrigger>
                      <TabsTrigger value="online_resource">网络资源</TabsTrigger>
                      <TabsTrigger value="document">文档</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button onClick={() => setResourceShowForm(true)}><Plus className="h-4 w-4 mr-1" /> 添加资源</Button>
                </div>
                {resourcesLoading ? <div className="text-center py-12 text-muted-foreground">加载中...</div> :
                  filteredResources.length === 0 ? <div className="text-center py-12 text-muted-foreground">暂无资源</div> :
                  <div className="space-y-3">{filteredResources.map(item => (
                    <Card key={item.id} className={!item.published ? 'opacity-60' : ''}>
                      <CardContent className="py-4 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{item.title_zh || item.title_en}</p>
                            <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {item.type === 'category' ? '分类' : item.type === 'online_resource' ? '网络' : '文档'}
                            </span>
                            {!item.published && <span className="text-xs bg-muted px-1.5 py-0.5 rounded">草稿</span>}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{item.description_zh}</p>
                          {item.url && <p className="text-xs text-muted-foreground truncate mt-0.5">{item.url}</p>}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => setResourceEditing(item)}><Edit2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteResource(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}</div>}
              </>
            )}
          </TabsContent>

          {/* ── Surveys Tab ── */}
          <TabsContent value="surveys">
            {surveysLoading ? <div className="text-center py-12 text-muted-foreground">加载中...</div> :
              surveys.length === 0 ? <div className="text-center py-12 text-muted-foreground">暂无问卷回应</div> :
              <div className="space-y-3">
                {/* Summary stats */}
                <Card className="bg-muted/30">
                  <CardContent className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{surveys.length}</p>
                      <p className="text-xs text-muted-foreground">总回应数</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-500">{surveys.filter(s => s.status === 'new').length}</p>
                      <p className="text-xs text-muted-foreground">未查看</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-500">
                        {(() => {
                          const vals = surveys.map(s => s.overall_satisfaction).filter(v => v);
                          return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '-';
                        })()}
                      </p>
                      <p className="text-xs text-muted-foreground">整体满意度均值</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-500">
                        {(() => {
                          const vals = surveys.map(s => s.recommend_score).filter(v => v !== null && v !== undefined);
                          return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '-';
                        })()}
                      </p>
                      <p className="text-xs text-muted-foreground">推荐指数均值/10</p>
                    </div>
                  </CardContent>
                </Card>

                {surveys.map(item => {
                  const isOpen = surveyExpandedId === item.id;
                  const ratingFields: { key: string; label: string }[] = [
                    // 教会整体
                    { key: 'overall_satisfaction', label: '整体满意度' },
                    { key: 'belonging_feeling', label: '归属感' },
                    { key: 'spiritual_growth', label: '属灵成长' },
                    { key: 'vision_alignment', label: '异象认同' },
                    { key: 'welcome_atmosphere', label: '欢迎氛围' },
                    // 流程
                    { key: 'flow_overall', label: '整体流程' },
                    { key: 'flow_duration', label: '时长' },
                    { key: 'flow_transitions', label: '环节衔接' },
                    { key: 'flow_punctuality', label: '准时' },
                    { key: 'flow_announcements', label: '报告清晰' },
                    { key: 'flow_welcome', label: '招待迎新' },
                    { key: 'flow_environment', label: '场地环境' },
                    { key: 'flow_av', label: '音响投影' },
                    // 诗歌
                    { key: 'music_song_selection', label: '选曲' },
                    { key: 'music_theological_depth', label: '神学深度' },
                    { key: 'music_singability', label: '易跟唱' },
                    { key: 'music_volume', label: '音量' },
                    { key: 'music_leader', label: '敬拜带领' },
                    { key: 'music_lyrics_display', label: '歌词投影' },
                    { key: 'music_spiritual_atmosphere', label: '属灵氛围' },
                    { key: 'music_song_balance', label: '新旧诗歌平衡' },
                    // 讲道
                    { key: 'sermon_clarity', label: '讲道清晰' },
                    { key: 'sermon_biblical', label: '忠于圣经' },
                    { key: 'sermon_application', label: '生活应用' },
                    { key: 'sermon_depth', label: '属灵深度' },
                    { key: 'sermon_delivery', label: '表达感染' },
                    { key: 'sermon_length', label: '长度合适' },
                    { key: 'sermon_spiritual_growth', label: '灵命帮助' },
                    // 主日学
                    { key: 'ss_adult_quality', label: '成人主日学' },
                    { key: 'ss_children_program', label: '儿童事工' },
                    { key: 'ss_youth_program', label: '青少年事工' },
                    { key: 'ss_teacher_quality', label: '教师水平' },
                    { key: 'ss_curriculum', label: '课程内容' },
                    { key: 'ss_safety', label: '儿童安全' },
                    // 牧养
                    { key: 'pastoral_care', label: '牧养关怀' },
                    { key: 'pastoral_availability', label: '牧者可接触' },
                    { key: 'pastoral_visitation', label: '探访关怀' },
                    { key: 'pastoral_counseling', label: '辅导支持' },
                    // 小组团契
                    { key: 'smallgroup_quality', label: '小组品质' },
                    { key: 'smallgroup_belonging', label: '小组归属' },
                    { key: 'fellowship_feeling', label: '团契相交' },
                    // 事工
                    { key: 'ministry_opportunity', label: '服事机会清晰' },
                    { key: 'ministry_training', label: '培训装备' },
                    { key: 'ministry_support', label: '服事支持' },
                    // 沟通
                    { key: 'comm_announcements', label: '通知及时' },
                    { key: 'comm_website', label: '网站信息' },
                    { key: 'comm_social_media', label: '社媒沟通' },
                    { key: 'comm_transparency', label: '透明度' },
                  ];
                  const openFields: { key: string; label: string }[] = [
                    { key: 'church_impression_comments', label: '教会整体建议' },
                    { key: 'flow_comments', label: '流程建议' },
                    { key: 'music_comments', label: '诗歌建议' },
                    { key: 'sermon_comments', label: '讲道建议' },
                    { key: 'ss_comments', label: '主日学建议' },
                    { key: 'pastoral_comments', label: '牧养建议' },
                    { key: 'fellowship_comments', label: '小组团契建议' },
                    { key: 'ministry_comments', label: '事工参与建议' },
                    { key: 'comm_comments', label: '沟通建议' },
                    { key: 'most_appreciated', label: '最感恩' },
                    { key: 'most_improvement', label: '最希望改进' },
                    { key: 'topics_requested', label: '希望讲题' },
                    { key: 'additional_comments', label: '其他建议' },
                  ];
                  return (
                    <Card key={item.id} className={item.status === 'new' ? 'border-accent/50' : ''}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {item.status === 'new' && <Clock className="h-4 w-4 text-amber-500" />}
                              {item.status === 'reviewed' && <Eye className="h-4 w-4 text-blue-500" />}
                              {item.status === 'archived' && <CheckCircle className="h-4 w-4 text-green-500" />}
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                                {item.status === 'new' ? '新' : item.status === 'reviewed' ? '已查看' : '已归档'}
                              </span>
                              <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString('zh-CN')}</span>
                              <span className="text-xs text-muted-foreground">语言: {item.language_used}</span>
                              {item.overall_satisfaction && (
                                <span className="text-xs flex items-center gap-0.5 text-amber-600">
                                  <Star className="h-3 w-3 fill-current" /> {item.overall_satisfaction}/5
                                </span>
                              )}
                              {item.recommend_score !== null && item.recommend_score !== undefined && (
                                <span className="text-xs text-blue-600">推荐: {item.recommend_score}/10</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {item.member_status && <>身份: {item.member_status} · </>}
                              {item.age_group && <>年龄: {item.age_group} · </>}
                              {item.attendance_frequency && <>频率: {item.attendance_frequency}</>}
                            </p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => setSurveyExpandedId(isOpen ? null : item.id)}>
                              {isOpen ? '收起' : '查看详情'}
                            </Button>
                            {item.status !== 'reviewed' && (
                              <Button variant="ghost" size="sm" onClick={() => handleUpdateSurveyStatus(item.id, 'reviewed')} title="标记已查看">
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {item.status !== 'archived' && (
                              <Button variant="ghost" size="sm" onClick={() => handleUpdateSurveyStatus(item.id, 'archived')} title="归档">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSurvey(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        {isOpen && (
                          <div className="mt-3 pt-3 border-t space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-2">评分明细 (1-5)</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs">
                                {ratingFields.filter(f => item[f.key]).map(f => (
                                  <div key={f.key} className="flex justify-between">
                                    <span className="text-muted-foreground truncate">{f.label}</span>
                                    <span className="font-medium">{item[f.key]}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {openFields.some(f => item[f.key]) && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">文字反馈</p>
                                <div className="space-y-2">
                                  {openFields.filter(f => item[f.key]).map(f => (
                                    <div key={f.key} className="text-sm">
                                      <p className="text-xs font-medium text-primary mb-0.5">{f.label}</p>
                                      <p className="text-foreground whitespace-pre-wrap pl-2 border-l-2 border-border">{item[f.key]}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_verified') === 'true');
  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;
  return <AdminDashboard />;
}
