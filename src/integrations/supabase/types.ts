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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          meta_json: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          meta_json?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          meta_json?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      calendar_items: {
        Row: {
          color: string | null
          content_id: string | null
          created_at: string
          date: string
          id: string
          time: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          content_id?: string | null
          created_at?: string
          date: string
          id?: string
          time?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          content_id?: string | null
          created_at?: string
          date?: string
          id?: string
          time?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_items_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          caption: string | null
          content_type: Database["public"]["Enums"]["content_type"] | null
          created_at: string
          cta: string | null
          editing_notes: string | null
          filming_notes: string | null
          hook: string | null
          id: string
          persona_id: string | null
          platform: string | null
          purpose: Database["public"]["Enums"]["content_purpose"] | null
          scheduled_date: string | null
          scheduled_time: string | null
          script: string | null
          status: Database["public"]["Enums"]["content_status"]
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string
          cta?: string | null
          editing_notes?: string | null
          filming_notes?: string | null
          hook?: string | null
          id?: string
          persona_id?: string | null
          platform?: string | null
          purpose?: Database["public"]["Enums"]["content_purpose"] | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          script?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          content_type?: Database["public"]["Enums"]["content_type"] | null
          created_at?: string
          cta?: string | null
          editing_notes?: string | null
          filming_notes?: string | null
          hook?: string | null
          id?: string
          persona_id?: string | null
          platform?: string | null
          purpose?: Database["public"]["Enums"]["content_purpose"] | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          script?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          age: string | null
          content_wants: string | null
          created_at: string
          goals: string | null
          id: string
          is_default: boolean | null
          location: string | null
          name: string
          occupation: string | null
          struggles: string | null
          updated_at: string
          user_id: string
          why_follow: string | null
        }
        Insert: {
          age?: string | null
          content_wants?: string | null
          created_at?: string
          goals?: string | null
          id?: string
          is_default?: boolean | null
          location?: string | null
          name: string
          occupation?: string | null
          struggles?: string | null
          updated_at?: string
          user_id: string
          why_follow?: string | null
        }
        Update: {
          age?: string | null
          content_wants?: string | null
          created_at?: string
          goals?: string | null
          id?: string
          is_default?: boolean | null
          location?: string | null
          name?: string
          occupation?: string | null
          struggles?: string | null
          updated_at?: string
          user_id?: string
          why_follow?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          business_name: string | null
          created_at: string
          display_name: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_hooks: {
        Row: {
          category: string | null
          created_at: string
          id: string
          text: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          text: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          platform: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["saved_post_status"]
          title: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          platform?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["saved_post_status"]
          title?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          platform?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["saved_post_status"]
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      content_purpose: "educate" | "inspire" | "sell" | "authority" | "engage"
      content_status: "draft" | "scheduled" | "published" | "idea"
      content_type:
        | "reel"
        | "tiktok"
        | "carousel"
        | "story"
        | "youtube_short"
        | "photo"
      saved_post_status: "draft" | "idea" | "published" | "scheduled"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      content_purpose: ["educate", "inspire", "sell", "authority", "engage"],
      content_status: ["draft", "scheduled", "published", "idea"],
      content_type: [
        "reel",
        "tiktok",
        "carousel",
        "story",
        "youtube_short",
        "photo",
      ],
      saved_post_status: ["draft", "idea", "published", "scheduled"],
    },
  },
} as const
