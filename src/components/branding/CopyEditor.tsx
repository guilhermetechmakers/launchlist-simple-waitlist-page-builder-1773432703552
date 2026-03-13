import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 160;

export interface CopyEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function CopyEditor({
  label = "Short description / CTA copy",
  value,
  onChange,
  placeholder = "One line that describes your product.",
  maxLength = MAX_LENGTH,
  error,
  disabled = false,
  className,
}: CopyEditorProps) {
  const safeValue = value ?? "";
  const remaining = maxLength - safeValue.length;

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <Textarea
        value={safeValue}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        rows={3}
        className="resize-none"
        aria-invalid={!!error}
        aria-describedby={error ? "copy-editor-error" : undefined}
      />
      <div className="flex justify-between">
        {error ? (
          <p id="copy-editor-error" className="text-sm text-destructive">
            {error}
          </p>
        ) : (
          <span />
        )}
        <span className="text-xs text-muted-foreground">{remaining} left</span>
      </div>
    </div>
  );
}
