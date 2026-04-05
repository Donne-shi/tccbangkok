INSERT INTO storage.buckets (id, name, public) VALUES ('sermon-audio', 'sermon-audio', true);

CREATE POLICY "Anyone can view sermon audio" ON storage.objects FOR SELECT USING (bucket_id = 'sermon-audio');
CREATE POLICY "Anyone can upload sermon audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'sermon-audio');
CREATE POLICY "Anyone can update sermon audio" ON storage.objects FOR UPDATE USING (bucket_id = 'sermon-audio');
CREATE POLICY "Anyone can delete sermon audio" ON storage.objects FOR DELETE USING (bucket_id = 'sermon-audio');