import { supabase } from '@/integrations/supabase/client';

export type PastoralRole = 'admin' | 'visit';

const KEYS: Record<PastoralRole, string> = {
  admin: 'admin_password',
  visit: 'visit_password',
};

export const getPastoralPassword = (role: PastoralRole) => sessionStorage.getItem(KEYS[role]) ?? '';
export const setPastoralPassword = (role: PastoralRole, password: string) =>
  sessionStorage.setItem(KEYS[role], password);
export const clearPastoralPassword = (role: PastoralRole) => sessionStorage.removeItem(KEYS[role]);

export async function pastoralApi<T = any>(
  action: string,
  payload: Record<string, unknown> = {},
  role: PastoralRole = 'admin',
  passwordOverride?: string,
): Promise<T> {
  const password = passwordOverride ?? getPastoralPassword(role);
  const { data, error } = await supabase.functions.invoke('pastoral-api', {
    body: { password, action, payload },
  });
  if (error) {
    // Supabase wraps non-2xx as FunctionsHttpError; try to read the server message.
    let message = error.message;
    const ctx = (error as any).context;
    if (ctx?.json) {
      try {
        const body = await ctx.json();
        if (body?.error) message = body.error;
      } catch { /* ignore */ }
    }
    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error);
  return data as T;
}

/* ── 中文标签 ── */
export const MEMBER_STATUS_LABELS: Record<string, string> = {
  active: '在册会友',
  inactive: '暂停聚会',
  transferred: '转出',
  disciplined: '受劝惩',
  deceased: '已故',
  removed: '除籍',
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  pending: '待处理',
  reviewing: '面谈中',
  approved: '已通过',
  rejected: '未通过',
};

export const VISIT_METHOD_LABELS: Record<string, string> = {
  home: '登门探访',
  hospital: '医院探访',
  phone: '电话/视频',
  church: '教会面谈',
  other: '其他',
};

export const RELATIONSHIP_OPTIONS = ['户主', '配偶', '子女', '父母', '兄弟姐妹', '其他亲属', '同住', '其他'];

export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  gift: '礼品/慰问',
  transport: '交通',
  meal: '餐饮',
  medical: '医疗补助',
  other: '其他',
};
