import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { WaitlistEntry } from "@/types/waitlist";

export const submissionKeys = {
  all: ["submissions"] as const,
  list: (projectId: string) => [...submissionKeys.all, projectId] as const,
};

export function useSubmissions(projectId: string | undefined, from?: string, to?: string) {
  return useQuery({
    queryKey: [...submissionKeys.list(projectId ?? ""), from, to],
    queryFn: async () => {
      let q = supabase
        .from("waitlist_entries")
        .select("*")
        .eq("project_id", projectId!)
        .order("created_at", { ascending: false });
      if (from) q = q.gte("created_at", from);
      if (to) q = q.lte("created_at", to);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as WaitlistEntry[];
    },
    enabled: !!projectId,
  });
}

export function useExportSubmissions(projectId: string) {
  return useMutation({
    mutationFn: async ({ from, to }: { from?: string; to?: string } = {}) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");
      const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-submissions`);
      if (from) url.searchParams.set("from", from);
      if (to) url.searchParams.set("to", to);
      url.searchParams.set("project_id", projectId);
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) throw new Error("Export failed");
      return res.blob();
    },
    onSuccess: (blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `waitlist-${projectId}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success("CSV downloaded");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteSubmission(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from("waitlist_entries")
        .delete()
        .eq("id", entryId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: submissionKeys.list(projectId) });
      toast.success("Entry removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
