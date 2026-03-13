/**
 * Client-side image upload with basic crop/resize to 300x300 for header.
 * Returns optimized data URL or blob for upload.
 * Supports loading (resize) and uploading (signed URL) states and inline error.
 */

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const TARGET_SIZE = 300;

export interface ImageUploaderProps {
  imageUrl: string | undefined;
  onImageReady: (dataUrl: string, blob?: Blob) => void;
  onClear?: () => void;
  disabled?: boolean;
  /** When true, parent is uploading (e.g. signed URL); show loading state. */
  uploading?: boolean;
  /** Inline error message for form validation or upload failure. */
  error?: string | null;
  className?: string;
}

function resizeImage(
  file: File
): Promise<{ dataUrl: string; blob: Blob }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const scale = Math.min(TARGET_SIZE / w, TARGET_SIZE / h, 1);
      const dw = Math.round(w * scale);
      const dh = Math.round(h * scale);
      const canvas = document.createElement("canvas");
      canvas.width = dw;
      canvas.height = dh;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, dw, dh);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Blob failed"));
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              dataUrl: reader.result as string,
              blob,
            });
          };
          reader.readAsDataURL(blob);
        },
        "image/webp",
        0.9
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };
    img.src = url;
  });
}

export function ImageUploader({
  imageUrl,
  onImageReady,
  onClear,
  disabled = false,
  uploading = false,
  error,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const isBusy = loading || uploading;
  const errorMessage = error ?? undefined;
  const errorId = "image-uploader-error";

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

    setLoading(true);
    try {
      const { dataUrl, blob } = await resizeImage(file);
      onImageReady(dataUrl, blob);
      toast.success("Logo ready");
    } catch {
      toast.error("Image processing failed");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn("space-y-2", className)}
      role="group"
      aria-labelledby="image-uploader-label"
      aria-describedby={errorMessage ? errorId : undefined}
      aria-invalid={!!errorMessage}
    >
      <Label id="image-uploader-label" className={cn(errorMessage && "text-destructive")}>
        Logo (optional)
      </Label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {imageUrl ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-[rgb(var(--input))] p-3 shadow-sm transition-shadow duration-200 hover:shadow-card">
            <img
              src={imageUrl}
              alt="Uploaded logo"
              className="h-14 w-14 rounded-lg object-contain"
            />
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || isBusy}
                onClick={() => inputRef.current?.click()}
                aria-label="Change logo image"
                aria-busy={isBusy}
              >
                {isBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  "Change"
                )}
              </Button>
              {onClear && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled || isBusy}
                  onClick={onClear}
                  aria-label="Remove logo"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled || isBusy}
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-[rgb(var(--input))] shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2"
            aria-label="Upload logo. PNG, JPEG or WebP, max 5MB. Image will be resized to 300px."
            aria-busy={isBusy}
          >
            {isBusy ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground" aria-hidden />
                <span className="text-sm text-muted-foreground">
                  Upload logo (resized to 300px, PNG/JPEG/WebP, max 5MB)
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
      {errorMessage && (
        <p id={errorId} className="text-sm font-medium text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
