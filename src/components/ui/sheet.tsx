import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

/** Context to wire sheet content aria-labelledby/aria-describedby from title and description ids for accessibility */
type SheetAriaContextValue = {
  titleId: string | null;
  descriptionId: string | null;
  setTitleId: (id: string) => void;
  setDescriptionId: (id: string) => void;
};
const SheetAriaContext = React.createContext<SheetAriaContextValue | null>(null);

function useSheetAria() {
  return React.useContext(SheetAriaContext);
}

/** Overlay uses design token (foreground at 50% opacity) instead of hardcoded bg-black/50 */
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-foreground/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

/** Panel uses design tokens: bg-surface-raised, border-border, shadow-card (elevation). Spacing: design system scale (gap-6 = 24px). */
const sheetVariants = cva(
  "fixed z-50 gap-6 bg-surface-raised border-border p-6 shadow-card transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  /** Optional aria-label for the sheet when no SheetTitle is used (accessibility) */
  "aria-label"?: string;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, "aria-label": ariaLabel, ...props }, ref) => {
  const [titleId, setTitleId] = React.useState<string | null>(null);
  const [descriptionId, setDescriptionId] = React.useState<string | null>(null);
  const ariaContextValue = React.useMemo<SheetAriaContextValue>(
    () => ({
      titleId,
      descriptionId,
      setTitleId,
      setDescriptionId,
    }),
    [titleId, descriptionId]
  );

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetAriaContext.Provider value={ariaContextValue}>
        <SheetPrimitive.Content
          ref={ref}
          aria-labelledby={titleId ?? undefined}
          aria-describedby={descriptionId ?? undefined}
          aria-label={ariaLabel}
          className={cn(sheetVariants({ side }), className)}
          {...props}
        >
          {children}
          <SheetPrimitive.Close
            className="absolute right-4 top-4 rounded-lg opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none"
            aria-label="Close sheet"
          >
            <X className="h-4 w-4" aria-hidden />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </SheetPrimitive.Content>
      </SheetAriaContext.Provider>
    </SheetPortal>
  );
});
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-4 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-4",
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, id: idProp, ...props }, ref) => {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const ariaContext = useSheetAria();
  React.useEffect(() => {
    if (ariaContext?.setTitleId) ariaContext.setTitleId(id);
  }, [id, ariaContext]);
  return (
    <SheetPrimitive.Title
      ref={ref}
      id={id}
      className={cn("font-heading text-lg font-semibold text-card-foreground", className)}
      {...props}
    />
  );
});
SheetTitle.displayName = SheetPrimitive.Title.displayName;

/** Description text uses text-secondary (design token) for WCAG AA contrast on light surfaces. */
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, id: idProp, ...props }, ref) => {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const ariaContext = useSheetAria();
  React.useEffect(() => {
    if (ariaContext?.setDescriptionId) ariaContext.setDescriptionId(id);
  }, [id, ariaContext]);
  return (
    <SheetPrimitive.Description
      ref={ref}
      id={id}
      className={cn("text-sm text-secondary", className)}
      {...props}
    />
  );
});
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
