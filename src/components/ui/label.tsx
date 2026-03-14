import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Label variants aligned with design system:
 * - text-foreground for WCAG AA contrast (4.5:1) on background
 * - rounded-lg for consistent border radius (theme --radius)
 * - text-sm + leading-snug for typography scale; peer-disabled states preserved
 * - focus-visible ring for interactive contexts (e.g. when focusable)
 */
const labelVariants = cva(
  "rounded-lg text-foreground text-sm font-medium leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
