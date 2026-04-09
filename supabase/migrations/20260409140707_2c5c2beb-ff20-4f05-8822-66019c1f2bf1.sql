
CREATE TABLE public.devotional_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_zh TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  title_th TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL,
  slug TEXT NOT NULL,
  audio_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(slug)
);

ALTER TABLE public.devotional_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view devotional posts" ON public.devotional_posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert devotional posts" ON public.devotional_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update devotional posts" ON public.devotional_posts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete devotional posts" ON public.devotional_posts FOR DELETE USING (true);

CREATE TRIGGER update_devotional_posts_updated_at
BEFORE UPDATE ON public.devotional_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
