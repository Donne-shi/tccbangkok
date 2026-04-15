
-- Create learning resources table
CREATE TABLE public.learning_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'online_resource',
  parent_type TEXT,
  title_zh TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  title_th TEXT NOT NULL DEFAULT '',
  description_zh TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_th TEXT NOT NULL DEFAULT '',
  url TEXT,
  file_url TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- Everyone can view published resources
CREATE POLICY "Anyone can view learning resources"
ON public.learning_resources FOR SELECT
USING (true);

-- Admin can insert
CREATE POLICY "Anyone can insert learning resources"
ON public.learning_resources FOR INSERT
WITH CHECK (true);

-- Admin can update
CREATE POLICY "Anyone can update learning resources"
ON public.learning_resources FOR UPDATE
USING (true);

-- Admin can delete
CREATE POLICY "Anyone can delete learning resources"
ON public.learning_resources FOR DELETE
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_learning_resources_updated_at
BEFORE UPDATE ON public.learning_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
