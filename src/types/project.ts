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

/** Dashboard card view: project with submission stats and display helpers */
export interface DashboardProject extends Project {
  waitlist_count?: number;
  /** Same as waitlist_count for display */
  submissionCount?: number;
  /** Last signup timestamp (from waitlist_entries or project.updated_at) */
  lastSubmissionAt?: string | null;
  /** Public URL for the waitlist page */
  url?: string;
  /** Whether project has a logo (derived from logo_url) */
  hasLogo?: boolean;
  /** Button color for branding preview (alias for button_color) */
  color?: string;
  /** Optional branding metadata for preview */
  branding?: Record<string, unknown>;
}

/** Map ProjectWithCount to DashboardProject (url, submissionCount, lastSubmissionAt, hasLogo, color). */
export function toDashboardProject(
  p: ProjectWithCount,
  baseUrl?: string
): DashboardProject {
  const origin =
    typeof window !== "undefined" ? window.location.origin : baseUrl ?? "";
  const slug = p.slug ?? "";
  return {
    ...p,
    submissionCount: p.waitlist_count ?? 0,
    lastSubmissionAt: p.updated_at ?? null,
    url: origin ? `${origin}/r/${slug}` : `/r/${slug}`,
    hasLogo: !!(p.logo_url?.trim?.()),
    color: p.button_color ?? "#D6FF2A",
  };
}
