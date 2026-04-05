CREATE TABLE public.sermons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  year INTEGER NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  title_zh TEXT NOT NULL DEFAULT '',
  title_th TEXT NOT NULL DEFAULT '',
  speaker TEXT NOT NULL DEFAULT '',
  series_en TEXT,
  series_zh TEXT,
  series_th TEXT,
  scripture_en TEXT,
  scripture_zh TEXT,
  scripture_th TEXT,
  audio_url TEXT,
  ppt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sermons" ON public.sermons FOR SELECT USING (true);
CREATE POLICY "Anyone can insert sermons" ON public.sermons FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sermons" ON public.sermons FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete sermons" ON public.sermons FOR DELETE USING (true);

CREATE TRIGGER update_sermons_updated_at
BEFORE UPDATE ON public.sermons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();