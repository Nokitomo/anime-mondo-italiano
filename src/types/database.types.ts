
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
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      anime_list: {
        Row: {
          id: string
          user_id: string
          anime_id: number
          status: 'IN_CORSO' | 'COMPLETATO' | 'IN_PAUSA' | 'ABBANDONATO' | 'PIANIFICATO'
          progress: number
          score: number
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          anime_id: number
          status: 'IN_CORSO' | 'COMPLETATO' | 'IN_PAUSA' | 'ABBANDONATO' | 'PIANIFICATO'
          progress?: number
          score?: number
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          anime_id?: number
          status?: 'IN_CORSO' | 'COMPLETATO' | 'IN_PAUSA' | 'ABBANDONATO' | 'PIANIFICATO'
          progress?: number
          score?: number
          notes?: string
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
