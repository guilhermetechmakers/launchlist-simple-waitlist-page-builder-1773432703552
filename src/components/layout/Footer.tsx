import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const FOOTER_NAV_LINKS = [
  { to: "/privacy", label: "Privacy", title: "Privacy policy", icon: Shield },
  { to: "/terms", label: "Terms", title: "Terms of service", icon: FileText },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className={cn(
        "border-t border-border bg-card",
        "py-6 md:py-8"
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-[1200px]",
          "px-4 md:px-6",
          "flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        )}
      >
        {/* Copyright and product description – design tokens for color */}
        <p
          className={cn(
            "text-sm text-foreground",
            "text-center md:text-left",
            "order-1 md:order-1"
          )}
          aria-label="Copyright and product description"
        >
          © {year} LaunchList. Simple waitlist pages for makers.
        </p>

        <Separator
          orientation="horizontal"
          className="md:hidden"
          decorative
          aria-hidden
        />
        <Separator
          orientation="vertical"
          className="hidden md:block h-6"
          decorative
          aria-hidden
        />

        {/* Footer navigation – shadcn Button + Link for focus ring and consistency */}
        <nav
          aria-label="Footer navigation"
          className={cn(
            "flex flex-wrap items-center justify-center gap-4 md:gap-6",
            "order-2 md:order-2"
          )}
        >
          {(FOOTER_NAV_LINKS ?? []).map(({ to, label, title, icon: Icon }) => (
            <Button
              key={to}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-lg",
                "text-muted-foreground hover:text-foreground hover:bg-primary/10",
                "h-auto min-h-11 px-3 py-2",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "transition-colors duration-200"
              )}
            >
              <Link
                to={to}
                title={title}
                aria-label={title}
                className="inline-flex items-center gap-2"
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </footer>
  );
}
