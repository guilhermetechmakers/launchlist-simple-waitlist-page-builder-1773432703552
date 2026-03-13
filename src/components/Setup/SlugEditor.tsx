/**
 * Slug editor: editable slug with validation and public URL preview + copy.
 */

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface SlugEditorProps {
  slug: string;
  onSlugChange: (value: string) => void;
  error?: string | null;
  suggestedSlug?: string;
  disabled?: boolean;
  className?: string;
}

export function SlugEditor({
  slug,
  onSlugChange,
  error,
  suggestedSlug,
  disabled = false,
  className,
}: SlugEditorProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const safeSlug = (slug ?? "").trim().toLowerCase();
  const publicUrl = safeSlug ? `${baseUrl}/r/${safeSlug}` : "";

  const handleCopy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2">
        <Label htmlFor="slug-input">URL slug</Label>
        <Input
          id="slug-input"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder={suggestedSlug ?? "my-product-waitlist"}
          disabled={disabled}
          className="font-mono"
          aria-invalid={!!error}
          aria-describedby={error ? "slug-error" : undefined}
        />
        {error && (
          <p id="slug-error" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Only lowercase letters, numbers, and hyphens. Auto-generated from product name.
        </p>
      </div>
      {publicUrl && (
        <div className="space-y-2">
          <Label className="text-muted-foreground">Public URL</Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={publicUrl}
              className="font-mono text-sm"
              aria-label="Public waitlist URL"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              disabled={!publicUrl}
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in new tab
          </a>
        </div>
      )}
    </div>
  );
}
