import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export interface PublicLinkGeneratorProps {
  slug: string | undefined;
  publicLink?: string | null;
  brandingVersion?: number;
  className?: string;
}

export function PublicLinkGenerator({
  slug,
  publicLink,
  brandingVersion = 0,
  className,
}: PublicLinkGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";
  const safeSlug = slug?.trim() ?? "";
  const url = publicLink && publicLink.length > 0
    ? publicLink
    : (safeSlug ? `${baseUrl}/r/${safeSlug}` : "");
  const urlWithVersion =
    url && brandingVersion > 0 ? `${url}?v=${brandingVersion}` : url;

  const handleCopy = async () => {
    if (!urlWithVersion) return;
    try {
      await navigator.clipboard.writeText(urlWithVersion);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  if (!safeSlug) return null;

  return (
    <Card className={cn("shadow-card", className)}>
      <CardHeader>
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Public link
        </h2>
        <p className="text-sm text-muted-foreground">
          Share this link so visitors can join your waitlist.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            readOnly
            value={urlWithVersion}
            className="font-mono text-sm"
            aria-label="Public waitlist URL"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={!urlWithVersion}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {urlWithVersion && (
          <a
            href={urlWithVersion}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in new tab
          </a>
        )}
      </CardContent>
    </Card>
  );
}
