/**
 * Live preview panel: desktop and mobile preview of the public waitlist page.
 * Header with logo, hero area, description, email input mock, CTA with chosen color, mocked counter.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_COLOR = "#D6FF2A";

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

function PreviewBlock({
  productName,
  description,
  recipientEmail,
  buttonColor,
  logoUrl,
  submissionsCount = 0,
  compact = false,
}: LivePreviewPanelProps & { compact?: boolean }) {
  const color = (buttonColor ?? "").trim() || DEFAULT_COLOR;
  const name = (productName ?? "").trim() || "Your Product";
  const desc = (description ?? "").trim() || "Short description for early adopters.";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6",
        compact ? "p-4" : "p-6"
      )}
    >
      {logoUrl && (
        <img
          src={logoUrl}
          alt=""
          className={cn(
            "mb-4 object-contain",
            compact ? "h-10 w-auto max-w-[80px]" : "mx-auto mb-4 h-14 w-auto max-w-[120px]"
          )}
        />
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
          className={cn("flex-1 bg-[rgb(var(--input))]", compact && "h-9 text-sm")}
        />
        <Button
          size={compact ? "sm" : "sm"}
          className="shrink-0"
          style={{
            backgroundColor: color,
            color: "#0B0B0B",
          }}
        >
          Join
        </Button>
      </div>
      <p className={cn("text-muted-foreground", compact ? "mt-2 text-xs" : "mt-3 text-xs")}>
        Join {submissionsCount} others on the list
      </p>
    </div>
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
  return (
    <div className={cn("space-y-4", className)}>
      <Card className="overflow-hidden shadow-card transition-shadow duration-200 hover:shadow-card-hover">
        <CardHeader>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Live preview
          </h2>
          <p className="text-sm text-muted-foreground">Your public waitlist page</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="animate-fade-in">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Desktop</p>
            <PreviewBlock
              productName={productName}
              description={description}
              recipientEmail={recipientEmail}
              buttonColor={buttonColor}
              logoUrl={logoUrl}
              submissionsCount={submissionsCount}
            />
          </div>
          <div className="animate-fade-in">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Mobile</p>
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
          <div className="rounded-xl border border-border bg-[#1F2023] p-4">
            <p className="text-xs font-medium text-white/80">Social / OG preview</p>
            <div className="mt-2 flex items-center gap-3">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {(productName ?? "").trim() || "Your Product"}
                </p>
                <p className="line-clamp-2 text-xs text-white/70">
                  {(description ?? "").trim() || "Short description for early adopters."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
