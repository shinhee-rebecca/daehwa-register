export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      administrators: {
        Row: {
          google_email: string
          created_at: string
          gender: string
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          google_email: string
          created_at?: string
          gender: string
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          google_email?: string
          created_at?: string
          gender?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      leaders: {
        Row: {
          assigned_meeting_id: string | null
          created_at: string
          gender: string
          google_email: string
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          assigned_meeting_id?: string | null
          created_at?: string
          gender: string
          google_email: string
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          assigned_meeting_id?: string | null
          created_at?: string
          gender?: string
          google_email?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaders_assigned_meeting_id_fkey"
            columns: ["assigned_meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          age: number
          created_at: string
          current_meeting_id: string | null
          fee: number
          first_registration_month: string
          gender: string
          id: string
          latest_registration: string
          months: number
          name: string
          notes: string | null
          past_meetings: string[] | null
          phone: string
          re_registration: boolean
          updated_at: string
        }
        Insert: {
          age: number
          created_at?: string
          current_meeting_id?: string | null
          fee: number
          first_registration_month: string
          gender: string
          id?: string
          latest_registration: string
          months?: number
          name: string
          notes?: string | null
          past_meetings?: string[] | null
          phone: string
          re_registration?: boolean
          updated_at?: string
        }
        Update: {
          age?: number
          created_at?: string
          current_meeting_id?: string | null
          fee?: number
          first_registration_month?: string
          gender?: string
          id?: string
          latest_registration?: string
          months?: number
          name?: string
          notes?: string | null
          past_meetings?: string[] | null
          phone?: string
          re_registration?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_current_meeting_id_fkey"
            columns: ["current_meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
