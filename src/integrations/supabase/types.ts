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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      booking_export_settings: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          recipient_emails: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          recipient_emails?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          recipient_emails?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      court_bookings: {
        Row: {
          booked_at: string
          booked_by_team_id: string
          booked_by_user_id: string | null
          court_slot_id: string
          id: string
          match_id: string
        }
        Insert: {
          booked_at?: string
          booked_by_team_id: string
          booked_by_user_id?: string | null
          court_slot_id: string
          id?: string
          match_id: string
        }
        Update: {
          booked_at?: string
          booked_by_team_id?: string
          booked_by_user_id?: string | null
          court_slot_id?: string
          id?: string
          match_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "court_bookings_booked_by_team_id_fkey"
            columns: ["booked_by_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "court_bookings_booked_by_team_id_fkey"
            columns: ["booked_by_team_id"]
            isOneToOne: false
            referencedRelation: "teams_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "court_bookings_court_slot_id_fkey"
            columns: ["court_slot_id"]
            isOneToOne: true
            referencedRelation: "court_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "court_bookings_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      court_slots: {
        Row: {
          court_name: string
          created_at: string
          created_by: string | null
          end_time: string
          id: string
          slot_date: string
          start_time: string
          venue_id: string
        }
        Insert: {
          court_name: string
          created_at?: string
          created_by?: string | null
          end_time: string
          id?: string
          slot_date: string
          start_time: string
          venue_id: string
        }
        Update: {
          court_name?: string
          created_at?: string
          created_by?: string | null
          end_time?: string
          id?: string
          slot_date?: string
          start_time?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "court_slots_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "padel_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      league_members: {
        Row: {
          created_at: string
          id: string
          league_id: string
          role: Database["public"]["Enums"]["league_role"]
          team_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          league_id: string
          role?: Database["public"]["Enums"]["league_role"]
          team_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          league_id?: string
          role?: Database["public"]["Enums"]["league_role"]
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "league_members_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams_public"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          format_type: string
          group_count: number
          home_and_away: boolean
          id: string
          invite_token: string
          logo_url: string | null
          max_teams: number | null
          name: string
          playoff_format: string
          playoff_qualifiers_per_group: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          format_type?: string
          group_count?: number
          home_and_away?: boolean
          id?: string
          invite_token?: string
          logo_url?: string | null
          max_teams?: number | null
          name: string
          playoff_format?: string
          playoff_qualifiers_per_group?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          format_type?: string
          group_count?: number
          home_and_away?: boolean
          id?: string
          invite_token?: string
          logo_url?: string | null
          max_teams?: number | null
          name?: string
          playoff_format?: string
          playoff_qualifiers_per_group?: number
        }
        Relationships: []
      }
      match_results: {
        Row: {
          comment: string | null
          entered_at: string
          entered_by: string | null
          id: string
          match_id: string
          set1_a: number
          set1_b: number
          set2_a: number
          set2_b: number
          set3_a: number | null
          set3_b: number | null
          winner_id: string
        }
        Insert: {
          comment?: string | null
          entered_at?: string
          entered_by?: string | null
          id?: string
          match_id: string
          set1_a: number
          set1_b: number
          set2_a: number
          set2_b: number
          set3_a?: number | null
          set3_b?: number | null
          winner_id: string
        }
        Update: {
          comment?: string | null
          entered_at?: string
          entered_by?: string | null
          id?: string
          match_id?: string
          set1_a?: number
          set1_b?: number
          set2_a?: number
          set2_b?: number
          set3_a?: number | null
          set3_b?: number | null
          winner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_results_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_results_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_results_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams_public"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          id: string
          match_type: string
          played_at: string | null
          team_a_id: string
          team_b_id: string
          week: number
        }
        Insert: {
          created_at?: string
          id?: string
          match_type?: string
          played_at?: string | null
          team_a_id: string
          team_b_id: string
          week: number
        }
        Update: {
          created_at?: string
          id?: string
          match_type?: string
          played_at?: string | null
          team_a_id?: string
          team_b_id?: string
          week?: number
        }
        Relationships: [
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams_public"
            referencedColumns: ["id"]
          },
        ]
      }
      padel_venues: {
        Row: {
          address: string | null
          created_at: string
          id: string
          league_id: string
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          league_id: string
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          league_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "padel_venues_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      playtomic_venues: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          league_id: string
          name: string
          playtomic_url: string | null
          tenant_id: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          league_id: string
          name: string
          playtomic_url?: string | null
          tenant_id: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          league_id?: string
          name?: string
          playtomic_url?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playtomic_venues_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string
          group_name: string | null
          id: string
          league_id: string | null
          logo_url: string | null
          name: string
          player1_email: string | null
          player1_name: string | null
          player1_phone: string | null
          player2_email: string | null
          player2_name: string | null
          player2_phone: string | null
        }
        Insert: {
          created_at?: string
          group_name?: string | null
          id?: string
          league_id?: string | null
          logo_url?: string | null
          name: string
          player1_email?: string | null
          player1_name?: string | null
          player1_phone?: string | null
          player2_email?: string | null
          player2_name?: string | null
          player2_phone?: string | null
        }
        Update: {
          created_at?: string
          group_name?: string | null
          id?: string
          league_id?: string | null
          logo_url?: string | null
          name?: string
          player1_email?: string | null
          player1_name?: string | null
          player1_phone?: string | null
          player2_email?: string | null
          player2_name?: string | null
          player2_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          team_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams_public"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_courts: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name: string
          venue_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_courts_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "padel_venues"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      teams_public: {
        Row: {
          created_at: string | null
          id: string | null
          league_id: string | null
          logo_url: string | null
          name: string | null
          player1_name: string | null
          player2_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          league_id?: string | null
          logo_url?: string | null
          name?: string | null
          player1_name?: string | null
          player2_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          league_id?: string | null
          logo_url?: string | null
          name?: string | null
          player1_name?: string | null
          player2_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_view_team_contacts: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      get_user_leagues: { Args: { _user_id: string }; Returns: string[] }
      get_user_team: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_league_admin: {
        Args: { _league_id: string; _user_id: string }
        Returns: boolean
      }
      is_league_member: {
        Args: { _league_id: string; _user_id: string }
        Returns: boolean
      }
      is_team_captain: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      is_team_player: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
      join_league_team: {
        Args: {
          _league_id: string
          _player_name: string
          _player_phone: string
          _team_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "captain" | "viewer" | "player"
      league_role: "admin" | "player"
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
      app_role: ["admin", "captain", "viewer", "player"],
      league_role: ["admin", "player"],
    },
  },
} as const
