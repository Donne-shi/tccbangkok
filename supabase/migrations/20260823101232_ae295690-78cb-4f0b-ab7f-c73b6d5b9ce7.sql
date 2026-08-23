-- 财务同工名单
CREATE TABLE public.finance_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  staff_role text NOT NULL DEFAULT 'approver',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.finance_staff TO service_role;
ALTER TABLE public.finance_staff ENABLE ROW LEVEL SECURITY;

-- 报销申请
CREATE TABLE public.expense_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'THB',
  payer_name text NOT NULL,
  purpose text NOT NULL,
  spent_on date,
  receipt_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  submitter_name text NOT NULL,
  submitter_contact text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  approver1_name text,
  approver1_at timestamptz,
  approver1_note text,
  approver2_name text,
  approver2_at timestamptz,
  approver2_note text,
  rejected_by text,
  rejected_at timestamptz,
  reject_reason text,
  paid_by text,
  paid_at timestamptz,
  payment_method text,
  payment_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.expense_claims TO service_role;
ALTER TABLE public.expense_claims ENABLE ROW LEVEL SECURITY;

CREATE INDEX expense_claims_status_idx ON public.expense_claims (status, created_at DESC);

-- 流程日志
CREATE TABLE public.expense_claim_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id uuid NOT NULL REFERENCES public.expense_claims(id) ON DELETE CASCADE,
  action text NOT NULL,
  actor text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.expense_claim_events TO service_role;
ALTER TABLE public.expense_claim_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX expense_claim_events_claim_idx ON public.expense_claim_events (claim_id, created_at);

CREATE TRIGGER update_finance_staff_updated_at BEFORE UPDATE ON public.finance_staff
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_expense_claims_updated_at BEFORE UPDATE ON public.expense_claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();