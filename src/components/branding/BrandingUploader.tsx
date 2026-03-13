import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSignUpload } from "@/hooks/useSignUpload";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface BrandingUploaderProps {
  logoUrl: string | undefined;
  onLogoUrlChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

export function BrandingUploader({
  logoUrl,
  onLogoUrlChange,
  disabled = false,
  className,
}: BrandingUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const signUpload = useSignUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = file.type?.toLowerCase() ?? "";
    if (!ALLOWED_TYPES.includes(type)) {
      toast.error("Use PNG, JPEG, or WebP");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File must be under 5MB");
      return;
    }

    try {
      const { signedUrl, publicUrl } = await signUpload.mutateAsync({
        fileName: file.name,
        contentType: type,
        fileSize: file.size,
      });

      if (!signedUrl) {
        toast.error("Upload failed");
        return;
      }

      const res = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": type },
      });

      if (!res.ok) {
        toast.error("Upload failed");
        return;
      }

      onLogoUrlChange(publicUrl);
      toast.success("Logo uploaded");
    } catch {
      // Error already toasted in mutation
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">Logo (optional)</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {logoUrl ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-[rgb(var(--input))] p-3">
            <img
              src={logoUrl}
              alt="Logo"
              className="h-14 w-14 rounded-lg object-contain"
            />
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || signUpload.isPending}
                onClick={() => inputRef.current?.click()}
              >
                {signUpload.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Change"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() => onLogoUrlChange("")}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled || signUpload.isPending}
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-[rgb(var(--input))] transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            {signUpload.isPending ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Upload logo (PNG, JPEG, WebP, max 5MB)
                </span>
              </>
            )}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          className="hidden"
          aria-hidden
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
