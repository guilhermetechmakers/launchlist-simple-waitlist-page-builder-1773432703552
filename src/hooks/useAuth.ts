import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const authKeys = {
  user: ["auth", "user"] as const,
};

export function useUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSignUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName?: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.user });
      toast.success("Check your email to confirm your account");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSignIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.user });
      toast.success("Signed in");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => supabase.auth.signOut(),
    onSuccess: () => {
      qc.clear();
      toast.success("Signed out");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    },
    onSuccess: () => toast.success("Check your email for the reset link"),
    onError: (e: Error) => toast.error(e.message),
  });
}
