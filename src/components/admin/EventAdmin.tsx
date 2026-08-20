import { useCallback, useEffect, useMemo, useState } from 'react';
import { pastoralApi } from '@/lib/pastoral';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Loader2, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Registration = {
  id: string;
  event_name: string;
  student_name_zh: string;
  student_name_en: string | null;
  grade: string | null;
  group_level: string | null;
  age: number | null;
  guardian_name: string;
  relation: string | null;
  relation_other: string | null;
  phone: string;
  backup_contact_name: string | null;
  backup_contact_phone: string | null;
  has_special_notes: boolean;
  special_notes: string | null;
  transport_option: string;
  carpool_parent_name: string | null;
  carpool_parent_child: string | null;
  carpool_parent_phone: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

const TRANSPORT_LABELS: Record<string, string> = {
  self: '家长自行接送',
  carpool: '搭乘其他家长车辆',
  undecided: '暂未确定车辆',
};

const STATUS_LABELS: Record<string, string> = {
  pending: '待确认',
  confirmed: '已确认',
  cancelled: '已取消',
};

const CSV_COLUMNS: [keyof Registration | 'transport_label' | 'submitted_at', string][] = [
  ['event_name', '活动名称'],
  ['student_name_zh', '学生中文姓名'],
  ['student_name_en', '学生英文名'],
  ['group_level', '组别'],
  ['grade', '年级'],
  ['age', '年龄'],
  ['guardian_name', '家长姓名'],
  ['relation', '与孩子关系'],
  ['relation_other', '关系补充'],
  ['phone', '联系电话'],
  ['backup_contact_name', '备用紧急联系人'],
  ['backup_contact_phone', '备用联系人电话'],
  ['has_special_notes', '有特别注意事项'],
  ['special_notes', '特别注意事项'],
  ['transport_label', '交通方式'],
  ['carpool_parent_name', '同行家长'],
  ['carpool_parent_child', '同行家长孩子'],
  ['carpool_parent_phone', '同行家长电话'],
  ['status', '状态'],
  ['admin_notes', '同工备注'],
  ['submitted_at', '提交时间'],
];

export default function EventAdmin() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Registration[]>([]);
  const [groupFilter, setGroupFilter] = useState('all');
  const [transportFilter, setTransportFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pastoralApi<{ registrations: Registration[] }>('events.list');
      setRows(res.registrations ?? []);
    } catch (e) {
      toast({ title: '加载失败', description: (e as Error).message, variant: 'destructive' });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(
    () => rows.filter(r =>
      (groupFilter === 'all' || r.group_level === groupFilter) &&
      (transportFilter === 'all' || r.transport_option === transportFilter)),
    [rows, groupFilter, transportFilter],
  );

  const stats = useMemo(() => ({
    total: rows.length,
    groups: GROUPS.map(g => ({ g, n: rows.filter(r => r.group_level === g).length })),
    transport: Object.keys(TRANSPORT_LABELS).map(t => ({ t, n: rows.filter(r => r.transport_option === t).length })),
    notes: rows.filter(r => r.has_special_notes).length,
  }), [rows]);

  const update = async (id: string, patch: Partial<Registration>) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
    try {
      await pastoralApi('events.update', { id, ...patch });
    } catch (e) {
      toast({ title: '保存失败', description: (e as Error).message, variant: 'destructive' });
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm('确定删除这条报名记录？')) return;
    try {
      await pastoralApi('events.delete', { id });
      setRows(prev => prev.filter(r => r.id !== id));
      toast({ title: '已删除' });
    } catch (e) {
      toast({ title: '删除失败', description: (e as Error).message, variant: 'destructive' });
    }
  };

  const exportCsv = () => {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [CSV_COLUMNS.map(([, label]) => esc(label)).join(',')];
    for (const r of filtered) {
      lines.push(CSV_COLUMNS.map(([key]) => {
        if (key === 'transport_label') return esc(TRANSPORT_LABELS[r.transport_option] ?? r.transport_option);
        if (key === 'submitted_at') return esc(new Date(r.created_at).toLocaleString('zh-CN'));
        if (key === 'has_special_notes') return esc(r.has_special_notes ? '是' : '否');
        if (key === 'status') return esc(STATUS_LABELS[r.status] ?? r.status);
        return esc(r[key as keyof Registration]);
      }).join(','));
    }
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `活动报名_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">报名总数</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">需注意事项</p><p className="text-2xl font-bold">{stats.notes}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground mb-1">分组人数</p>
          {stats.groups.map(({ g, n }) => <p key={g} className="text-sm">{g}：<span className="font-semibold">{n}</span></p>)}
        </CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground mb-1">交通方式</p>
          {stats.transport.map(({ t, n }) => <p key={t} className="text-sm">{TRANSPORT_LABELS[t]}：<span className="font-semibold">{n}</span></p>)}
        </CardContent></Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部组别</SelectItem>
            {GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={transportFilter} onValueChange={setTransportFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部交通方式</SelectItem>
            {Object.entries(TRANSPORT_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={load}><RefreshCw className="h-4 w-4 mr-2" />刷新</Button>
        <Button onClick={exportCsv}><Download className="h-4 w-4 mr-2" />导出 CSV（{filtered.length}）</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">暂无报名记录</p>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => (
            <Card key={r.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex flex-wrap items-center gap-2">
                  {r.student_name_zh}
                  {r.student_name_en && <span className="text-muted-foreground font-normal">{r.student_name_en}</span>}
                  <span className="text-xs px-2 py-0.5 rounded bg-secondary">{r.group_level}</span>
                  {r.age && <span className="text-xs text-muted-foreground">{r.age} 岁 · {r.grade}</span>}
                  {r.has_special_notes && (
                    <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />需注意
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1">
                  <p><span className="text-muted-foreground">家长：</span>{r.guardian_name}（{r.relation === '其他' ? r.relation_other : r.relation}）</p>
                  <p><span className="text-muted-foreground">电话：</span>{r.phone}</p>
                  <p><span className="text-muted-foreground">紧急联系人：</span>{r.backup_contact_name} {r.backup_contact_phone}</p>
                  <p><span className="text-muted-foreground">交通：</span>{TRANSPORT_LABELS[r.transport_option] ?? r.transport_option}</p>
                  {r.transport_option === 'carpool' && (
                    <p className="sm:col-span-2"><span className="text-muted-foreground">同行家长：</span>{r.carpool_parent_name} · 孩子 {r.carpool_parent_child} · {r.carpool_parent_phone}</p>
                  )}
                  <p className="sm:col-span-2"><span className="text-muted-foreground">提交时间：</span>{new Date(r.created_at).toLocaleString('zh-CN')}</p>
                </div>
                {r.has_special_notes && r.special_notes && (
                  <p className="rounded-md bg-secondary p-3"><span className="text-muted-foreground">特别注意：</span>{r.special_notes}</p>
                )}
                <div className="grid sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <Label className="text-xs">状态</Label>
                    <Select value={r.status} onValueChange={v => update(r.id, { status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs">同工备注</Label>
                    <Textarea
                      rows={2}
                      defaultValue={r.admin_notes ?? ''}
                      onBlur={e => e.target.value !== (r.admin_notes ?? '') && update(r.id, { admin_notes: e.target.value })}
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => remove(r.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />删除记录
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const GROUPS = ['小学组', '初中组', '高中组'];
