CREATE TABLE public.event_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL DEFAULT '三一青少年团契团建日',
  student_name_zh text NOT NULL,
  student_name_en text,
  grade text,
  group_level text,
  age integer,
  guardian_name text NOT NULL,
  relation text,
  relation_other text,
  phone text NOT NULL,
  backup_contact_name text,
  backup_contact_phone text,
  has_special_notes boolean NOT NULL DEFAULT false,
  special_notes text,
  transport_option text NOT NULL,
  carpool_parent_name text,
  carpool_parent_child text,
  carpool_parent_phone text,
  consents jsonb NOT NULL DEFAULT '{}'::jsonb,
  confirm_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.event_registrations TO anon;
GRANT INSERT ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit event registration"
ON public.event_registrations FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE TRIGGER update_event_registrations_updated_at
BEFORE UPDATE ON public.event_registrations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();