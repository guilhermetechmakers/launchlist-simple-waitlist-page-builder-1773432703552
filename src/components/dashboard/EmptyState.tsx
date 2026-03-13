import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  onCreate: () => void;
  /** Optional: show different copy when there are projects but none match filters */
  hasProjects?: boolean;
  className?: string;
}

export function EmptyState({ onCreate, hasProjects, className }: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "mt-8 flex flex-col items-center justify-center py-16 animate-fade-in-up",
        className
      )}
      role="status"
      aria-label={hasProjects ? "No projects match your filters" : "No waitlists yet"}
    >
      <List className="h-12 w-12 text-muted-foreground" aria-hidden />
      <p className="mt-4 font-medium text-foreground">
        {hasProjects ? "No waitlists match your search" : "No waitlists yet"}
      </p>
      <p className="mt-1 text-center text-sm text-muted-foreground max-w-sm">
        {hasProjects
          ? "Try a different search or filter."
          : "Create your first waitlist to start collecting signups."}
      </p>
      {!hasProjects && (
        <Button asChild className="mt-6 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <Link to="/setup" onClick={onCreate}>
            Create your first waitlist
          </Link>
        </Button>
      )}
    </Card>
  );
}
