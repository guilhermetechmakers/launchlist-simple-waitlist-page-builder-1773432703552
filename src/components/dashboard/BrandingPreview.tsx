import { cn } from "@/lib/utils";

const DEFAULT_COLOR = "#D6FF2A";

export interface BrandingPreviewProps {
  productName?: string | null;
  description?: string | null;
  buttonColor?: string | null;
  logoUrl?: string | null;
  className?: string;
}

/** Compact branding preview for dashboard cards: button color + logo placeholder */
export function BrandingPreview({
  productName,
  description,
  buttonColor,
  logoUrl,
  className,
}: BrandingPreviewProps) {
  const color = (buttonColor ?? DEFAULT_COLOR).toString().trim() || DEFAULT_COLOR;
  const name = (productName ?? "").toString().trim() || "Your Product";

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-3 transition-shadow duration-200",
        className
      )}
      aria-label="Branding preview"
    >
      <div className="flex items-center gap-3">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            className="h-10 w-10 rounded-lg object-contain bg-muted/50"
          />
        ) : (
          <div
            className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center text-xs text-muted-foreground"
            aria-hidden
          >
            Logo
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
          {description && (
            <p className="truncate text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div
          className="h-8 w-20 rounded-lg shrink-0 border border-border"
          style={{ backgroundColor: color }}
          title="Button color"
          aria-hidden
        />
      </div>
    </div>
  );
}
