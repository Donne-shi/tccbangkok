-- 1. 系统设置（年龄分段可配置）
CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.app_settings (key, value) VALUES
  ('age_groups', '{"child_max": 11, "youth_max": 17}'::jsonb);

-- 2. 年龄 / 年龄分类函数
CREATE OR REPLACE FUNCTION public.calc_age(_birth_date date)
RETURNS integer LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE WHEN _birth_date IS NULL THEN NULL
    ELSE date_part('year', age(current_date, _birth_date))::int END
$$;

CREATE OR REPLACE FUNCTION public.age_group(_birth_date date)
RETURNS text LANGUAGE plpgsql STABLE SET search_path = public AS $$
DECLARE
  cfg jsonb;
  child_max int := 11;
  youth_max int := 17;
  a int;
BEGIN
  IF _birth_date IS NULL THEN RETURN NULL; END IF;
  SELECT value INTO cfg FROM public.app_settings WHERE key = 'age_groups';
  IF cfg IS NOT NULL THEN
    child_max := COALESCE((cfg->>'child_max')::int, child_max);
    youth_max := COALESCE((cfg->>'youth_max')::int, youth_max);
  END IF;
  a := public.calc_age(_birth_date);
  IF a <= child_max THEN RETURN 'child';
  ELSIF a <= youth_max THEN RETURN 'youth';
  ELSE RETURN 'adult';
  END IF;
END;
$$;

-- 3. 家庭会友申请（以家庭为单位）
CREATE TABLE public.household_membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_name text NOT NULL,
  applicant_name text NOT NULL,
  phone text NOT NULL,
  wechat text,
  email text,
  address text,
  marital_status text,
  current_group text,
  attending_duration text,
  agrees_confession text,
  reason text,
  extra_info text,
  agrees_covenant boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  internal_notes text,
  household_id uuid REFERENCES public.households(id) ON DELETE SET NULL,
  profile_token text NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  profile_submitted_at timestamptz,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX household_applications_token_idx ON public.household_membership_applications(profile_token);
GRANT INSERT ON public.household_membership_applications TO anon, authenticated;
GRANT ALL ON public.household_membership_applications TO service_role;
ALTER TABLE public.household_membership_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a household application"
  ON public.household_membership_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE TRIGGER update_household_applications_updated_at BEFORE UPDATE ON public.household_membership_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. 家庭档案扩展（会友身份属于家庭）
ALTER TABLE public.households
  ADD COLUMN IF NOT EXISTS membership_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS membership_date date,
  ADD COLUMN IF NOT EXISTS application_id uuid REFERENCES public.household_membership_applications(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_by text,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS attending_since text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS wechat text,
  ADD COLUMN IF NOT EXISTS email text;

-- 5. 家庭会友状态历史（永久保留）
CREATE TABLE public.household_membership_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  effective_date date NOT NULL DEFAULT current_date,
  reason text,
  internal_note text,
  changed_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.household_membership_status_history TO service_role;
ALTER TABLE public.household_membership_status_history ENABLE ROW LEVEL SECURITY;

-- 6. 人员库扩展：信仰与教会参与
ALTER TABLE public.people
  ADD COLUMN IF NOT EXISTS is_believer text,
  ADD COLUMN IF NOT EXISTS faith_date date,
  ADD COLUMN IF NOT EXISTS is_baptized text,
  ADD COLUMN IF NOT EXISTS baptism_date date,
  ADD COLUMN IF NOT EXISTS baptism_church text,
  ADD COLUMN IF NOT EXISTS is_serving boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS serving_notes text,
  ADD COLUMN IF NOT EXISTS school text,
  ADD COLUMN IF NOT EXISTS grade text;

-- 7. 家庭成员唯一约束（避免重复关系）
CREATE UNIQUE INDEX IF NOT EXISTS household_members_unique_idx
  ON public.household_members(household_id, person_id);

-- 8. 青少年事工与人员库关联（不复制人员）
ALTER TABLE public.youth_members
  ADD COLUMN IF NOT EXISTS person_id uuid REFERENCES public.people(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX IF NOT EXISTS youth_members_person_unique_idx
  ON public.youth_members(person_id) WHERE person_id IS NOT NULL;
