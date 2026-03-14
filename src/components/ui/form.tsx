import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider } from "react-hook-form";
import type {
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { FormFieldContext, FormItemContext } from "@/components/ui/form-context";
import { useFormField } from "@/components/ui/use-form-field";

const Form = FormProvider;

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

/** FormItem uses design system spacing: gap-2 = 8px (scale). */
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;
  if (!body) return null;
  return (
    <p
      ref={ref}
      id={formMessageId}
      role={error ? "alert" : undefined}
      className={cn(
        "text-sm font-medium text-destructive animate-in fade-in-0 duration-200",
        error && "flex items-center gap-2",
        className
      )}
      data-error={error ? "true" : undefined}
      {...props}
    >
      {error && <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />}
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

/** Heading level for form sections (1-6). Use to define accessible heading hierarchy. */
type FormHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface FormHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic heading level for document outline and screen readers. Default 2. */
  level?: FormHeadingLevel;
  /** Optional id for aria-labelledby on FormSection. */
  id?: string;
}

const headingLevelClasses: Record<FormHeadingLevel, string> = {
  1: "text-2xl sm:text-3xl",
  2: "text-xl sm:text-2xl",
  3: "text-lg sm:text-xl",
  4: "text-base sm:text-lg",
  5: "text-sm sm:text-base",
  6: "text-sm",
};

const FormHeading = React.forwardRef<HTMLHeadingElement, FormHeadingProps>(
  ({ level = 2, className, id: idProp, ...props }, ref) => {
    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const sharedClassName = cn(
      "font-heading font-bold text-foreground tracking-tight",
      headingLevelClasses[level],
      className
    );
    const sharedProps = { id, ref, className: sharedClassName, ...props };
    switch (level) {
      case 1:
        return <h1 {...sharedProps} />;
      case 2:
        return <h2 {...sharedProps} />;
      case 3:
        return <h3 {...sharedProps} />;
      case 4:
        return <h4 {...sharedProps} />;
      case 5:
        return <h5 {...sharedProps} />;
      case 6:
        return <h6 {...sharedProps} />;
      default:
        return <h2 {...sharedProps} />;
    }
  }
);
FormHeading.displayName = "FormHeading";

export interface FormSectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional heading id from FormHeading for aria-labelledby. */
  "aria-labelledby"?: string;
}

/** Section spacing uses design scale: 16px / 24px (gap-4 / gap-6). */
const FormSection = React.forwardRef<HTMLElement, FormSectionProps>(
  ({ className, children, ...props }, ref) => (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className={cn("flex flex-col gap-4 sm:gap-6", className)}
      {...props}
    >
      {children}
    </section>
  )
);
FormSection.displayName = "FormSection";

/** Shadcn Input wired for use inside FormControl. Use with FormField + FormControl. */
const FormInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => <Input ref={ref} className={cn(className)} {...props} />);
FormInput.displayName = "FormInput";

/** Shadcn Textarea wired for use inside FormControl. Use with FormField + FormControl. */
const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea>
>(({ className, ...props }, ref) => (
  <Textarea ref={ref} className={cn("min-h-[100px]", className)} {...props} />
));
FormTextarea.displayName = "FormTextarea";

/** Skeleton placeholder for a form field (loading state). Uses theme radius: rounded-lg. */
const FormLoadingField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
    <Skeleton className="h-4 w-24 rounded-lg" />
    <Skeleton className="h-12 w-full rounded-xl" />
  </div>
));
FormLoadingField.displayName = "FormLoadingField";

export interface FormEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon (e.g. Lucide icon component). */
  icon?: React.ReactNode;
  /** Short message. */
  message: React.ReactNode;
  /** Optional CTA label. */
  actionLabel?: React.ReactNode;
  /** Optional CTA click handler. */
  onAction?: () => void;
}

/**
 * Empty state card: design tokens only (border-border, rounded-xl).
 * CTA button: text-primary-foreground on bg-primary for WCAG AA contrast; focus ring-2.
 * Spacing: design scale (p-6, gap-4, gap-6).
 */
const FormEmptyState = React.forwardRef<HTMLDivElement, FormEmptyStateProps>(
  (
    {
      icon,
      message,
      actionLabel,
      onAction,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="status"
      aria-label={typeof message === "string" ? message : "Empty state"}
      className={cn(
        "flex flex-col items-center justify-center gap-6 rounded-xl border border-border bg-muted/30 px-6 py-12 text-center shadow-sm",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="text-muted-foreground [&>svg]:h-10 [&>svg]:w-10">
          {icon}
        </span>
      )}
      <p className="text-sm font-medium text-foreground">{message}</p>
      {children && (
        <div className="text-sm text-muted-foreground">{children}</div>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:scale-[1.02] hover:opacity-95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
);
FormEmptyState.displayName = "FormEmptyState";

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormHeading,
  FormSection,
  FormInput,
  FormTextarea,
  FormLoadingField,
  FormEmptyState,
};
