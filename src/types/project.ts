export interface Project {
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
}

export interface CreateProjectInput {
  name: string;
  description?: string | null;
  recipient_email: string;
  slug: string;
  button_color?: string;
  logo_url?: string | null;
  is_public?: boolean;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
  recipient_email?: string;
  slug?: string;
  button_color?: string;
  logo_url?: string | null;
  is_public?: boolean;
}

export interface ProjectWithCount extends Project {
  waitlist_count?: number;
}
