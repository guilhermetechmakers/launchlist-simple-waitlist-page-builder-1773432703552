import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_BUTTON_COLOR } from "@/lib/design-tokens";

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
  const [logoError, setLogoError] = useState(false);
  const rawColor = (buttonColor ?? "").toString().trim();
  const useThemePrimary = !rawColor;
  const customColor = rawColor || DEFAULT_BUTTON_COLOR;
  const name = (productName ?? "").toString().trim() || "Your Product";

  const showLogoImage = Boolean(logoUrl) && !logoError;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-shadow duration-200",
        "hover:shadow-card-hover",
        className
      )}
      aria-label="Branding preview"
    >
      <div className="flex items-center gap-4">
        {showLogoImage && logoUrl ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="h-10 w-10 rounded-xl object-contain bg-muted/50"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div
            className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-secondary"
            aria-hidden
          >
            <ImageIcon className="h-5 w-5" aria-hidden />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
          {description != null && String(description).trim() !== "" && (
            <p className="truncate text-xs text-secondary">
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            "h-8 w-20 rounded-xl shrink-0 border border-border",
            useThemePrimary && "bg-primary"
          )}
          style={useThemePrimary ? undefined : { backgroundColor: customColor }}
          title="Button color"
          aria-hidden
        />
      </div>
    </div>
  );
}
