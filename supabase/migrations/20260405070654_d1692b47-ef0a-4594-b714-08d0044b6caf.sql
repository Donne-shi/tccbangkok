
-- Create finance_reports table
CREATE TABLE public.finance_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.finance_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view finance reports" ON public.finance_reports FOR SELECT USING (true);
CREATE POLICY "Anyone can insert finance reports" ON public.finance_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update finance reports" ON public.finance_reports FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete finance reports" ON public.finance_reports FOR DELETE USING (true);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('finance-assets', 'finance-assets', true);

CREATE POLICY "Anyone can view finance assets" ON storage.objects FOR SELECT USING (bucket_id = 'finance-assets');
CREATE POLICY "Anyone can upload finance assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'finance-assets');
CREATE POLICY "Anyone can update finance assets" ON storage.objects FOR UPDATE USING (bucket_id = 'finance-assets');
CREATE POLICY "Anyone can delete finance assets" ON storage.objects FOR DELETE USING (bucket_id = 'finance-assets');
