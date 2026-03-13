import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/** Design tokens: track uses primary (neon) when checked, input when unchecked; thumb uses background; focus uses ring token (neon). */
const switchRootVariants = [
  "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
  "border-2 border-transparent transition-colors duration-200 ease-in-out",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  "shadow-[0_2px_4px_rgb(var(--foreground)/0.06)]",
].join(" ");

const switchThumbVariants = [
  "pointer-events-none block h-5 w-5 rounded-full",
  "bg-background shadow-[0_2px_8px_rgb(var(--foreground)/0.12)]",
  "ring-0 transition-transform duration-200 ease-in-out",
  "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
].join(" ");

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  /**
   * Optional label text. When provided, the switch is wrapped with an associated
   * Label for accessibility. Otherwise, pass aria-label or aria-labelledby to the root.
   */
  label?: React.ReactNode;
  /**
   * Optional id for linking an external Label via htmlFor. Also used when `label` is provided.
   */
  id?: string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, id: idProp, label, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, ...props }, ref) => {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const hasLabel = label != null && label !== "";

  const root = (
    <SwitchPrimitives.Root
      id={id}
      className={cn(switchRootVariants, className)}
      ref={ref}
      aria-label={ariaLabel}
      aria-labelledby={hasLabel ? `${id}-label` : ariaLabelledby}
      {...props}
    >
      <SwitchPrimitives.Thumb className={cn(switchThumbVariants)} />
    </SwitchPrimitives.Root>
  );

  if (hasLabel) {
    return (
      <div className="flex items-center gap-3">
        {root}
        <Label
          id={`${id}-label`}
          htmlFor={id}
          className="cursor-pointer text-sm font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </Label>
      </div>
    );
  }

  return root;
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
