import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const DEFAULT_COLOR = "#D6FF2A";
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
    <div className={cn("space-y-2", className)}>
      <Label>Button color</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="#D6FF2A"
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
          className="font-mono"
          aria-invalid={!!error}
          aria-describedby={error ? "button-color-error" : undefined}
        />
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          disabled={disabled}
          className="h-11 w-14 cursor-pointer rounded-xl border border-border bg-transparent"
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
