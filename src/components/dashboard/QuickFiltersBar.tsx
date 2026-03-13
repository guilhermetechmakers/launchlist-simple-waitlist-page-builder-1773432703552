import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SortKey = "recent_activity" | "recently_created" | "alphabetical";
export type VisibilityFilter = "all" | "public" | "private";

export interface QuickFiltersBarProps {
  searchQuery: string;
  sortKey: SortKey;
  visibilityFilter: VisibilityFilter;
  onQueryChange: (value: string) => void;
  onSortChange: (value: SortKey) => void;
  onVisibilityChange: (value: VisibilityFilter) => void;
  className?: string;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recent_activity", label: "Recent activity" },
  { value: "recently_created", label: "Recently created" },
  { value: "alphabetical", label: "Alphabetical" },
];

const VISIBILITY_OPTIONS: { value: VisibilityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

export function QuickFiltersBar({
  searchQuery,
  sortKey,
  visibilityFilter,
  onQueryChange,
  onSortChange,
  onVisibilityChange,
  className,
}: QuickFiltersBarProps) {
  return (
    <div
      className={cn(
        "mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6",
        className
      )}
      role="search"
      aria-label="Filter and sort projects"
    >
      <Input
        type="search"
        placeholder="Search by name or slug…"
        value={searchQuery}
        onChange={(e) => onQueryChange(e.target.value)}
        className="max-w-sm"
        aria-label="Search projects"
      />
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Sort</span>
          <select
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Visibility</span>
          <select
            value={visibilityFilter}
            onChange={(e) => onVisibilityChange(e.target.value as VisibilityFilter)}
            className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            aria-label="Filter by visibility"
          >
            {VISIBILITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
