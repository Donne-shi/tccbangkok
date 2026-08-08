CREATE TABLE public.youth_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  leader text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.youth_groups TO anon, authenticated;
GRANT ALL ON public.youth_groups TO service_role;
ALTER TABLE public.youth_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view youth groups" ON public.youth_groups FOR SELECT USING (true);
CREATE POLICY "Anyone can insert youth groups" ON public.youth_groups FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update youth groups" ON public.youth_groups FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete youth groups" ON public.youth_groups FOR DELETE USING (true);
CREATE TRIGGER update_youth_groups_updated_at BEFORE UPDATE ON public.youth_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.youth_volunteer_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  gender text,
  age integer,
  contact text NOT NULL DEFAULT '',
  church_relation text,
  church_relation_other text,
  faith_years text,
  baptized text,
  motivation text,
  has_experience text,
  experience_detail text,
  skill_areas jsonb NOT NULL DEFAULT '[]'::jsonb,
  skill_areas_other text,
  desired_roles jsonb NOT NULL DEFAULT '[]'::jsonb,
  available_times jsonb NOT NULL DEFAULT '[]'::jsonb,
  available_times_other text,
  monthly_frequency text,
  commit_half_year text,
  agree_training boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.youth_volunteer_applications TO anon, authenticated;
GRANT ALL ON public.youth_volunteer_applications TO service_role;
ALTER TABLE public.youth_volunteer_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit youth volunteer application" ON public.youth_volunteer_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view youth volunteer applications" ON public.youth_volunteer_applications FOR SELECT USING (true);
CREATE POLICY "Anyone can update youth volunteer applications" ON public.youth_volunteer_applications FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete youth volunteer applications" ON public.youth_volunteer_applications FOR DELETE USING (true);
CREATE TRIGGER update_youth_volunteer_updated_at BEFORE UPDATE ON public.youth_volunteer_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.youth_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  nickname text,
  gender text,
  birth_date date,
  school text,
  grade text,
  contact text,
  faith_status text,
  attendance text,
  interests jsonb NOT NULL DEFAULT '[]'::jsonb,
  interests_other text,
  service_interests jsonb NOT NULL DEFAULT '[]'::jsonb,
  fellowship_hope text,
  guardian_name text,
  guardian_relation text,
  guardian_contact text,
  guardian_consent boolean NOT NULL DEFAULT false,
  contact_consent boolean NOT NULL DEFAULT false,
  profile_status text NOT NULL DEFAULT 'active',
  first_attended_date date,
  group_id uuid REFERENCES public.youth_groups(id) ON DELETE SET NULL,
  mentor text,
  growth_stage text,
  current_serving text,
  follow_up text,
  care_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.youth_members TO anon, authenticated;
GRANT ALL ON public.youth_members TO service_role;
ALTER TABLE public.youth_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit youth member form" ON public.youth_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view youth members" ON public.youth_members FOR SELECT USING (true);
CREATE POLICY "Anyone can update youth members" ON public.youth_members FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete youth members" ON public.youth_members FOR DELETE USING (true);
CREATE TRIGGER update_youth_members_updated_at BEFORE UPDATE ON public.youth_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.youth_groups (name, leader, description, sort_order) VALUES
  ('初中男生组', '', '初中阶段男生小组', 1),
  ('初中女生组', '', '初中阶段女生小组', 2),
  ('高中组', '', '高中阶段小组', 3);