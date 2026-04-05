import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, X, Lock, Upload, Edit2, Music, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkItem {
  title: string;
  url: string;
}

interface ContentItem {
  id: string;
  category: string;
  title: string;
  date: string;
  year: number;
  summary: string | null;
  ppt_url: string | null;
  song_links: LinkItem[];
  video_links: LinkItem[];
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('verify-admin', {
        body: { password },
      });

      if (fnError) throw fnError;
      if (data?.valid) {
        sessionStorage.setItem('admin_verified', 'true');
        onLogin();
      } else {
        setError('密码错误');
      }
    } catch {
      setError('验证失败，请稍后重试');
    }
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
            <Input
              type="password"
              placeholder="管理密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '验证中...' : '登录'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ContentForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: ContentItem;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { toast } = useToast();
  const [category, setCategory] = useState(initial?.category || 'youth');
  const [title, setTitle] = useState(initial?.title || '');
  const [date, setDate] = useState(initial?.date || '');
  const [summary, setSummary] = useState(initial?.summary || '');
  const [songLinks, setSongLinks] = useState<LinkItem[]>(initial?.song_links || []);
  const [videoLinks, setVideoLinks] = useState<LinkItem[]>(initial?.video_links || []);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [existingPptUrl, setExistingPptUrl] = useState(initial?.ppt_url || '');

  const addLink = (type: 'song' | 'video') => {
    const setter = type === 'song' ? setSongLinks : setVideoLinks;
    setter(prev => [...prev, { title: '', url: '' }]);
  };

  const updateLink = (type: 'song' | 'video', index: number, field: 'title' | 'url', value: string) => {
    const setter = type === 'song' ? setSongLinks : setVideoLinks;
    setter(prev => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const removeLink = (type: 'song' | 'video', index: number) => {
    const setter = type === 'song' ? setSongLinks : setVideoLinks;
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let pptUrl = existingPptUrl;

      if (pptFile) {
        const fileName = `${Date.now()}_${pptFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('sunday-school-files')
          .upload(fileName, pptFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('sunday-school-files')
          .getPublicUrl(fileName);
        pptUrl = urlData.publicUrl;
      }

      const year = new Date(date).getFullYear();
      const record = {
        category,
        title: title.trim(),
        date,
        year,
        summary: summary.trim() || null,
        ppt_url: pptUrl || null,
        song_links: JSON.parse(JSON.stringify(songLinks.filter(l => l.title && l.url))),
        video_links: JSON.parse(JSON.stringify(videoLinks.filter(l => l.title && l.url))),
      };

      if (initial) {
        const { error } = await supabase
          .from('sunday_school_content')
          .update(record)
          .eq('id', initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sunday_school_content')
          .insert(record);
        if (error) throw error;
      }

      toast({ title: initial ? '更新成功' : '添加成功' });
      onSave();
    } catch (err: any) {
      toast({ title: '保存失败', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>分类</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="youth">青少年主日学</SelectItem>
              <SelectItem value="children">儿童主日学</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>日期</Label>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
      </div>

      <div>
        <Label>标题</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="课程标题" />
      </div>

      <div>
        <Label>摘要</Label>
        <Textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="课程简要描述" rows={3} />
      </div>

      <div>
        <Label>PPT文件</Label>
        {existingPptUrl && !pptFile && (
          <p className="text-xs text-muted-foreground mb-1">已有文件，上传新文件将替换</p>
        )}
        <Input type="file" accept=".ppt,.pptx,.pdf" onChange={e => setPptFile(e.target.files?.[0] || null)} />
      </div>

      {/* Song links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="flex items-center gap-1"><Music className="h-4 w-4" /> 诗歌链接</Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => addLink('song')}>
            <Plus className="h-4 w-4 mr-1" /> 添加
          </Button>
        </div>
        {songLinks.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input placeholder="名称" value={link.title} onChange={e => updateLink('song', i, 'title', e.target.value)} className="flex-1" />
            <Input placeholder="链接URL" value={link.url} onChange={e => updateLink('song', i, 'url', e.target.value)} className="flex-1" />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeLink('song', i)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Video links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="flex items-center gap-1"><Video className="h-4 w-4" /> 视频链接</Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => addLink('video')}>
            <Plus className="h-4 w-4 mr-1" /> 添加
          </Button>
        </div>
        {videoLinks.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input placeholder="名称" value={link.title} onChange={e => updateLink('video', i, 'title', e.target.value)} className="flex-1" />
            <Input placeholder="链接URL" value={link.url} onChange={e => updateLink('video', i, 'url', e.target.value)} className="flex-1" />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeLink('video', i)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? '保存中...' : initial ? '更新' : '添加'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
      </div>
    </form>
  );
}

function AdminDashboard() {
  const { toast } = useToast();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ContentItem | undefined>();
  const [activeTab, setActiveTab] = useState('youth');

  const fetchContents = useCallback(async () => {
    const { data, error } = await supabase
      .from('sunday_school_content')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) {
      setContents(data.map(item => ({
        ...item,
        song_links: (item.song_links as any) || [],
        video_links: (item.video_links as any) || [],
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchContents(); }, [fetchContents]);

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此内容？')) return;
    const { error } = await supabase.from('sunday_school_content').delete().eq('id', id);
    if (error) {
      toast({ title: '删除失败', variant: 'destructive' });
    } else {
      toast({ title: '已删除' });
      fetchContents();
    }
  };

  const filtered = contents.filter(c => c.category === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <h1 className="text-lg font-bold">主日学内容管理</h1>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            sessionStorage.removeItem('admin_verified');
            window.location.reload();
          }}
        >
          退出
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {showForm || editing ? (
          <Card>
            <CardHeader>
              <CardTitle>{editing ? '编辑内容' : '添加新内容'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentForm
                initial={editing}
                onSave={() => {
                  setShowForm(false);
                  setEditing(undefined);
                  fetchContents();
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditing(undefined);
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="youth">青少年主日学</TabsTrigger>
                  <TabsTrigger value="children">儿童主日学</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-1" /> 添加内容
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">加载中...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">暂无内容，点击"添加内容"开始</div>
            ) : (
              <div className="space-y-3">
                {filtered.map(item => (
                  <Card key={item.id}>
                    <CardContent className="py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          {item.ppt_url && <span className="flex items-center gap-1"><Upload className="h-3 w-3" /> PPT</span>}
                          {item.song_links.length > 0 && <span className="flex items-center gap-1"><Music className="h-3 w-3" /> {item.song_links.length}首诗歌</span>}
                          {item.video_links.length > 0 && <span className="flex items-center gap-1"><Video className="h-3 w-3" /> {item.video_links.length}个视频</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(item)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_verified') === 'true');

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;
  return <AdminDashboard />;
}
