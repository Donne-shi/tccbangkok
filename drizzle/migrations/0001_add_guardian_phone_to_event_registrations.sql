ALTER TABLE public.event_registrations
  ADD COLUMN IF NOT EXISTS guardian_phone text;