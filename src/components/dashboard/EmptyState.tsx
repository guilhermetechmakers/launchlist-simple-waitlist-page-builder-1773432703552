import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  onCreate: () => void;
  /** Optional: show different copy when there are projects but none match filters */
  hasProjects?: boolean;
  className?: string;
}

export function EmptyState({ onCreate, hasProjects, className }: EmptyStateProps) {
  const statusLabel = hasProjects
    ? "No waitlists match your filters"
    : "No waitlists yet";

  return (
    <Card
      className={cn(
        "mt-8 flex flex-col items-center justify-center py-16 px-6 animate-fade-in-up",
        "border-border bg-card shadow-card",
        className
      )}
      role="status"
      aria-label={statusLabel}
    >
      {/* Illustration: icon in soft container for clear empty-state visual */}
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/40 text-muted-foreground"
        aria-hidden
      >
        <FolderPlus className="h-14 w-14" strokeWidth={1.25} />
      </div>
      <p className="mt-6 font-heading text-lg font-semibold text-foreground">
        {hasProjects ? "No waitlists match your search" : "No waitlists yet"}
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        {hasProjects
          ? "Try a different search or filter."
          : "Create your first waitlist to start collecting signups."}
      </p>
      {!hasProjects && (
        <Button
          asChild
          className="mt-8 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
          aria-label="Create your first waitlist"
        >
          <Link to="/setup" onClick={onCreate}>
            Create your first waitlist
          </Link>
        </Button>
      )}
    </Card>
  );
}
