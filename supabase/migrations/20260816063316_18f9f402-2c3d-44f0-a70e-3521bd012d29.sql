-- ============ 人员库 ============
CREATE TABLE public.people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text NOT NULL,
  gender text,
  birth_date date,
  phone text,
  wechat text,
  email text,
  photo_url text,
  occupation text,
  marital_status text,
  address text,
  notes text,
  group_id uuid REFERENCES public.youth_groups(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_people_phone ON public.people (phone);
CREATE INDEX idx_people_email ON public.people (email);
CREATE INDEX idx_people_name ON public.people (full_name);
GRANT ALL ON public.people TO service_role;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

-- ============ 家庭 ============
CREATE TABLE public.households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_name text NOT NULL,
  primary_contact_id uuid REFERENCES public.people(id) ON DELETE SET NULL,
  address text,
  group_id uuid REFERENCES public.youth_groups(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.households TO service_role;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.household_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  relationship text NOT NULL DEFAULT '其他',
  is_primary_contact boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (household_id, person_id)
);
CREATE INDEX idx_household_members_person ON public.household_members (person_id);
GRANT ALL ON public.household_members TO service_role;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;

-- ============ 会友申请 ============
CREATE TABLE public.member_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  gender text,
  birth_date date,
  phone text NOT NULL DEFAULT '',
  wechat text,
  email text,
  marital_status text,
  occupation text,
  is_believer text,
  faith_date date,
  is_baptized text,
  baptism_date date,
  baptism_church text,
  attending_duration text,
  current_group text,
  agrees_confession text,
  reason text,
  agrees_covenant boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  internal_notes text,
  person_id uuid REFERENCES public.people(id) ON DELETE SET NULL,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.member_applications TO anon, authenticated;
GRANT ALL ON public.member_applications TO service_role;
ALTER TABLE public.member_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a member application"
  ON public.member_applications FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ============ 正式会友 ============
CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL UNIQUE REFERENCES public.people(id) ON DELETE CASCADE,
  member_number text,
  member_status text NOT NULL DEFAULT 'active',
  joined_at date,
  baptism_status text,
  baptism_date date,
  baptism_church text,
  faith_date date,
  application_id uuid REFERENCES public.member_applications(id) ON DELETE SET NULL,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.members TO service_role;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.member_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  effective_date date NOT NULL DEFAULT CURRENT_DATE,
  reason text,
  note text,
  changed_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_member_status_history_member ON public.member_status_history (member_id);
GRANT ALL ON public.member_status_history TO service_role;
ALTER TABLE public.member_status_history ENABLE ROW LEVEL SECURITY;

-- ============ 探访同工名单 ============
CREATE TABLE public.visit_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_title text,
  person_id uuid REFERENCES public.people(id) ON DELETE SET NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.visit_staff TO service_role;
ALTER TABLE public.visit_staff ENABLE ROW LEVEL SECURITY;

-- ============ 探访 ============
CREATE TABLE public.visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_type text NOT NULL DEFAULT 'household',
  household_id uuid REFERENCES public.households(id) ON DELETE SET NULL,
  primary_person_id uuid REFERENCES public.people(id) ON DELETE SET NULL,
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  visit_time time,
  visit_method text NOT NULL DEFAULT 'home',
  notes text,
  recorder_id uuid REFERENCES public.visit_staff(id) ON DELETE SET NULL,
  recorder_name text,
  follow_up_required boolean NOT NULL DEFAULT false,
  follow_up_date date,
  follow_up_note text,
  follow_up_status text NOT NULL DEFAULT 'none',
  follow_up_completed_by text,
  follow_up_completed_at date,
  follow_up_completed_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_visits_date ON public.visits (visit_date DESC);
CREATE INDEX idx_visits_household ON public.visits (household_id);
GRANT ALL ON public.visits TO service_role;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.visit_people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (visit_id, person_id)
);
CREATE INDEX idx_visit_people_person ON public.visit_people (person_id);
GRANT ALL ON public.visit_people TO service_role;
ALTER TABLE public.visit_people ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.visit_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
  visitor_id uuid REFERENCES public.visit_staff(id) ON DELETE SET NULL,
  visitor_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_visit_visitors_visit ON public.visit_visitors (visit_id);
GRANT ALL ON public.visit_visitors TO service_role;
ALTER TABLE public.visit_visitors ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.visit_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
  expense_type text,
  description text NOT NULL DEFAULT '',
  amount numeric(12,2) NOT NULL DEFAULT 0,
  paid_by text,
  reimbursement_status text NOT NULL DEFAULT 'none',
  reimbursement_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_visit_expenses_visit ON public.visit_expenses (visit_id);
GRANT ALL ON public.visit_expenses TO service_role;
ALTER TABLE public.visit_expenses ENABLE ROW LEVEL SECURITY;

-- ============ updated_at 触发器 ============
CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON public.people
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON public.households
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_member_applications_updated_at BEFORE UPDATE ON public.member_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_visit_staff_updated_at BEFORE UPDATE ON public.visit_staff
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
