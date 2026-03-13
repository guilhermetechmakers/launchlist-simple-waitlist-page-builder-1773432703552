/**
 * Project API client — create, update, fetch projects.
 * Uses Supabase; all responses guarded for runtime safety.
 */

import { supabase } from "@/lib/supabase";
import type { Project, CreateProjectInput, UpdateProjectInput } from "@/types/project";

export interface ProjectListResponse {
  projects: Project[];
}

export interface ProjectDetailResponse {
  project: Project | null;
}

/** Fetch a single project by id. Returns null if not found or error. */
export async function fetchProject(id: string | undefined): Promise<Project | null> {
  if (!id?.trim()) return null;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  if (error) throw error;
  return (data ?? null) as Project | null;
}

/** Fetch all projects for the current user. Returns empty array on missing data. */
export async function fetchProjects(): Promise<Project[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("projects")
    .select("*, waitlist_entries(count)")
    .eq("owner_user_id", user.id)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  const rows = Array.isArray(data) ? data : (data ? [data] : []);
  type Row = Project & { waitlist_entries?: { count: number }[] | { count: number } };
  return rows.map((p: Row) => ({
    ...p,
    waitlist_count: Array.isArray(p.waitlist_entries)
      ? (p.waitlist_entries[0] as { count: number } | undefined)?.count ?? 0
      : (p.waitlist_entries as { count: number } | undefined)?.count ?? 0,
  })) as Project[];
}

/** Create a project. Requires auth. */
export async function createProject(
  payload: CreateProjectInput
): Promise<Project> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_user_id: user.id,
      name: payload.name,
      description: payload.description ?? null,
      recipient_email: payload.recipient_email,
      slug: payload.slug,
      button_color: payload.button_color ?? "#D6FF2A",
      logo_url: payload.logo_url ?? null,
      is_public: payload.is_public ?? true,
    })
    .select()
    .single();
  if (error) throw error;
  if (!data) throw new Error("Create project returned no data");
  return data as Project;
}

/** Update a project by id. */
export async function updateProject(
  id: string,
  payload: UpdateProjectInput
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  if (!data) throw new Error("Update project returned no data");
  return data as Project;
}
