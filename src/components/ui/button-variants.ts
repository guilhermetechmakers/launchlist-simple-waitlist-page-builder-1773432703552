import { cva, type VariantProps } from "class-variance-authority";

/**
 * Button variants using design tokens only (no hardcoded hex).
 * - Contrast: text-primary-foreground on bg-primary meets WCAG AA (4.5:1) via CSS variables.
 * - Radius: theme rounded-lg (--radius).
 * - Shadows: theme shadow-sm / shadow-md for elevation.
 * - Spacing: design scale (4, 8, 16, 24, 32); focus: ring-2 for accessibility.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:opacity-95 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] active:shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90 hover:shadow-md",
        outline:
          "border border-border bg-transparent text-foreground shadow-sm hover:bg-primary/10 hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:opacity-90 hover:shadow-md",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-11 px-6 py-4",
        sm: "h-9 px-4 py-2",
        lg: "h-12 px-8 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>;
