import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_BUTTON_COLOR } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

/** Default button color from design system (neon primary); single source of truth. */
const DEFAULT_COLOR = DEFAULT_BUTTON_COLOR;
const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

function normalizeHex(value: string): string {
  const v = value.trim();
  if (!v) return DEFAULT_COLOR;
  if (v.startsWith("#")) {
    if (HEX_REGEX.test(v)) return v.toLowerCase();
    if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) return v;
  }
  if (/^[0-9A-Fa-f]{3}$/.test(v)) return `#${v}`.toLowerCase();
  if (/^[0-9A-Fa-f]{6}$/.test(v)) return `#${v}`.toLowerCase();
  return DEFAULT_COLOR;
}

export interface ButtonColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function ButtonColorPicker({
  value,
  onChange,
  error,
  disabled = false,
  className,
}: ButtonColorPickerProps) {
  const hex = value?.trim() ? normalizeHex(value) : DEFAULT_COLOR;
  const displayValue = value?.trim() || DEFAULT_COLOR;

  return (
    <div className={cn("space-y-4", className)}>
      <Label>Button color</Label>
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder={DEFAULT_BUTTON_COLOR}
          value={displayValue}
          onChange={(e) => {
            const next = e.target.value;
            if (!next) {
              onChange(DEFAULT_COLOR);
              return;
            }
            if (next.startsWith("#") && HEX_REGEX.test(normalizeHex(next))) {
              onChange(normalizeHex(next));
            } else {
              onChange(next);
            }
          }}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v) onChange(normalizeHex(v));
            else onChange(DEFAULT_COLOR);
          }}
          disabled={disabled}
          className="font-mono rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0"
          aria-invalid={!!error}
          aria-describedby={error ? "button-color-error" : undefined}
        />
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          disabled={disabled}
          className="h-11 w-14 cursor-pointer rounded-lg border border-border bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2"
          aria-label="Pick button color"
        />
      </div>
      {error && (
        <p id="button-color-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Hex only (#RRGGBB or #RGB). Default: {DEFAULT_COLOR}
      </p>
    </div>
  );
}
