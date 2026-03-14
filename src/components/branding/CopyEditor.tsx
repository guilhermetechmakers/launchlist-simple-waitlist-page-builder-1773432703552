import { useId } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 160;
/** Character count threshold below which we show accent color (design token) */
const REMAINING_ACCENT_THRESHOLD = 20;

export interface CopyEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
  className?: string;
  /** Optional: when true, shows a loading skeleton instead of the textarea */
  isLoading?: boolean;
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
  isLoading = false,
}: CopyEditorProps) {
  const safeValue = value ?? "";
  const remaining = maxLength - safeValue.length;
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const isNearLimit = remaining <= REMAINING_ACCENT_THRESHOLD;

  return (
    <div
      className={cn(
        "space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow duration-200",
        "focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
    >
      <Label htmlFor={id} className="text-foreground font-medium leading-normal">
        {label}
      </Label>
      {isLoading ? (
        <div
          className="min-h-[100px] w-full animate-pulse rounded-xl bg-input"
          aria-busy="true"
          aria-label="Loading"
        />
      ) : (
        <Textarea
          id={id}
          value={safeValue}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          rows={3}
          className="resize-none leading-relaxed"
          aria-invalid={!!error}
          aria-describedby={error ? `${errorId} ${hintId}` : hintId}
        />
      )}
      <div className="flex min-h-5 items-center justify-between gap-4">
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-sm leading-relaxed text-destructive"
          >
            {error}
          </p>
        ) : (
          <span aria-hidden className="shrink-0" />
        )}
        <span
          id={hintId}
          className={cn(
            "text-xs tabular-nums leading-relaxed",
            isNearLimit ? "text-accent" : "text-muted-foreground"
          )}
          aria-live="polite"
        >
          {remaining} left
        </span>
      </div>
    </div>
  );
}
