import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useJoinWaitlist(slug: string) {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase.functions.invoke("join", {
        body: { slug, email: email.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => toast.success("You're on the list!"),
    onError: (e: Error) => toast.error(e.message),
  });
}
