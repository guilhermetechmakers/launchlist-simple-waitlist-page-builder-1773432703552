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
  social_image_url?: string | null;
  public_link?: string | null;
  branding_version?: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/** Client-side branding state for Setup flow and API payloads */
export interface BrandingState {
  productName: string;
  description: string;
  recipientEmail: string;
  buttonColor: string;
  logoUrl?: string;
  socialImageUrl?: string;
  publicLink?: string;
  brandingVersion: number;
}

export interface CreateProjectInput {
  name: string;
  description?: string | null;
  recipient_email: string;
  slug: string;
  button_color?: string;
  logo_url?: string | null;
  social_image_url?: string | null;
  is_public?: boolean;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
  recipient_email?: string;
  slug?: string;
  button_color?: string;
  logo_url?: string | null;
  social_image_url?: string | null;
  public_link?: string | null;
  branding_version?: number;
  is_public?: boolean;
}

export interface ProjectWithCount extends Project {
  waitlist_count?: number;
}
