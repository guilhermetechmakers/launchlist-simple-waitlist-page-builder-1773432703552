import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface SubmissionsPreviewProps {
  submissionCount?: number;
  lastSubmissionAt?: string | null;
  className?: string;
}

export function SubmissionsPreview({
  submissionCount = 0,
  lastSubmissionAt,
  className,
}: SubmissionsPreviewProps) {
  const count = Number(submissionCount) || 0;
  const dateStr =
    lastSubmissionAt &&
    (() => {
      try {
        const d = new Date(lastSubmissionAt);
        return isNaN(d.getTime()) ? null : format(d, "MMM d, yyyy");
      } catch {
        return null;
      }
    })();

  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground", className)}>
      <span>
        <span className="font-medium text-foreground">{count}</span> signups
      </span>
      {dateStr && (
        <span>Last joined {dateStr}</span>
      )}
    </div>
  );
}
