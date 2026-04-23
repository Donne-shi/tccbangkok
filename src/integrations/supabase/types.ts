export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      church_survey_responses: {
        Row: {
          additional_comments: string | null
          age_group: string | null
          attendance_frequency: string | null
          attended_duration: string | null
          belonging_feeling: number | null
          church_impression_comments: string | null
          comm_announcements: number | null
          comm_comments: string | null
          comm_social_media: number | null
          comm_transparency: number | null
          comm_website: number | null
          created_at: string
          fellowship_comments: string | null
          fellowship_feeling: number | null
          flow_announcements: number | null
          flow_av: number | null
          flow_comments: string | null
          flow_duration: number | null
          flow_environment: number | null
          flow_overall: number | null
          flow_punctuality: number | null
          flow_transitions: number | null
          flow_welcome: number | null
          id: string
          language_used: string
          member_status: string | null
          ministry_comments: string | null
          ministry_opportunity: number | null
          ministry_support: number | null
          ministry_training: number | null
          most_appreciated: string | null
          most_improvement: string | null
          music_comments: string | null
          music_leader: number | null
          music_lyrics_display: number | null
          music_singability: number | null
          music_song_balance: number | null
          music_song_selection: number | null
          music_spiritual_atmosphere: number | null
          music_theological_depth: number | null
          music_volume: number | null
          overall_satisfaction: number | null
          pastoral_availability: number | null
          pastoral_care: number | null
          pastoral_comments: string | null
          pastoral_counseling: number | null
          pastoral_visitation: number | null
          preferred_language: string | null
          recommend_score: number | null
          sermon_application: number | null
          sermon_biblical: number | null
          sermon_clarity: number | null
          sermon_comments: string | null
          sermon_delivery: number | null
          sermon_depth: number | null
          sermon_length: number | null
          sermon_spiritual_growth: number | null
          smallgroup_belonging: number | null
          smallgroup_participation: string | null
          smallgroup_quality: number | null
          spiritual_growth: number | null
          ss_adult_quality: number | null
          ss_children_program: number | null
          ss_comments: string | null
          ss_curriculum: number | null
          ss_safety: number | null
          ss_teacher_quality: number | null
          ss_youth_program: number | null
          status: string
          topics_requested: string | null
          updated_at: string
          vision_alignment: number | null
          welcome_atmosphere: number | null
        }
        Insert: {
          additional_comments?: string | null
          age_group?: string | null
          attendance_frequency?: string | null
          attended_duration?: string | null
          belonging_feeling?: number | null
          church_impression_comments?: string | null
          comm_announcements?: number | null
          comm_comments?: string | null
          comm_social_media?: number | null
          comm_transparency?: number | null
          comm_website?: number | null
          created_at?: string
          fellowship_comments?: string | null
          fellowship_feeling?: number | null
          flow_announcements?: number | null
          flow_av?: number | null
          flow_comments?: string | null
          flow_duration?: number | null
          flow_environment?: number | null
          flow_overall?: number | null
          flow_punctuality?: number | null
          flow_transitions?: number | null
          flow_welcome?: number | null
          id?: string
          language_used?: string
          member_status?: string | null
          ministry_comments?: string | null
          ministry_opportunity?: number | null
          ministry_support?: number | null
          ministry_training?: number | null
          most_appreciated?: string | null
          most_improvement?: string | null
          music_comments?: string | null
          music_leader?: number | null
          music_lyrics_display?: number | null
          music_singability?: number | null
          music_song_balance?: number | null
          music_song_selection?: number | null
          music_spiritual_atmosphere?: number | null
          music_theological_depth?: number | null
          music_volume?: number | null
          overall_satisfaction?: number | null
          pastoral_availability?: number | null
          pastoral_care?: number | null
          pastoral_comments?: string | null
          pastoral_counseling?: number | null
          pastoral_visitation?: number | null
          preferred_language?: string | null
          recommend_score?: number | null
          sermon_application?: number | null
          sermon_biblical?: number | null
          sermon_clarity?: number | null
          sermon_comments?: string | null
          sermon_delivery?: number | null
          sermon_depth?: number | null
          sermon_length?: number | null
          sermon_spiritual_growth?: number | null
          smallgroup_belonging?: number | null
          smallgroup_participation?: string | null
          smallgroup_quality?: number | null
          spiritual_growth?: number | null
          ss_adult_quality?: number | null
          ss_children_program?: number | null
          ss_comments?: string | null
          ss_curriculum?: number | null
          ss_safety?: number | null
          ss_teacher_quality?: number | null
          ss_youth_program?: number | null
          status?: string
          topics_requested?: string | null
          updated_at?: string
          vision_alignment?: number | null
          welcome_atmosphere?: number | null
        }
        Update: {
          additional_comments?: string | null
          age_group?: string | null
          attendance_frequency?: string | null
          attended_duration?: string | null
          belonging_feeling?: number | null
          church_impression_comments?: string | null
          comm_announcements?: number | null
          comm_comments?: string | null
          comm_social_media?: number | null
          comm_transparency?: number | null
          comm_website?: number | null
          created_at?: string
          fellowship_comments?: string | null
          fellowship_feeling?: number | null
          flow_announcements?: number | null
          flow_av?: number | null
          flow_comments?: string | null
          flow_duration?: number | null
          flow_environment?: number | null
          flow_overall?: number | null
          flow_punctuality?: number | null
          flow_transitions?: number | null
          flow_welcome?: number | null
          id?: string
          language_used?: string
          member_status?: string | null
          ministry_comments?: string | null
          ministry_opportunity?: number | null
          ministry_support?: number | null
          ministry_training?: number | null
          most_appreciated?: string | null
          most_improvement?: string | null
          music_comments?: string | null
          music_leader?: number | null
          music_lyrics_display?: number | null
          music_singability?: number | null
          music_song_balance?: number | null
          music_song_selection?: number | null
          music_spiritual_atmosphere?: number | null
          music_theological_depth?: number | null
          music_volume?: number | null
          overall_satisfaction?: number | null
          pastoral_availability?: number | null
          pastoral_care?: number | null
          pastoral_comments?: string | null
          pastoral_counseling?: number | null
          pastoral_visitation?: number | null
          preferred_language?: string | null
          recommend_score?: number | null
          sermon_application?: number | null
          sermon_biblical?: number | null
          sermon_clarity?: number | null
          sermon_comments?: string | null
          sermon_delivery?: number | null
          sermon_depth?: number | null
          sermon_length?: number | null
          sermon_spiritual_growth?: number | null
          smallgroup_belonging?: number | null
          smallgroup_participation?: string | null
          smallgroup_quality?: number | null
          spiritual_growth?: number | null
          ss_adult_quality?: number | null
          ss_children_program?: number | null
          ss_comments?: string | null
          ss_curriculum?: number | null
          ss_safety?: number | null
          ss_teacher_quality?: number | null
          ss_youth_program?: number | null
          status?: string
          topics_requested?: string | null
          updated_at?: string
          vision_alignment?: number | null
          welcome_atmosphere?: number | null
        }
        Relationships: []
      }
      devotional_posts: {
        Row: {
          audio_url: string | null
          author: string
          content: string
          created_at: string
          date: string
          id: string
          published: boolean
          slug: string
          title_en: string
          title_th: string
          title_zh: string
          updated_at: string
          year: number
        }
        Insert: {
          audio_url?: string | null
          author?: string
          content?: string
          created_at?: string
          date: string
          id?: string
          published?: boolean
          slug: string
          title_en?: string
          title_th?: string
          title_zh?: string
          updated_at?: string
          year: number
        }
        Update: {
          audio_url?: string | null
          author?: string
          content?: string
          created_at?: string
          date?: string
          id?: string
          published?: boolean
          slug?: string
          title_en?: string
          title_th?: string
          title_zh?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          message: string
          name?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      finance_reports: {
        Row: {
          created_at: string
          id: string
          image_url: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      learning_resources: {
        Row: {
          created_at: string
          description_en: string
          description_th: string
          description_zh: string
          file_url: string | null
          icon: string | null
          id: string
          parent_type: string | null
          published: boolean
          sort_order: number
          title_en: string
          title_th: string
          title_zh: string
          type: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description_en?: string
          description_th?: string
          description_zh?: string
          file_url?: string | null
          icon?: string | null
          id?: string
          parent_type?: string | null
          published?: boolean
          sort_order?: number
          title_en?: string
          title_th?: string
          title_zh?: string
          type?: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description_en?: string
          description_th?: string
          description_zh?: string
          file_url?: string | null
          icon?: string | null
          id?: string
          parent_type?: string | null
          published?: boolean
          sort_order?: number
          title_en?: string
          title_th?: string
          title_zh?: string
          type?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      sermons: {
        Row: {
          audio_url: string | null
          created_at: string
          date: string
          id: string
          ppt_url: string | null
          scripture_en: string | null
          scripture_th: string | null
          scripture_zh: string | null
          series_en: string | null
          series_th: string | null
          series_zh: string | null
          slug: string
          speaker: string
          title_en: string
          title_th: string
          title_zh: string
          updated_at: string
          year: number
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          date: string
          id?: string
          ppt_url?: string | null
          scripture_en?: string | null
          scripture_th?: string | null
          scripture_zh?: string | null
          series_en?: string | null
          series_th?: string | null
          series_zh?: string | null
          slug: string
          speaker?: string
          title_en?: string
          title_th?: string
          title_zh?: string
          updated_at?: string
          year: number
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          date?: string
          id?: string
          ppt_url?: string | null
          scripture_en?: string | null
          scripture_th?: string | null
          scripture_zh?: string | null
          series_en?: string | null
          series_th?: string | null
          series_zh?: string | null
          slug?: string
          speaker?: string
          title_en?: string
          title_th?: string
          title_zh?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      sunday_school_content: {
        Row: {
          category: string
          created_at: string
          date: string
          id: string
          ppt_url: string | null
          song_links: Json | null
          summary: string | null
          title: string
          updated_at: string
          video_links: Json | null
          year: number
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          id?: string
          ppt_url?: string | null
          song_links?: Json | null
          summary?: string | null
          title: string
          updated_at?: string
          video_links?: Json | null
          year: number
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          id?: string
          ppt_url?: string | null
          song_links?: Json | null
          summary?: string | null
          title?: string
          updated_at?: string
          video_links?: Json | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
