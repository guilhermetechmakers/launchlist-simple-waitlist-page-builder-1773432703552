import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Project, CreateProjectInput, UpdateProjectInput } from "@/types/project";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters?: string) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  bySlug: (slug: string) => [...projectKeys.all, "slug", slug] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          waitlist_entries(count)
        `)
        .is("deleted_at", null)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      type Row = Project & { waitlist_entries?: { count: number }[] | { count: number } };
      return (data ?? []).map((p: Row) => ({
        ...p,
        waitlist_count: Array.isArray(p.waitlist_entries)
          ? (p.waitlist_entries[0] as { count: number } | undefined)?.count ?? 0
          : (p.waitlist_entries as { count: number } | undefined)?.count ?? 0,
      }));
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) throw new Error("No project id");
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Project;
    },
    enabled: !!id,
  });
}

export function useProjectBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: projectKeys.bySlug(slug ?? ""),
    queryFn: async () => {
      if (!slug) throw new Error("No slug");
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("is_public", true)
        .is("deleted_at", null)
        .single();
      if (error) throw error;
      return data as Project;
    },
    enabled: !!slug,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("projects")
        .insert({
          owner_user_id: user.id,
          name: input.name,
          description: input.description ?? null,
          recipient_email: input.recipient_email,
          slug: input.slug,
          button_color: input.button_color ?? "#D6FF2A",
          logo_url: input.logo_url ?? null,
          is_public: input.is_public ?? true,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success("Waitlist created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: UpdateProjectInput) => {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Project;
    },
    onSuccess: (updated) => {
      qc.setQueryData(projectKeys.detail(id), updated);
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success("Waitlist updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from("projects")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", projectId);
      if (error) throw error;
    },
    onSuccess: (_, projectId) => {
      qc.removeQueries({ queryKey: projectKeys.detail(projectId) });
      qc.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success("Waitlist deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
