-- Create sunday_school_content table
CREATE TABLE public.sunday_school_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('youth', 'children')),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  year INTEGER NOT NULL,
  summary TEXT,
  ppt_url TEXT,
  song_links JSONB DEFAULT '[]'::jsonb,
  video_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sunday_school_content ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Anyone can view sunday school content"
ON public.sunday_school_content
FOR SELECT
USING (true);

-- Anyone can insert (admin protected by password in edge function)
CREATE POLICY "Anyone can insert sunday school content"
ON public.sunday_school_content
FOR INSERT
WITH CHECK (true);

-- Anyone can update
CREATE POLICY "Anyone can update sunday school content"
ON public.sunday_school_content
FOR UPDATE
USING (true);

-- Anyone can delete
CREATE POLICY "Anyone can delete sunday school content"
ON public.sunday_school_content
FOR DELETE
USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_sunday_school_updated_at
BEFORE UPDATE ON public.sunday_school_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for PPT files
INSERT INTO storage.buckets (id, name, public) VALUES ('sunday-school-files', 'sunday-school-files', true);

-- Storage policies
CREATE POLICY "Public can view sunday school files"
ON storage.objects FOR SELECT
USING (bucket_id = 'sunday-school-files');

CREATE POLICY "Anyone can upload sunday school files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'sunday-school-files');

CREATE POLICY "Anyone can delete sunday school files"
ON storage.objects FOR DELETE
USING (bucket_id = 'sunday-school-files');