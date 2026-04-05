import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, X, Lock, Upload, Edit2, Music, Video, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkItem { title: string; url: string; }

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
        const fileName = `${Date.now()}_${pptFile.name}`;
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
        const audioName = `${Date.now()}_${audioFile.name}`;
        const { error: ae } = await supabase.storage.from('sermon-audio').upload(audioName, audioFile);
        if (ae) throw ae;
        audioUrl = supabase.storage.from('sermon-audio').getPublicUrl(audioName).data.publicUrl;
      }
      let pptUrl = existingPptUrl;
      if (pptFile) {
        const fileName = `sermons/${Date.now()}_${pptFile.name}`;
        const { error: ue } = await supabase.storage.from('sunday-school-files').upload(fileName, pptFile);
        if (ue) throw ue;
        pptUrl = supabase.storage.from('sunday-school-files').getPublicUrl(fileName).data.publicUrl;
      }
      const slug = initial?.slug || `${date}-${titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
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
        <Input value={titleEn} onChange={e => setTitleEn(e.target.value)} required placeholder="English Title" />
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

/* ── Admin Dashboard ── */
function AdminDashboard() {
  const { toast } = useToast();
  const [mainTab, setMainTab] = useState('sunday-school');

  // Sunday School state
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

  useEffect(() => { fetchSS(); fetchSermons(); }, [fetchSS, fetchSermons]);

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

  const ssFiltered = ssContents.filter(c => c.category === ssTab);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <h1 className="text-lg font-bold">教会内容管理</h1>
        <Button variant="secondary" size="sm" onClick={() => { sessionStorage.removeItem('admin_verified'); window.location.reload(); }}>退出</Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Tabs value={mainTab} onValueChange={setMainTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="sunday-school">主日学管理</TabsTrigger>
            <TabsTrigger value="sermons">讲道管理</TabsTrigger>
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
