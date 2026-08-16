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
      household_members: {
        Row: {
          created_at: string
          household_id: string
          id: string
          is_primary_contact: boolean
          person_id: string
          relationship: string
        }
        Insert: {
          created_at?: string
          household_id: string
          id?: string
          is_primary_contact?: boolean
          person_id: string
          relationship?: string
        }
        Update: {
          created_at?: string
          household_id?: string
          id?: string
          is_primary_contact?: boolean
          person_id?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_members_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          address: string | null
          created_at: string
          group_id: string | null
          household_name: string
          id: string
          notes: string | null
          primary_contact_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          group_id?: string | null
          household_name: string
          id?: string
          notes?: string | null
          primary_contact_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          group_id?: string | null
          household_name?: string
          id?: string
          notes?: string | null
          primary_contact_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "households_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "households_primary_contact_id_fkey"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
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
      member_applications: {
        Row: {
          agrees_confession: string | null
          agrees_covenant: boolean
          attending_duration: string | null
          baptism_church: string | null
          baptism_date: string | null
          birth_date: string | null
          created_at: string
          current_group: string | null
          email: string | null
          faith_date: string | null
          full_name: string
          gender: string | null
          id: string
          internal_notes: string | null
          is_baptized: string | null
          is_believer: string | null
          marital_status: string | null
          occupation: string | null
          person_id: string | null
          phone: string
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          wechat: string | null
        }
        Insert: {
          agrees_confession?: string | null
          agrees_covenant?: boolean
          attending_duration?: string | null
          baptism_church?: string | null
          baptism_date?: string | null
          birth_date?: string | null
          created_at?: string
          current_group?: string | null
          email?: string | null
          faith_date?: string | null
          full_name: string
          gender?: string | null
          id?: string
          internal_notes?: string | null
          is_baptized?: string | null
          is_believer?: string | null
          marital_status?: string | null
          occupation?: string | null
          person_id?: string | null
          phone?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          wechat?: string | null
        }
        Update: {
          agrees_confession?: string | null
          agrees_covenant?: boolean
          attending_duration?: string | null
          baptism_church?: string | null
          baptism_date?: string | null
          birth_date?: string | null
          created_at?: string
          current_group?: string | null
          email?: string | null
          faith_date?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          internal_notes?: string | null
          is_baptized?: string | null
          is_believer?: string | null
          marital_status?: string | null
          occupation?: string | null
          person_id?: string | null
          phone?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          wechat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_applications_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      member_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          effective_date: string
          id: string
          member_id: string
          new_status: string
          note: string | null
          previous_status: string | null
          reason: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          effective_date?: string
          id?: string
          member_id: string
          new_status: string
          note?: string | null
          previous_status?: string | null
          reason?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          effective_date?: string
          id?: string
          member_id?: string
          new_status?: string
          note?: string | null
          previous_status?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_status_history_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          application_id: string | null
          approved_at: string | null
          approved_by: string | null
          baptism_church: string | null
          baptism_date: string | null
          baptism_status: string | null
          created_at: string
          faith_date: string | null
          id: string
          joined_at: string | null
          member_number: string | null
          member_status: string
          person_id: string
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          baptism_church?: string | null
          baptism_date?: string | null
          baptism_status?: string | null
          created_at?: string
          faith_date?: string | null
          id?: string
          joined_at?: string | null
          member_number?: string | null
          member_status?: string
          person_id: string
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          baptism_church?: string | null
          baptism_date?: string | null
          baptism_status?: string | null
          created_at?: string
          faith_date?: string | null
          id?: string
          joined_at?: string | null
          member_number?: string | null
          member_status?: string
          person_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "member_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: true
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          address: string | null
          birth_date: string | null
          created_at: string
          email: string | null
          full_name: string
          gender: string | null
          group_id: string | null
          id: string
          marital_status: string | null
          notes: string | null
          occupation: string | null
          phone: string | null
          photo_url: string | null
          updated_at: string
          user_id: string | null
          wechat: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          gender?: string | null
          group_id?: string | null
          id?: string
          marital_status?: string | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
          user_id?: string | null
          wechat?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          gender?: string | null
          group_id?: string | null
          id?: string
          marital_status?: string | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
          user_id?: string | null
          wechat?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
        ]
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
      visit_expenses: {
        Row: {
          amount: number
          created_at: string
          description: string
          expense_type: string | null
          id: string
          paid_by: string | null
          reimbursement_id: string | null
          reimbursement_status: string
          visit_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string
          expense_type?: string | null
          id?: string
          paid_by?: string | null
          reimbursement_id?: string | null
          reimbursement_status?: string
          visit_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          expense_type?: string | null
          id?: string
          paid_by?: string | null
          reimbursement_id?: string | null
          reimbursement_status?: string
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_expenses_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_people: {
        Row: {
          created_at: string
          id: string
          person_id: string
          visit_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          person_id: string
          visit_id: string
        }
        Update: {
          created_at?: string
          id?: string
          person_id?: string
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_people_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visit_people_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_staff: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          person_id: string | null
          role_title: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          person_id?: string | null
          role_title?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          person_id?: string | null
          role_title?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_staff_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_visitors: {
        Row: {
          created_at: string
          id: string
          visit_id: string
          visitor_id: string | null
          visitor_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          visit_id: string
          visitor_id?: string | null
          visitor_name?: string
        }
        Update: {
          created_at?: string
          id?: string
          visit_id?: string
          visitor_id?: string | null
          visitor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_visitors_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visit_visitors_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visit_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          created_at: string
          follow_up_completed_at: string | null
          follow_up_completed_by: string | null
          follow_up_completed_note: string | null
          follow_up_date: string | null
          follow_up_note: string | null
          follow_up_required: boolean
          follow_up_status: string
          household_id: string | null
          id: string
          notes: string | null
          primary_person_id: string | null
          recorder_id: string | null
          recorder_name: string | null
          updated_at: string
          visit_date: string
          visit_method: string
          visit_time: string | null
          visit_type: string
        }
        Insert: {
          created_at?: string
          follow_up_completed_at?: string | null
          follow_up_completed_by?: string | null
          follow_up_completed_note?: string | null
          follow_up_date?: string | null
          follow_up_note?: string | null
          follow_up_required?: boolean
          follow_up_status?: string
          household_id?: string | null
          id?: string
          notes?: string | null
          primary_person_id?: string | null
          recorder_id?: string | null
          recorder_name?: string | null
          updated_at?: string
          visit_date?: string
          visit_method?: string
          visit_time?: string | null
          visit_type?: string
        }
        Update: {
          created_at?: string
          follow_up_completed_at?: string | null
          follow_up_completed_by?: string | null
          follow_up_completed_note?: string | null
          follow_up_date?: string | null
          follow_up_note?: string | null
          follow_up_required?: boolean
          follow_up_status?: string
          household_id?: string | null
          id?: string
          notes?: string | null
          primary_person_id?: string | null
          recorder_id?: string | null
          recorder_name?: string | null
          updated_at?: string
          visit_date?: string
          visit_method?: string
          visit_time?: string | null
          visit_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_primary_person_id_fkey"
            columns: ["primary_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_recorder_id_fkey"
            columns: ["recorder_id"]
            isOneToOne: false
            referencedRelation: "visit_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_groups: {
        Row: {
          created_at: string
          description: string
          id: string
          leader: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          leader?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          leader?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      youth_members: {
        Row: {
          attendance: string | null
          birth_date: string | null
          care_notes: string | null
          contact: string | null
          contact_consent: boolean
          created_at: string
          current_serving: string | null
          faith_status: string | null
          fellowship_hope: string | null
          first_attended_date: string | null
          follow_up: string | null
          full_name: string
          gender: string | null
          grade: string | null
          group_id: string | null
          growth_stage: string | null
          guardian_consent: boolean
          guardian_contact: string | null
          guardian_name: string | null
          guardian_relation: string | null
          id: string
          interests: Json
          interests_other: string | null
          mentor: string | null
          nickname: string | null
          profile_status: string
          school: string | null
          service_interests: Json
          updated_at: string
        }
        Insert: {
          attendance?: string | null
          birth_date?: string | null
          care_notes?: string | null
          contact?: string | null
          contact_consent?: boolean
          created_at?: string
          current_serving?: string | null
          faith_status?: string | null
          fellowship_hope?: string | null
          first_attended_date?: string | null
          follow_up?: string | null
          full_name: string
          gender?: string | null
          grade?: string | null
          group_id?: string | null
          growth_stage?: string | null
          guardian_consent?: boolean
          guardian_contact?: string | null
          guardian_name?: string | null
          guardian_relation?: string | null
          id?: string
          interests?: Json
          interests_other?: string | null
          mentor?: string | null
          nickname?: string | null
          profile_status?: string
          school?: string | null
          service_interests?: Json
          updated_at?: string
        }
        Update: {
          attendance?: string | null
          birth_date?: string | null
          care_notes?: string | null
          contact?: string | null
          contact_consent?: boolean
          created_at?: string
          current_serving?: string | null
          faith_status?: string | null
          fellowship_hope?: string | null
          first_attended_date?: string | null
          follow_up?: string | null
          full_name?: string
          gender?: string | null
          grade?: string | null
          group_id?: string | null
          growth_stage?: string | null
          guardian_consent?: boolean
          guardian_contact?: string | null
          guardian_name?: string | null
          guardian_relation?: string | null
          id?: string
          interests?: Json
          interests_other?: string | null
          mentor?: string | null
          nickname?: string | null
          profile_status?: string
          school?: string | null
          service_interests?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "youth_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_volunteer_applications: {
        Row: {
          admin_notes: string | null
          age: number | null
          agree_training: boolean
          available_times: Json
          available_times_other: string | null
          baptized: string | null
          church_relation: string | null
          church_relation_other: string | null
          commit_half_year: string | null
          contact: string
          created_at: string
          desired_roles: Json
          experience_detail: string | null
          faith_years: string | null
          full_name: string
          gender: string | null
          has_experience: string | null
          id: string
          monthly_frequency: string | null
          motivation: string | null
          skill_areas: Json
          skill_areas_other: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          age?: number | null
          agree_training?: boolean
          available_times?: Json
          available_times_other?: string | null
          baptized?: string | null
          church_relation?: string | null
          church_relation_other?: string | null
          commit_half_year?: string | null
          contact?: string
          created_at?: string
          desired_roles?: Json
          experience_detail?: string | null
          faith_years?: string | null
          full_name: string
          gender?: string | null
          has_experience?: string | null
          id?: string
          monthly_frequency?: string | null
          motivation?: string | null
          skill_areas?: Json
          skill_areas_other?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          age?: number | null
          agree_training?: boolean
          available_times?: Json
          available_times_other?: string | null
          baptized?: string | null
          church_relation?: string | null
          church_relation_other?: string | null
          commit_half_year?: string | null
          contact?: string
          created_at?: string
          desired_roles?: Json
          experience_detail?: string | null
          faith_years?: string | null
          full_name?: string
          gender?: string | null
          has_experience?: string | null
          id?: string
          monthly_frequency?: string | null
          motivation?: string | null
          skill_areas?: Json
          skill_areas_other?: string | null
          status?: string
          updated_at?: string
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
