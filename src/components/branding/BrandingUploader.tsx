import { useRef, useId } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSignUpload } from "@/hooks/useSignUpload";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const UPLOAD_LABEL = "Upload logo (PNG, JPEG, WebP, max 5MB)";

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
  // Stable id for file input so the label can be associated for screen readers
  const inputId = useId();

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

  const isPending = signUpload.isPending;
  const isError = signUpload.isError;
  const errorMessage = signUpload.error instanceof Error ? signUpload.error.message : null;

  return (
    <div className={cn("space-y-2", className)}>
      <span className="text-sm font-medium text-foreground">Logo (optional)</span>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {logoUrl ? (
          <Card className="w-full max-w-sm rounded-xl border-border bg-card shadow-card">
            <CardContent className="flex flex-row items-center gap-6 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-input">
                <img
                  src={logoUrl}
                  alt="Uploaded logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex min-h-[44px] flex-col justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  disabled={disabled || isPending}
                  onClick={() => inputRef.current?.click()}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    "Change"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="default"
                  className="min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  disabled={disabled}
                  onClick={() => onLogoUrlChange("")}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Label
              htmlFor={inputId}
              className={cn(
                "flex min-h-[96px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-input transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                isPending && "pointer-events-none opacity-70"
              )}
            >
              {isPending ? (
                <>
                  <Loader2
                    className="h-6 w-6 animate-spin text-foreground/90"
                    aria-hidden
                  />
                  <span className="text-sm text-foreground/90">
                    Uploading…
                  </span>
                </>
              ) : (
                <>
                  <Upload
                    className="h-6 w-6 text-foreground/90"
                    aria-hidden
                  />
                  <span className="text-sm text-foreground/90">
                    {UPLOAD_LABEL}
                  </span>
                </>
              )}
            </Label>
            {/* When no logo, the Label above wraps the dropzone and is the accessible name for the input */}
          </>
        )}

        {/* When logo is set, the input has no visible label; provide an sr-only label so the input still has an accessible name when triggered by "Change" */}
        {logoUrl && (
          <Label htmlFor={inputId} className="sr-only">
            {UPLOAD_LABEL}
          </Label>
        )}

        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          className="sr-only"
          disabled={disabled}
          onChange={handleFileSelect}
        />
      </div>

      {/* Inline error state: show mutation error so users see feedback in context */}
      {isError && errorMessage && (
        <p
          role="alert"
          className="text-sm text-destructive"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
