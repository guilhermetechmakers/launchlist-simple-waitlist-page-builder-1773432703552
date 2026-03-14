/**
 * Slug editor: editable slug with validation and public URL preview + copy.
 * Uses semantic headings (h2/h3), design tokens only, and empty/loading/error states.
 */

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Copy, Check, ExternalLink, Link2 } from "lucide-react";
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
  const [isCopying, setIsCopying] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const safeSlug = (slug ?? "").trim().toLowerCase();
  const publicUrl = safeSlug ? `${baseUrl}/r/${safeSlug}` : "";

  const handleCopy = async () => {
    if (!publicUrl) return;
    setIsCopying(true);
    setCopied(false);
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <section
      className={cn("space-y-4", className)}
      aria-labelledby="slug-editor-heading"
    >
      {/* Semantic heading for section; required for logical heading hierarchy */}
      <h2
        id="slug-editor-heading"
        className="font-heading text-lg font-semibold leading-tight text-foreground"
      >
        URL slug & public link
      </h2>

      <div className="space-y-2">
        <Label htmlFor="slug-input" className="text-foreground">
          URL slug
        </Label>
        <Input
          id="slug-input"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder={suggestedSlug ?? "my-product-waitlist"}
          disabled={disabled}
          className={cn(
            "font-mono",
            error && "border-destructive focus-visible:ring-destructive/20"
          )}
          aria-invalid={!!error}
          aria-describedby={error ? "slug-error" : "slug-hint"}
        />
        {error && (
          <p
            id="slug-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        <p
          id="slug-hint"
          className="text-xs text-muted-foreground"
        >
          Only lowercase letters, numbers, and hyphens. Auto-generated from product name.
        </p>
      </div>

      {publicUrl ? (
        <Card className="overflow-hidden border-border bg-card shadow-card transition-shadow duration-200">
          <CardContent className="space-y-3 p-4 sm:p-5">
            <h3 className="font-heading text-sm font-semibold text-foreground">
              Public URL
            </h3>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                readOnly
                value={publicUrl}
                className="font-mono text-sm text-foreground bg-input border-border"
                aria-label="Public waitlist URL"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!publicUrl || isCopying}
                loading={isCopying}
                aria-label={copied ? "Link copied" : "Copy link"}
                className="shrink-0 self-stretch min-h-[2.75rem] sm:self-auto sm:min-h-0 sm:h-10 sm:w-10"
              >
                {isCopying ? null : copied ? (
                  <Check className="h-4 w-4 text-primary" aria-hidden />
                ) : (
                  <Copy className="h-4 w-4 text-foreground" aria-hidden />
                )}
              </Button>
            </div>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 rounded-sm"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Open in new tab
            </a>
          </CardContent>
        </Card>
      ) : (
        /* Empty state when no slug yet: design tokens only */
        <Card className="overflow-hidden border-border bg-card border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
            <Link2
              className="h-10 w-10 text-muted-foreground"
              aria-hidden
            />
            <p className="text-sm text-muted-foreground">
              Enter a slug above to see your public link
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
