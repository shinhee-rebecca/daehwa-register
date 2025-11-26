export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      administrators: {
        Row: {
          id: string
          gender: 'male' | 'female'
          name: string
          phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gender: 'male' | 'female'
          name: string
          phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gender?: 'male' | 'female'
          name?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leaders: {
        Row: {
          id: string
          gender: 'male' | 'female'
          name: string
          phone: string
          assigned_meeting_id: string | null
          google_email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gender: 'male' | 'female'
          name: string
          phone: string
          assigned_meeting_id?: string | null
          google_email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gender?: 'male' | 'female'
          name?: string
          phone?: string
          assigned_meeting_id?: string | null
          google_email?: string
          created_at?: string
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          gender: 'male' | 'female'
          age: number
          name: string
          months: number
          first_registration_month: string
          phone: string
          fee: number
          re_registration: boolean
          latest_registration: string
          current_meeting_id: string | null
          notes: string | null
          past_meetings: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gender: 'male' | 'female'
          age: number
          name: string
          months: number
          first_registration_month: string
          phone: string
          fee: number
          re_registration?: boolean
          latest_registration: string
          current_meeting_id?: string | null
          notes?: string | null
          past_meetings?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gender?: 'male' | 'female'
          age?: number
          name?: string
          months?: number
          first_registration_month?: string
          phone?: string
          fee?: number
          re_registration?: boolean
          latest_registration?: string
          current_meeting_id?: string | null
          notes?: string | null
          past_meetings?: string[]
          created_at?: string
          updated_at?: string
        }
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
  }
}
