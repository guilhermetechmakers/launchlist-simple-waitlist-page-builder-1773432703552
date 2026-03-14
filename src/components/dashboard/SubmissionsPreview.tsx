import { format } from "date-fns";
import { CalendarClock, Users, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Icon size aligned with design system (compact lists) */
const ICON_SIZE = "h-4 w-4";

export interface SubmissionsPreviewProps {
  submissionCount?: number;
  lastSubmissionAt?: string | null;
  /** When true, shows skeleton placeholders instead of data */
  isLoading?: boolean;
  /** When set, shows error state with message */
  error?: string | null;
  className?: string;
}

/**
 * Formats last submission date safely; returns null for invalid/missing dates.
 */
function formatLastSubmissionDate(value: string | null | undefined): string | null {
  if (value == null || String(value).trim() === "") return null;
  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : format(d, "MMM d, yyyy");
  } catch {
    return null;
  }
}

export function SubmissionsPreview({
  submissionCount = 0,
  lastSubmissionAt,
  isLoading = false,
  error = null,
  className,
}: SubmissionsPreviewProps) {
  const count = Number(submissionCount) || 0;
  const dateStr = formatLastSubmissionDate(lastSubmissionAt ?? null);
  const hasError = error != null && String(error).trim() !== "";
  const isEmpty = !hasError && !isLoading && count === 0 && !dateStr;

  // Error state: surface error with icon and accessible message
  if (hasError) {
    return (
      <Card
        className={cn(
          "rounded-xl border border-destructive/50 bg-destructive/5 shadow-md transition-all duration-200",
          className
        )}
        aria-describedby="submissions-preview-error"
      >
        <CardContent className="flex flex-row items-center gap-4 py-4 px-4">
          <AlertCircle
            className={cn(ICON_SIZE, "shrink-0 text-destructive")}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <Label id="submissions-preview-error" className="text-sm font-medium text-destructive">
              Could not load submission stats
            </Label>
            <p className="mt-1 text-xs text-gray-600">{String(error)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state: skeleton matching content layout
  if (isLoading) {
    return (
      <Card className={cn("rounded-xl shadow-md transition-all duration-200", className)} aria-busy="true" aria-label="Loading submission stats">
        <CardContent className="flex flex-wrap items-center gap-4 py-4 px-4">
          <div className="flex items-center gap-4">
            <Skeleton className={cn(ICON_SIZE, "rounded-lg")} aria-hidden />
            <Skeleton className="h-4 w-20 rounded-lg" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className={cn(ICON_SIZE, "rounded-lg")} aria-hidden />
            <Skeleton className="h-4 w-28 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state: no signups yet
  if (isEmpty) {
    return (
      <Card
        className={cn(
          "rounded-xl border border-border bg-muted/30 shadow-md transition-all duration-200",
          className
        )}
        role="region"
        aria-labelledby="submissions-preview-empty-label"
      >
        <CardContent className="flex flex-row items-center gap-4 py-4 px-4">
          <Users
            className={cn(ICON_SIZE, "shrink-0 text-gray-600")}
            aria-hidden
          />
          <Label
            id="submissions-preview-empty-label"
            className="text-sm font-medium text-gray-600"
          >
            No signups yet
          </Label>
        </CardContent>
      </Card>
    );
  }

  // Default: show count and optional last submission date with labels and icons
  return (
    <Card
      className={cn(
        "rounded-xl border border-border bg-card shadow-md transition-all duration-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      role="region"
      aria-label="Submission statistics"
    >
      <CardContent className="flex flex-wrap items-center gap-4 py-4 px-4">
        <div className="flex items-center gap-4">
          <Users
            className={cn(ICON_SIZE, "shrink-0 text-primary")}
            aria-hidden
          />
          <span className="flex items-baseline gap-2 text-sm">
            <Label id="submissions-preview-signups-label" className="sr-only">
              Total signups
            </Label>
            <span
              className="font-semibold text-foreground"
              aria-hidden
            >
              {count}
            </span>
            <span className="text-gray-600">signups</span>
          </span>
        </div>
        {dateStr != null && (
          <div className="flex items-center gap-4">
            <CalendarClock
              className={cn(ICON_SIZE, "shrink-0 text-accent")}
              aria-hidden
            />
            <span className="flex items-baseline gap-2 text-sm text-gray-600">
              <Label id="submissions-preview-last-label" className="sr-only">
                Last signup date
              </Label>
              <span aria-hidden>Last joined {dateStr}</span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
