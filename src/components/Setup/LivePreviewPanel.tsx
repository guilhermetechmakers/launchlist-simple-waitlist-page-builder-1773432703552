/**
 * Live preview panel: desktop and mobile preview of the public waitlist page.
 * Header with logo, hero area, description, email input mock, CTA with chosen color, mocked counter.
 * Uses design-system tokens (no hardcoded hex), Lucide icons, and consistent shadows.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Eye,
  Monitor,
  Smartphone,
  Share2,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";

function maskEmail(email: string): string {
  if (!email?.trim()) return "you@example.com";
  const [local, domain] = email.trim().split("@");
  if (!domain) return "•••@•••";
  const maskedLocal = local.length <= 2 ? "••" : local.slice(0, 2) + "•••";
  return `${maskedLocal}@${domain}`;
}

export interface LivePreviewPanelProps {
  productName?: string;
  description?: string;
  recipientEmail?: string;
  buttonColor?: string;
  logoUrl?: string;
  /** Mocked count for preview */
  submissionsCount?: number;
  slug?: string;
  publicUrl?: string;
  className?: string;
}

type LogoState = "idle" | "loading" | "loaded" | "error";

function PreviewBlock({
  productName,
  description,
  recipientEmail,
  buttonColor,
  logoUrl,
  submissionsCount = 0,
  compact = false,
}: LivePreviewPanelProps & { compact?: boolean }) {
  const [logoState, setLogoState] = useState<LogoState>(logoUrl ? "loading" : "idle");
  const hasCustomColor = Boolean((buttonColor ?? "").trim());
  const customColor = hasCustomColor ? (buttonColor ?? "").trim() : undefined;
  const name = (productName ?? "").trim() || "Your Product";
  const desc = (description ?? "").trim() || "Short description for early adopters.";

  const handleLogoLoad = useCallback(() => setLogoState("loaded"), []);
  const handleLogoError = useCallback(() => setLogoState("error"), []);

  useEffect(() => {
    if (!logoUrl) setLogoState("idle");
    else setLogoState("loading");
  }, [logoUrl]);

  return (
    <article
      role="article"
      aria-label="Waitlist page preview"
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover",
        compact ? "p-4" : "p-6"
      )}
    >
      {/* Logo: empty state (placeholder), loading skeleton, loaded image, or error state */}
      {logoUrl ? (
        <div className={cn("mb-4 flex justify-center", compact ? "min-h-[2.5rem]" : "min-h-[3.5rem]")}>
          {logoState === "loading" && (
            <div
              className={cn(
                "animate-pulse rounded-lg bg-muted",
                compact ? "h-10 w-20" : "h-14 w-28"
              )}
              aria-hidden
            />
          )}
          {logoState === "error" && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-muted-foreground",
                compact ? "h-10 text-xs" : "h-14 text-sm"
              )}
              role="status"
              aria-label="Logo failed to load"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
              <span>Logo unavailable</span>
            </div>
          )}
          <img
            src={logoUrl}
            alt=""
            className={cn(
              "object-contain transition-opacity duration-200",
              compact ? "h-10 w-auto max-w-[80px]" : "mx-auto h-14 w-auto max-w-[120px]",
              logoState === "loaded" ? "opacity-100" : "sr-only opacity-0"
            )}
            onLoad={handleLogoLoad}
            onError={handleLogoError}
            loading="eager"
          />
        </div>
      ) : (
        <div
          className={cn(
            "mb-4 flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground",
            compact ? "h-10" : "h-14"
          )}
          aria-hidden
        >
          <ImageIcon className={cn("shrink-0", compact ? "h-5 w-5" : "h-6 w-6")} />
        </div>
      )}

      <h3
        className={cn(
          "font-heading font-semibold text-foreground",
          compact ? "text-base" : "text-lg"
        )}
      >
        {name}
      </h3>
      <p
        className={cn(
          "mt-2 text-muted-foreground",
          compact ? "text-xs line-clamp-2" : "mt-2 text-sm"
        )}
      >
        {desc}
      </p>
      <div className={cn("flex gap-2", compact ? "mt-3" : "mt-4")}>
        <Input
          placeholder={maskEmail(recipientEmail ?? "")}
          readOnly
          disabled
          aria-label="Email address for waitlist signup"
          className={cn("flex-1 bg-[rgb(var(--input))]", compact && "h-9 text-sm")}
        />
        <Button
          size={compact ? "sm" : "sm"}
          className={cn(
            "shrink-0 shadow-button transition-all duration-200 hover:scale-[1.02] hover:shadow-button-hover active:scale-[0.98]",
            !customColor && "bg-primary text-primary-foreground"
          )}
          style={
            customColor
              ? {
                  backgroundColor: customColor,
                  color: "rgb(var(--primary-foreground))",
                }
              : undefined
          }
          aria-label="Join waitlist"
        >
          Join
        </Button>
      </div>
      <p className={cn("text-muted-foreground", compact ? "mt-2 text-xs" : "mt-3 text-xs")}>
        Join {submissionsCount} others on the list
      </p>
    </article>
  );
}

export function LivePreviewPanel({
  productName,
  description,
  recipientEmail,
  buttonColor,
  logoUrl,
  submissionsCount = 0,
  className,
}: LivePreviewPanelProps) {
  const displayName = (productName ?? "").trim() || "Your Product";
  const displayDesc = (description ?? "").trim() || "Short description for early adopters.";

  return (
    <section
      className={cn("space-y-4", className)}
      aria-labelledby="live-preview-heading"
      aria-describedby="live-preview-description"
    >
      <Card className="overflow-hidden shadow-card transition-shadow duration-200 hover:shadow-card-hover">
        <CardHeader>
          <h2
            id="live-preview-heading"
            className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground"
          >
            <Eye className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            Live preview
          </h2>
          <p id="live-preview-description" className="text-sm text-muted-foreground">
            Your public waitlist page
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="animate-fade-in" role="group" aria-label="Desktop preview">
            <p className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Monitor className="h-4 w-4 shrink-0" aria-hidden />
              Desktop
            </p>
            <PreviewBlock
              productName={productName}
              description={description}
              recipientEmail={recipientEmail}
              buttonColor={buttonColor}
              logoUrl={logoUrl}
              submissionsCount={submissionsCount}
            />
          </div>
          <div className="animate-fade-in" role="group" aria-label="Mobile preview">
            <p className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Smartphone className="h-4 w-4 shrink-0" aria-hidden />
              Mobile
            </p>
            <div className="max-w-[320px]">
              <PreviewBlock
                productName={productName}
                description={description}
                recipientEmail={recipientEmail}
                buttonColor={buttonColor}
                logoUrl={logoUrl}
                submissionsCount={submissionsCount}
                compact
              />
            </div>
          </div>
          <div
            className="rounded-xl border border-border bg-surface-dark p-4 shadow-card"
            role="region"
            aria-label="Social and Open Graph preview"
          >
            <p className="flex items-center gap-2 text-xs font-medium text-white/80">
              <Share2 className="h-4 w-4 shrink-0" aria-hidden />
              Social / OG preview
            </p>
            <div className="mt-2 flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
              ) : (
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white/10 text-white/60"
                  aria-hidden
                >
                  <ImageIcon className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {displayName}
                </p>
                <p className="line-clamp-2 text-xs text-white/70">
                  {displayDesc}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
