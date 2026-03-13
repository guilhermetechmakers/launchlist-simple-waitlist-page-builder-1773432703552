import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardLayoutProps {
  children: ReactNode;
  /** Optional class for main content area */
  className?: string;
}

/**
 * Dashboard layout: header with CTA, responsive grid container.
 * Search/sort bar and pagination are typically rendered as children.
 */
export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className={cn("flex-1 px-4 py-8 md:px-6", className)}>
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Your waitlists
            </h1>
            <Button asChild className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2">
              <Link to="/setup">
                <Plus className="mr-2 h-4 w-4" />
                Create new waitlist
              </Link>
            </Button>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
