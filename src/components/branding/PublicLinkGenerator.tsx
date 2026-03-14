import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Copy, Check, ExternalLink, Link2 } from "lucide-react";
import { toast } from "sonner";

export interface PublicLinkGeneratorProps {
  /** URL slug for the waitlist (used to build link when publicLink not set). */
  slug: string | undefined;
  /** Override public URL when available (e.g. from API). */
  publicLink?: string | null;
  /** Optional cache-busting version query param. */
  brandingVersion?: number;
  /** Optional CSS class for the card. */
  className?: string;
  /**
   * Heading level for the card title for accessibility.
   * Use 1 when this card is the main content of the page (e.g. dedicated view); use 2 when under a page h1.
   */
  titleLevel?: 1 | 2;
}

/** Consistent icon size for all Lucide icons in this component (design system). */
const ICON_SIZE = "h-4 w-4";

export function PublicLinkGenerator({
  slug,
  publicLink,
  brandingVersion = 0,
  className,
  titleLevel = 2,
}: PublicLinkGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";
  const safeSlug = slug?.trim() ?? "";
  const url =
    publicLink && publicLink.length > 0
      ? publicLink
      : safeSlug
        ? `${baseUrl}/r/${safeSlug}`
        : "";
  const urlWithVersion =
    url && brandingVersion > 0 ? `${url}?v=${brandingVersion}` : url;

  const handleCopy = useCallback(async () => {
    if (!urlWithVersion) return;
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(urlWithVersion);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const message = "Copy failed";
      setCopyError(message);
      toast.error(message);
      setTimeout(() => setCopyError(null), 5000);
    }
  }, [urlWithVersion]);

  const TitleTag = titleLevel === 1 ? "h1" : "h2";

  // Empty state: no slug yet — show card with helpful message (design: empty states with CTA/hint)
  if (!safeSlug) {
    return (
      <Card
        className={cn(
          "shadow-card border-border bg-card text-card-foreground",
          className
        )}
        aria-labelledby="public-link-empty-title"
      >
        <CardHeader>
          <TitleTag
            id="public-link-empty-title"
            className="font-heading text-lg font-semibold text-foreground"
          >
            Public link
          </TitleTag>
          <p className="text-sm text-muted-foreground">
            Add a URL slug in the form above to generate your public waitlist link.
          </p>
        </CardHeader>
        <CardContent>
          <div
            className="flex min-h-[120px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-[rgb(var(--input))] px-4 py-6 text-center"
            role="status"
            aria-label="Waiting for slug"
          >
            <Link2
              className={cn(ICON_SIZE, "text-muted-foreground")}
              aria-hidden
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Your shareable link will appear here once you save a slug.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "shadow-card border-border bg-card text-card-foreground transition-shadow duration-200 hover:shadow-card-hover",
        className
      )}
      aria-labelledby="public-link-title"
    >
      <CardHeader>
        <TitleTag
          id="public-link-title"
          className="font-heading text-lg font-semibold text-foreground"
        >
          Public link
        </TitleTag>
        <p className="text-sm text-muted-foreground">
          Share this link so visitors can join your waitlist.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          <Input
            readOnly
            value={urlWithVersion}
            className="min-h-11 flex-1 font-mono text-sm text-foreground placeholder:text-muted-foreground"
            aria-label="Public waitlist URL"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={!urlWithVersion}
            aria-label="Copy link"
            className="min-h-[44px] min-w-[44px] shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {copied ? (
              <Check className={cn(ICON_SIZE, "text-primary")} aria-hidden />
            ) : (
              <Copy className={ICON_SIZE} aria-hidden />
            )}
          </Button>
        </div>

        {copyError && (
          <p
            className="text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {copyError}
          </p>
        )}

        {urlWithVersion && (
          <a
            href={urlWithVersion}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 self-start rounded-md px-1 py-2 text-sm text-primary outline-none transition-colors duration-200 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Open public waitlist in new tab"
          >
            <ExternalLink className={cn(ICON_SIZE, "shrink-0")} aria-hidden />
            <span>Open in new tab</span>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
