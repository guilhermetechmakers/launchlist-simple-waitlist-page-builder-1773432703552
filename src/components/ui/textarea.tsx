import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/** Design system: use theme tokens (bg-input, border-border, ring) — no hardcoded colors */
const textareaBaseClasses =
  "flex min-h-[100px] w-full rounded-lg border border-border p-4 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** Optional label; when provided, renders shadcn Label and associates via id/htmlFor for accessibility */
  label?: React.ReactNode;
  /** When true, applies error border and aria-invalid */
  error?: boolean;
  /** Shown below the textarea when error is true */
  errorMessage?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      id: providedId,
      label,
      error = false,
      errorMessage,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const labelId = `${generatedId}-label`;
    const textareaId = providedId ?? `${generatedId}-textarea`;

    // Accessibility: ensure label or aria-label when label prop is used (aria-labelledby set below)
    const ariaProps: Pick<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "aria-label" | "aria-labelledby" | "aria-invalid"> = {
      "aria-invalid": error ? true : undefined,
    };
    if (label) {
      ariaProps["aria-labelledby"] = labelId;
    } else if (ariaLabelledby) {
      ariaProps["aria-labelledby"] = ariaLabelledby;
    }
    if (ariaLabel) {
      ariaProps["aria-label"] = ariaLabel;
    }

    const textareaElement = (
      <textarea
        id={textareaId}
        ref={ref}
        className={cn(
          textareaBaseClasses,
          "bg-input",
          error && "border-destructive focus-visible:ring-destructive/20",
          className
        )}
        {...ariaProps}
        {...props}
      />
    );

    if (label != null) {
      return (
        <div className="grid w-full gap-2">
          <Label id={labelId} htmlFor={textareaId} className="text-sm font-medium">
            {label}
          </Label>
          {textareaElement}
          {error && errorMessage && (
            <p
              role="alert"
              className="text-sm text-destructive"
              id={`${textareaId}-error`}
            >
              {errorMessage}
            </p>
          )}
        </div>
      );
    }

    const hasErrorBlock = error && errorMessage;
    if (hasErrorBlock) {
      return (
        <div className="grid w-full gap-2">
          {textareaElement}
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        </div>
      );
    }
    return textareaElement;
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
