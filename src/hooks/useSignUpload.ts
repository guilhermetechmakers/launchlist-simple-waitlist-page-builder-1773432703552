import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface SignUploadResponse {
  path: string;
  signedUrl: string | null;
  token: string | null;
  publicUrl: string;
}

export interface SignUploadInput {
  fileName: string;
  contentType: string;
  fileSize: number;
  bucket?: string;
}

export function useSignUpload() {
  return useMutation({
    mutationFn: async (input: SignUploadInput): Promise<SignUploadResponse> => {
      const { data, error } = await supabase.functions.invoke("uploads-sign", {
        body: {
          fileName: input.fileName,
          contentType: input.contentType,
          fileSize: input.fileSize,
          bucket: input.bucket,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error as string);
      const signedUrl = data?.signedUrl ?? null;
      const publicUrl = typeof data?.publicUrl === "string" ? data.publicUrl : "";
      if (!publicUrl && !signedUrl) throw new Error("Invalid sign-upload response");
      return {
        path: data?.path ?? "",
        signedUrl,
        token: data?.token ?? null,
        publicUrl,
      };
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
