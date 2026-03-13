import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, UserPlus, ImageIcon } from "lucide-react";

/** Design system primary (neon) – used only to detect "use theme" vs custom button color */
const PRIMARY_HEX = "#D6FF2A";

function maskEmail(email: string): string {
  if (!email?.trim()) return "you@example.com";
  const [local, domain] = email.trim().split("@");
  if (!domain) return "•••@•••";
  const maskedLocal = local.length <= 2 ? "••" : local.slice(0, 2) + "•••";
  return `${maskedLocal}@${domain}`;
}

export interface LivePreviewProps {
  productName?: string;
  description?: string;
  recipientEmail?: string;
  buttonColor?: string;
  logoUrl?: string;
  className?: string;
}

export function LivePreview({
  productName,
  description,
  recipientEmail,
  buttonColor,
  logoUrl,
  className,
}: LivePreviewProps) {
  const customColor = buttonColor?.trim() || undefined;
  const usePrimaryToken =
    !customColor ||
    customColor.toLowerCase() === PRIMARY_HEX.toLowerCase();
  const name = (productName ?? "").trim() || "Your Product";
  const desc =
    (description ?? "").trim() || "Short description for early adopters.";

  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const showLogo = Boolean(logoUrl?.trim());
  const showLogoPlaceholder = showLogo && (!logoLoaded || logoError);

  return (
    <div className={cn("space-y-4", className)} role="region" aria-label="Live preview of waitlist page">
      <Card className="overflow-hidden shadow-card transition-shadow duration-200 hover:shadow-card-hover">
        <CardHeader>
          <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
            <Eye className="h-5 w-5 text-muted-foreground" aria-hidden />
            Preview
          </h2>
          <p className="text-sm text-muted-foreground">Your public page</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main preview card – design system shadow for consistency */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow duration-200 sm:p-6 animate-fade-in">
            {showLogo && (
              <div className="mx-auto mb-4 flex h-14 min-h-14 w-full max-w-[120px] items-center justify-center">
                {showLogoPlaceholder ? (
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-lg bg-muted/50",
                      logoError && "border border-border"
                    )}
                    aria-hidden
                  >
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                ) : (
                  <img
                    src={logoUrl}
                    alt="Product logo"
                    className="mx-auto h-14 w-auto max-w-[120px] object-contain"
                    onLoad={() => {
                      setLogoLoaded(true);
                      setLogoError(false);
                    }}
                    onError={() => setLogoError(true)}
                  />
                )}
              </div>
            )}
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-2">
              <Input
                placeholder={maskEmail(recipientEmail ?? "")}
                readOnly
                disabled
                aria-label="Email field preview"
                className="flex-1 bg-[rgb(var(--input))]"
              />
              <Button
                size="sm"
                className="shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                aria-label="Join waitlist"
                {...(usePrimaryToken
                  ? {}
                  : {
                      style: {
                        backgroundColor: customColor,
                        color: "rgb(var(--primary-foreground))",
                      },
                    })}
              >
                <UserPlus className="h-4 w-4" aria-hidden />
                Join
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Join 0 others on the list
            </p>
          </div>

          {/* Social / OG preview – design token for dark surface, consistent shadow */}
          <div
            className="rounded-xl border border-border bg-surface-dark p-4 shadow-sm"
            aria-label="Social and Open Graph preview"
          >
            <p className="text-xs font-medium text-white/80">
              Social / OG preview
            </p>
            <div className="mt-2 flex items-center gap-3">
              {showLogo && !showLogoPlaceholder && (
                <img
                  src={logoUrl}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded object-cover"
                  aria-hidden
                />
              )}
              {showLogo && showLogoPlaceholder && (
                <div
                  className="h-10 w-10 shrink-0 rounded bg-white/10"
                  aria-hidden
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {name}
                </p>
                <p className="line-clamp-2 text-xs text-white/70">{desc}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
