import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Eye, Loader2, Users, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Group { id: string; name: string; leader: string; description: string; sort_order: number; }

interface Member {
  id: string; full_name: string; nickname: string | null; gender: string | null;
  birth_date: string | null; school: string | null; grade: string | null; contact: string | null;
  faith_status: string | null; attendance: string | null;
  interests: unknown; interests_other: string | null; service_interests: unknown;
  fellowship_hope: string | null;
  guardian_name: string | null; guardian_relation: string | null; guardian_contact: string | null;
  guardian_consent: boolean; contact_consent: boolean;
  profile_status: string; first_attended_date: string | null;
  group_id: string | null; mentor: string | null; growth_stage: string | null;
  current_serving: string | null; follow_up: string | null; care_notes: string | null;
  created_at: string;
}

interface VolunteerApp {
  id: string; full_name: string; gender: string | null; age: number | null; contact: string;
  church_relation: string | null; church_relation_other: string | null;
  faith_years: string | null; baptized: string | null; motivation: string | null;
  has_experience: string | null; experience_detail: string | null;
  skill_areas: unknown; skill_areas_other: string | null; desired_roles: unknown;
  available_times: unknown; available_times_other: string | null;
  monthly_frequency: string | null; commit_half_year: string | null; agree_training: boolean;
  status: string; admin_notes: string | null; created_at: string;
}

const list = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
const GROWTH_STAGES = ['初信 / 慕道', '稳定成长', '愿意服侍', '带领同工'];
const PROFILE_STATUS = [
  { v: 'active', l: '正常聚会' },
  { v: 'paused', l: '暂停 / 中断' },
  { v: 'left', l: '已离开' },
];
const APP_STATUS = [
  { v: 'new', l: '待处理' },
  { v: 'interviewing', l: '约谈中' },
  { v: 'approved', l: '已通过' },
  { v: 'declined', l: '暂不安排' },
];

const Field = ({ label, value }: { label: string; value?: string | null }) =>
  value ? <div><span className="text-muted-foreground">{label}：</span>{value}</div> : null;

export default function YouthAdmin() {
  const { toast } = useToast();
  const [tab, setTab] = useState('members');
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [apps, setApps] = useState<VolunteerApp[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [groupFilter, setGroupFilter] = useState('all');
  const [drafts, setDrafts] = useState<Record<string, Partial<Member>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [newGroup, setNewGroup] = useState({ name: '', leader: '' });

  const fetchAll = useCallback(async () => {
    const [g, m, a] = await Promise.all([
      supabase.from('youth_groups').select('*').order('sort_order'),
      supabase.from('youth_members').select('*').order('created_at', { ascending: false }),
      supabase.from('youth_volunteer_applications').select('*').order('created_at', { ascending: false }),
    ]);
    if (g.data) setGroups(g.data as Group[]);
    if (m.data) setMembers(m.data as Member[]);
    if (a.data) setApps(a.data as VolunteerApp[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const draftOf = (m: Member) => ({ ...m, ...drafts[m.id] });
  const setDraft = (id: string, patch: Partial<Member>) =>
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const saveMember = async (m: Member) => {
    const d = drafts[m.id];
    if (!d) return;
    setSavingId(m.id);
    const { error } = await supabase.from('youth_members').update(d as never).eq('id', m.id);
    setSavingId(null);
    if (error) { toast({ title: '保存失败', variant: 'destructive' }); return; }
    setDrafts(prev => { const n = { ...prev }; delete n[m.id]; return n; });
    toast({ title: '已保存' });
    fetchAll();
  };

  const deleteMember = async (id: string) => {
    if (!confirm('确定删除此青少年档案？')) return;
    const { error } = await supabase.from('youth_members').delete().eq('id', id);
    if (error) toast({ title: '删除失败', variant: 'destructive' });
    else { toast({ title: '已删除' }); fetchAll(); }
  };

  const updateAppStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('youth_volunteer_applications').update({ status }).eq('id', id);
    if (error) toast({ title: '更新失败', variant: 'destructive' }); else { toast({ title: '状态已更新' }); fetchAll(); }
  };

  const deleteApp = async (id: string) => {
    if (!confirm('确定删除此申请？')) return;
    const { error } = await supabase.from('youth_volunteer_applications').delete().eq('id', id);
    if (error) toast({ title: '删除失败', variant: 'destructive' }); else { toast({ title: '已删除' }); fetchAll(); }
  };

  const addGroup = async () => {
    if (!newGroup.name.trim()) return;
    const { error } = await supabase.from('youth_groups').insert({
      name: newGroup.name.trim(), leader: newGroup.leader.trim(), sort_order: groups.length + 1,
    });
    if (error) toast({ title: '添加失败', variant: 'destructive' });
    else { setNewGroup({ name: '', leader: '' }); toast({ title: '小组已添加' }); fetchAll(); }
  };

  const saveGroup = async (g: Group) => {
    const { error } = await supabase.from('youth_groups').update({ name: g.name, leader: g.leader }).eq('id', g.id);
    if (error) toast({ title: '保存失败', variant: 'destructive' }); else { toast({ title: '已保存' }); fetchAll(); }
  };

  const deleteGroup = async (id: string) => {
    if (!confirm('确定删除此小组？组内青少年将变为未分组。')) return;
    const { error } = await supabase.from('youth_groups').delete().eq('id', id);
    if (error) toast({ title: '删除失败', variant: 'destructive' }); else { toast({ title: '已删除' }); fetchAll(); }
  };

  const groupName = (id: string | null) => groups.find(g => g.id === id)?.name || '未分组';
  const filteredMembers = groupFilter === 'all' ? members
    : groupFilter === 'none' ? members.filter(m => !m.group_id)
    : members.filter(m => m.group_id === groupFilter);

  if (loading) return <div className="text-center py-12 text-muted-foreground">加载中...</div>;

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="members">青少年档案 ({members.length})</TabsTrigger>
        <TabsTrigger value="apps">
          同工申请 ({apps.length})
          {apps.filter(a => a.status === 'new').length > 0 && (
            <span className="ml-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5 leading-none">
              {apps.filter(a => a.status === 'new').length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="groups">小组设置 ({groups.length})</TabsTrigger>
      </TabsList>

      {/* ── Youth profiles & group assignment ── */}
      <TabsContent value="members">
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部小组</SelectItem>
              <SelectItem value="none">未分组</SelectItem>
              {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            共 {filteredMembers.length} 人 · 未分组 {members.filter(m => !m.group_id).length} 人
          </div>
        </div>

        {/* Group overview */}
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {groups.map(g => (
            <Card key={g.id}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 font-medium"><Users className="h-4 w-4 text-accent" /> {g.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  负责同工：{g.leader || '未指派'} · {members.filter(m => m.group_id === g.id).length} 人
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 ? <div className="text-center py-12 text-muted-foreground">暂无档案</div> : (
          <div className="space-y-3">
            {filteredMembers.map(m => {
              const d = draftOf(m);
              const dirty = !!drafts[m.id];
              return (
                <Card key={m.id}>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="font-medium">
                          {m.full_name}{m.nickname ? `（${m.nickname}）` : ''}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {m.gender || ''} {m.grade || ''} · {groupName(m.group_id)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          提交于 {new Date(m.created_at).toLocaleDateString('zh-CN')} · {m.faith_status || '信仰状况未填'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                          <Eye className="h-4 w-4 mr-1" /> {expanded === m.id ? '收起' : '详情'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteMember(m.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>

                    {/* Assignment controls */}
                    <div className="grid sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
                      <div>
                        <Label className="text-xs">所属小组</Label>
                        <Select value={d.group_id || 'none'} onValueChange={v => setDraft(m.id, { group_id: v === 'none' ? null : v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">未分组</SelectItem>
                            {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">跟进同工</Label>
                        <Input value={d.mentor || ''} onChange={e => setDraft(m.id, { mentor: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-xs">成长阶段</Label>
                        <Select value={d.growth_stage || ''} onValueChange={v => setDraft(m.id, { growth_stage: v })}>
                          <SelectTrigger><SelectValue placeholder="未设置" /></SelectTrigger>
                          <SelectContent>{GROWTH_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">档案状态</Label>
                        <Select value={d.profile_status} onValueChange={v => setDraft(m.id, { profile_status: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{PROFILE_STATUS.map(s => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs">目前服侍岗位</Label>
                        <Input value={d.current_serving || ''} onChange={e => setDraft(m.id, { current_serving: e.target.value })} />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs">跟进事项</Label>
                        <Input value={d.follow_up || ''} onChange={e => setDraft(m.id, { follow_up: e.target.value })} />
                      </div>
                      <div className="sm:col-span-4">
                        <Label className="text-xs">关怀记录</Label>
                        <Textarea rows={2} value={d.care_notes || ''} onChange={e => setDraft(m.id, { care_notes: e.target.value })} />
                      </div>
                      {dirty && (
                        <div className="sm:col-span-4">
                          <Button size="sm" onClick={() => saveMember(m)} disabled={savingId === m.id}>
                            {savingId === m.id ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />} 保存修改
                          </Button>
                        </div>
                      )}
                    </div>

                    {expanded === m.id && (
                      <div className="mt-4 pt-4 border-t border-border text-sm space-y-1">
                        <Field label="出生日期" value={m.birth_date} />
                        <Field label="学校" value={m.school} />
                        <Field label="联系方式" value={m.contact} />
                        <Field label="聚会情况" value={m.attendance} />
                        {list(m.interests).length > 0 && <div><span className="text-muted-foreground">兴趣：</span>{list(m.interests).join('、')}{m.interests_other ? `（${m.interests_other}）` : ''}</div>}
                        {list(m.service_interests).length > 0 && <div><span className="text-muted-foreground">愿意服侍：</span>{list(m.service_interests).join('、')}</div>}
                        <Field label="团契期待" value={m.fellowship_hope} />
                        <Field label="家长" value={m.guardian_name ? `${m.guardian_name} ${m.guardian_relation || ''} ${m.guardian_contact || ''}` : null} />
                        <div className="text-muted-foreground">
                          家长同意：{m.guardian_consent ? '是' : '否'} · 同意联络：{m.contact_consent ? '是' : '否'}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </TabsContent>

      {/* ── Volunteer applications ── */}
      <TabsContent value="apps">
        {apps.length === 0 ? <div className="text-center py-12 text-muted-foreground">暂无申请</div> : (
          <div className="space-y-3">
            {apps.map(a => (
              <Card key={a.id}>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-medium">
                        {a.full_name}
                        <span className="ml-2 text-xs text-muted-foreground">{a.gender || ''} {a.age ? `${a.age}岁` : ''} · {a.contact}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        提交于 {new Date(a.created_at).toLocaleDateString('zh-CN')} · {a.church_relation || ''} · 信主{a.faith_years || '—'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={a.status} onValueChange={v => updateAppStatus(a.id, v)}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>{APP_STATUS.map(s => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}</SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                        <Eye className="h-4 w-4 mr-1" /> {expanded === a.id ? '收起' : '详情'}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteApp(a.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  {expanded === a.id && (
                    <div className="mt-4 pt-4 border-t border-border text-sm space-y-1">
                      <Field label="是否受洗" value={a.baptized} />
                      <Field label="服侍心志" value={a.motivation} />
                      <Field label="服侍经验" value={a.has_experience === '有' ? a.experience_detail || '有' : a.has_experience} />
                      {list(a.skill_areas).length > 0 && <div><span className="text-muted-foreground">擅长领域：</span>{list(a.skill_areas).join('、')}{a.skill_areas_other ? `（${a.skill_areas_other}）` : ''}</div>}
                      {list(a.desired_roles).length > 0 && <div><span className="text-muted-foreground">意愿岗位：</span>{list(a.desired_roles).join('、')}</div>}
                      {list(a.available_times).length > 0 && <div><span className="text-muted-foreground">可参与时间：</span>{list(a.available_times).join('、')}{a.available_times_other ? `（${a.available_times_other}）` : ''}</div>}
                      <Field label="服侍频率" value={a.monthly_frequency} />
                      <Field label="半年委身" value={a.commit_half_year} />
                      <div className="text-muted-foreground">同意参加培训与同工会：{a.agree_training ? '是' : '否'}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      {/* ── Groups ── */}
      <TabsContent value="groups">
        <Card className="mb-4">
          <CardContent className="pt-4 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[160px]">
              <Label className="text-xs">小组名称</Label>
              <Input value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} placeholder="例：高中男生组" />
            </div>
            <div className="flex-1 min-w-[160px]">
              <Label className="text-xs">负责同工</Label>
              <Input value={newGroup.leader} onChange={e => setNewGroup({ ...newGroup, leader: e.target.value })} />
            </div>
            <Button onClick={addGroup}><Plus className="h-4 w-4 mr-1" /> 添加小组</Button>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {groups.map(g => (
            <Card key={g.id}>
              <CardContent className="pt-4 flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[160px]">
                  <Label className="text-xs">小组名称</Label>
                  <Input value={g.name} onChange={e => setGroups(gs => gs.map(x => x.id === g.id ? { ...x, name: e.target.value } : x))} />
                </div>
                <div className="flex-1 min-w-[160px]">
                  <Label className="text-xs">负责同工</Label>
                  <Input value={g.leader} onChange={e => setGroups(gs => gs.map(x => x.id === g.id ? { ...x, leader: e.target.value } : x))} />
                </div>
                <div className="text-sm text-muted-foreground pb-2">{members.filter(m => m.group_id === g.id).length} 人</div>
                <Button variant="outline" size="sm" onClick={() => saveGroup(g)}><Save className="h-4 w-4 mr-1" /> 保存</Button>
                <Button variant="ghost" size="sm" onClick={() => deleteGroup(g.id)}><Trash2 className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
