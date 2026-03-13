/**
 * Client-side image upload with basic crop/resize to 300x300 for header.
 * Returns optimized data URL or blob for upload.
 */

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

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
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">Logo (optional)</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {imageUrl ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-[rgb(var(--input))] p-3">
            <img
              src={imageUrl}
              alt="Logo"
              className="h-14 w-14 rounded-lg object-contain"
            />
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || loading}
                onClick={() => inputRef.current?.click()}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Change"
                )}
              </Button>
              {onClear && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  onClick={onClear}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled || loading}
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-[rgb(var(--input))] transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground" />
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
    </div>
  );
}
