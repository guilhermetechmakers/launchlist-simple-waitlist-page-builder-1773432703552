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

export interface LivePreviewProps {
  productName: string;
  description: string;
  recipientEmail: string;
  buttonColor: string;
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
  const color = buttonColor?.trim() || DEFAULT_COLOR;
  const name = (productName ?? "").trim() || "Your Product";
  const desc = (description ?? "").trim() || "Short description for early adopters.";

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="overflow-hidden shadow-card transition-shadow duration-200 hover:shadow-card-hover">
        <CardHeader>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Preview
          </h2>
          <p className="text-sm text-muted-foreground">Your public page</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in">
            {logoUrl && (
              <img
                src={logoUrl}
                alt=""
                className="mx-auto mb-4 h-14 w-auto max-w-[120px] object-contain"
              />
            )}
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            <div className="mt-4 flex gap-2">
              <Input
                placeholder={maskEmail(recipientEmail)}
                readOnly
                disabled
                className="flex-1 bg-[rgb(var(--input))]"
              />
              <Button
                size="sm"
                className="shrink-0"
                style={{
                  backgroundColor: color,
                  color: "#0B0B0B",
                }}
              >
                Join
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Join 0 others on the list
            </p>
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
