-- Drop old worship survey table
DROP TABLE IF EXISTS public.worship_survey_responses CASCADE;

-- Create new comprehensive church satisfaction survey table
CREATE TABLE public.church_survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Background (anonymous)
  attendance_frequency TEXT,
  age_group TEXT,
  member_status TEXT,
  attended_duration TEXT,
  preferred_language TEXT,
  
  -- Section 1: Overall Church Impression & Belonging
  overall_satisfaction INTEGER,
  recommend_score INTEGER,           -- NPS 0-10
  belonging_feeling INTEGER,         -- 归属感
  spiritual_growth INTEGER,          -- 在本教会的属灵成长
  vision_alignment INTEGER,          -- 对教会异象的认同
  welcome_atmosphere INTEGER,        -- 整体氛围/欢迎度
  church_impression_comments TEXT,
  
  -- Section 2: Sunday Worship - Flow
  flow_overall INTEGER,
  flow_duration INTEGER,
  flow_punctuality INTEGER,
  flow_transitions INTEGER,
  flow_announcements INTEGER,
  flow_welcome INTEGER,
  flow_av INTEGER,                   -- 音响/投影
  flow_environment INTEGER,          -- 场地/温度/座位
  flow_comments TEXT,
  
  -- Section 2: Sunday Worship - Music
  music_song_selection INTEGER,
  music_theological_depth INTEGER,
  music_singability INTEGER,
  music_volume INTEGER,
  music_leader INTEGER,
  music_lyrics_display INTEGER,
  music_spiritual_atmosphere INTEGER,
  music_song_balance INTEGER,        -- 新旧诗歌平衡
  music_comments TEXT,
  
  -- Section 2: Sunday Worship - Sermon
  sermon_clarity INTEGER,
  sermon_biblical INTEGER,
  sermon_application INTEGER,
  sermon_depth INTEGER,
  sermon_delivery INTEGER,
  sermon_length INTEGER,
  sermon_spiritual_growth INTEGER,
  sermon_comments TEXT,
  
  -- Section 3: Sunday School & Children/Youth Ministry
  ss_adult_quality INTEGER,
  ss_children_program INTEGER,
  ss_youth_program INTEGER,
  ss_teacher_quality INTEGER,
  ss_curriculum INTEGER,
  ss_safety INTEGER,
  ss_comments TEXT,
  
  -- Section 4: Pastoral Care
  pastoral_care INTEGER,
  pastoral_availability INTEGER,     -- 牧者可接触度
  pastoral_visitation INTEGER,       -- 探访关怀
  pastoral_counseling INTEGER,       -- 辅导支持
  pastoral_comments TEXT,
  
  -- Section 4: Small Group / Fellowship
  smallgroup_participation TEXT,     -- 是否参与
  smallgroup_quality INTEGER,
  smallgroup_belonging INTEGER,
  fellowship_feeling INTEGER,        -- 弟兄姊妹相交
  fellowship_comments TEXT,
  
  -- Section 4: Ministry Participation
  ministry_opportunity INTEGER,      -- 服事机会清晰度
  ministry_training INTEGER,         -- 培训装备
  ministry_support INTEGER,          -- 服事支持
  ministry_comments TEXT,
  
  -- Section 4: Communication & Administration
  comm_announcements INTEGER,        -- 通知及时清楚
  comm_website INTEGER,              -- 网站信息
  comm_social_media INTEGER,         -- 社交媒体/群组
  comm_transparency INTEGER,         -- 财务/决策透明度
  comm_comments TEXT,
  
  -- Open-ended overall
  most_appreciated TEXT,
  most_improvement TEXT,
  topics_requested TEXT,
  additional_comments TEXT,
  
  -- Meta
  language_used TEXT NOT NULL DEFAULT 'zh',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.church_survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit church survey"
  ON public.church_survey_responses FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can view church survey"
  ON public.church_survey_responses FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can update church survey"
  ON public.church_survey_responses FOR UPDATE TO public USING (true);

CREATE POLICY "Anyone can delete church survey"
  ON public.church_survey_responses FOR DELETE TO public USING (true);

CREATE TRIGGER update_church_survey_updated_at
  BEFORE UPDATE ON public.church_survey_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_church_survey_created_at ON public.church_survey_responses(created_at DESC);
CREATE INDEX idx_church_survey_status ON public.church_survey_responses(status);