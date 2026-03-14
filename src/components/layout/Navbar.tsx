import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@/hooks/useAuth";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Navbar – All colors use design tokens from the design system (--background,
 * --foreground, --primary, --muted-foreground, --border). No hardcoded hex/rgb.
 */

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/#how-it-works", label: "How it works" },
  { to: "/#features", label: "Features" },
];

export function Navbar() {
  const { data: userData, isLoading: isUserLoading, isError: isUserError } = useUser();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Safe auth state: treat loading/error as unauthenticated for UI; avoid undefined access
  const user = userData ?? null;
  const showAuthLoading = isUserLoading;
  const showLoggedIn = !isUserError && user != null;

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 md:px-6">
        {/* Site title as h1 for logical heading hierarchy and accessibility */}
        <h1 className="m-0 flex shrink-0 text-lg font-heading font-bold leading-none">
          <Link
            to="/"
            className="text-foreground no-underline transition-opacity hover:opacity-90 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="LaunchList home"
          >
            LaunchList
          </Link>
        </h1>

        <nav
          className="hidden items-center gap-6 md:flex md:gap-8"
          aria-label="Main navigation"
        >
          {(navLinks ?? []).map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                location.pathname === to && "text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {showAuthLoading ? (
            <div
              className="h-9 w-20 animate-pulse rounded-button bg-muted/50"
              aria-hidden
              role="presentation"
            />
          ) : showLoggedIn ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/profile">Profile</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="min-h-[44px] min-w-[44px] touch-manipulation"
              >
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] border-border bg-card"
            >
              <nav
                className="flex flex-col gap-6 pt-8"
                aria-label="Mobile navigation"
              >
                {(navLinks ?? []).map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className="text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  >
                    {label}
                  </Link>
                ))}
                {showLoggedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setOpen(false)}
                      className="text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
