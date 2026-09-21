ALTER TABLE public.event_registrations
  ADD COLUMN IF NOT EXISTS service_roles jsonb NOT NULL DEFAULT '[]'::jsonb,
  ALTER COLUMN transport_option SET DEFAULT '';