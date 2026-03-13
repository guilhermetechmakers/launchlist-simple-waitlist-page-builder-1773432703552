export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          owner_user_id: string;
          name: string;
          description: string | null;
          recipient_email: string;
          slug: string;
          button_color: string;
          logo_url: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          owner_user_id: string;
          name: string;
          description?: string | null;
          recipient_email: string;
          slug: string;
          button_color?: string;
          logo_url?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          owner_user_id?: string;
          name?: string;
          description?: string | null;
          recipient_email?: string;
          slug?: string;
          button_color?: string;
          logo_url?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      waitlist_entries: {
        Row: {
          id: string;
          project_id: string;
          email: string;
          ip_hash: string | null;
          user_agent: string | null;
          referrer: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          email: string;
          ip_hash?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          email?: string;
          ip_hash?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
  };
}
