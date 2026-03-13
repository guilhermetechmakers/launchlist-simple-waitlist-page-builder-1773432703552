import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { projectKeys } from "@/hooks/useProjects";

export interface PublishProjectResponse {
  success: boolean;
  publicLink?: string;
  message?: string;
}

export function usePublishProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string): Promise<PublishProjectResponse> => {
      const { data, error } = await supabase.functions.invoke("project-publish", {
        body: { projectId },
      });
      if (error) throw error;
      const result = data as PublishProjectResponse | undefined;
      if (result?.success === false && result?.message) {
        throw new Error(result.message);
      }
      if (!result?.success) throw new Error("Publish failed");
      return result;
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success("Published");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
