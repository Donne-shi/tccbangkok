-- Create survey responses table for Sunday Worship Satisfaction Survey
CREATE TABLE public.worship_survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Respondent background (anonymous, optional)
  attendance_frequency TEXT,        -- weekly / often / sometimes / rarely / first_time
  age_group TEXT,                   -- under_18 / 18_29 / 30_44 / 45_59 / 60_plus
  member_status TEXT,               -- member / regular / newcomer / visitor
  preferred_language TEXT,          -- zh / en / th
  
  -- Section 1: Worship Service Flow & Arrangement (1-5)
  flow_overall INTEGER,             -- 整体流程顺畅度
  flow_duration INTEGER,            -- 时长是否合适
  flow_transitions INTEGER,         -- 环节衔接
  flow_punctuality INTEGER,         -- 准时开始/结束
  flow_announcements INTEGER,       -- 报告/通知清晰度
  flow_welcome INTEGER,             -- 招待/迎新
  flow_environment INTEGER,         -- 场地环境/座位/卫生
  flow_av INTEGER,                  -- 音响/投影/直播
  flow_comments TEXT,
  
  -- Section 2: Worship Music (1-5)
  music_song_selection INTEGER,     -- 选曲合宜度
  music_theological_depth INTEGER,  -- 歌词神学深度
  music_singability INTEGER,        -- 易于跟唱
  music_volume INTEGER,             -- 音量适中
  music_band_quality INTEGER,       -- 敬拜团演奏水平
  music_leader INTEGER,             -- 敬拜带领
  music_lyrics_display INTEGER,     -- 歌词投影清晰
  music_spiritual_atmosphere INTEGER,-- 属灵氛围
  music_song_balance INTEGER,       -- 新旧诗歌平衡
  music_comments TEXT,
  
  -- Section 3: Sermon (1-5)
  sermon_clarity INTEGER,           -- 信息清晰
  sermon_biblical INTEGER,          -- 忠于圣经
  sermon_application INTEGER,       -- 生活应用
  sermon_depth INTEGER,             -- 属灵深度
  sermon_delivery INTEGER,          -- 表达感染力
  sermon_length INTEGER,            -- 长度合适
  sermon_translation INTEGER,       -- 翻译质量(若有)
  sermon_spiritual_growth INTEGER,  -- 对个人灵命帮助
  sermon_comments TEXT,
  
  -- Section 4: Sunday School & Children/Youth Ministry (1-5)
  ss_adult_quality INTEGER,         -- 成人主日学质量
  ss_children_program INTEGER,      -- 儿童事工
  ss_youth_program INTEGER,         -- 青少年事工
  ss_teacher_quality INTEGER,       -- 教师水平
  ss_curriculum INTEGER,            -- 课程内容
  ss_safety INTEGER,                -- 儿童安全
  ss_class_arrangement INTEGER,     -- 班级分组合理
  ss_comments TEXT,
  
  -- Section 5: Overall & Community
  overall_satisfaction INTEGER,     -- 整体满意度 1-5
  recommend_score INTEGER,          -- 是否愿意推荐 0-10 (NPS)
  fellowship_feeling INTEGER,       -- 团契归属感 1-5
  pastoral_care INTEGER,            -- 牧养关怀 1-5
  
  -- Open-ended
  most_appreciated TEXT,            -- 最感恩/喜欢的部分
  most_improvement TEXT,            -- 最希望改进的部分
  topics_requested TEXT,            -- 希望讲道/教导的主题
  ministry_interest TEXT,           -- 愿意参与的服事
  prayer_request TEXT,              -- 代祷事项
  additional_comments TEXT,         -- 其他建议
  
  -- Meta
  language_used TEXT NOT NULL DEFAULT 'zh',
  status TEXT NOT NULL DEFAULT 'new',  -- new / reviewed / archived
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.worship_survey_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a response (anonymous)
CREATE POLICY "Anyone can submit survey responses"
ON public.worship_survey_responses
FOR INSERT
WITH CHECK (true);

-- Anyone can view responses (admin page is password-protected at app layer, consistent with feedback table)
CREATE POLICY "Anyone can view survey responses"
ON public.worship_survey_responses
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update survey responses"
ON public.worship_survey_responses
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete survey responses"
ON public.worship_survey_responses
FOR DELETE
USING (true);

-- Auto update timestamp
CREATE TRIGGER update_worship_survey_updated_at
BEFORE UPDATE ON public.worship_survey_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_worship_survey_created ON public.worship_survey_responses(created_at DESC);
CREATE INDEX idx_worship_survey_status ON public.worship_survey_responses(status);