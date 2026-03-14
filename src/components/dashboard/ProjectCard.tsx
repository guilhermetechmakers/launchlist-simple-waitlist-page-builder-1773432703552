import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ExternalLink, List, MoreHorizontal, Pencil, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_BUTTON_COLOR } from "@/lib/design-tokens";
import { BrandingPreview } from "./BrandingPreview";
import { SubmissionsPreview } from "./SubmissionsPreview";
import type { DashboardProject } from "@/types/project";

/** Consistent icon size for all card icons (design system) */
const CARD_ICON_SIZE = "h-4 w-4";

export interface ProjectCardProps {
  project: DashboardProject;
  onExport?: (projectId: string) => void;
  isExporting?: boolean;
  /** When true, renders a skeleton card instead of content */
  isLoading?: boolean;
  /** When set, shows an error state with message */
  error?: string | null;
}

function publicUrl(slug: string): string {
  if (typeof window === "undefined") return `/r/${slug}`;
  return `${window.location.origin}/r/${slug}`;
}

export function ProjectCard({
  project,
  onExport,
  isExporting,
  isLoading = false,
  error = null,
}: ProjectCardProps) {
  const slug = project.slug ?? "";
  const name = project.name ?? "Untitled";
  const url = project.url ?? publicUrl(slug);
  const submissionCount = project.submissionCount ?? project.waitlist_count ?? 0;
  const lastSubmissionAt = project.lastSubmissionAt ?? project.updated_at ?? null;
  const isPublic = project.is_public ?? true;
  const hasLogo = project.hasLogo ?? !!project.logo_url;
  const color = project.color ?? project.button_color ?? DEFAULT_BUTTON_COLOR;

  // Error state: show message with design tokens (no hardcoded hex)
  if (error != null && String(error).trim() !== "") {
    return (
      <Card className="rounded-xl border border-destructive/50 bg-destructive/5 shadow-md animate-fade-in-up">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <AlertCircle className={cn(CARD_ICON_SIZE, "text-destructive")} aria-hidden />
          <p className="text-sm font-medium text-foreground">Something went wrong</p>
          <p className="text-xs text-gray-600">{String(error)}</p>
        </CardContent>
      </Card>
    );
  }

  // Loading state: skeleton matching card layout (spacing scale: 8px gap-2, 16px gap-4)
  if (isLoading) {
    return (
      <Card className="flex flex-col overflow-hidden rounded-xl shadow-md animate-fade-in-up">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-6 pb-4">
          <div className="flex-1 space-y-2 min-w-0">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
          <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
        </CardHeader>
        <CardContent className="mt-auto flex flex-col gap-4 p-6 pt-0">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 flex-1 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "flex flex-col rounded-xl shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-fade-in-up",
        "group"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-6 pb-4">
        <div className="flex-1 space-y-2 min-w-0">
          <h3 className="font-heading text-lg font-semibold text-foreground truncate">
            {project.name ?? "Untitled"}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-600">
            {project.description ?? "No description"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Open menu for ${name}`}
              aria-haspopup="menu"
            >
              <MoreHorizontal className={CARD_ICON_SIZE} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/setup/${project.id}`}>
                <Pencil className={cn("mr-2", CARD_ICON_SIZE)} />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/project/${project.id}/submissions`}>
                <List className={cn("mr-2", CARD_ICON_SIZE)} />
                View submissions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExport?.(project.id)}
              disabled={isExporting}
              aria-label={isExporting ? "Exporting CSV…" : `Export submissions as CSV for ${name}`}
            >
              <Download className={cn("mr-2", CARD_ICON_SIZE)} aria-hidden />
              Export CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-4 p-6 pt-0">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-foreground no-underline hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`View public waitlist page for ${name}`}
          >
            <ExternalLink className={cn("mr-1", CARD_ICON_SIZE)} aria-hidden />
            /r/{slug || "…"}
          </a>
          {isPublic ? (
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-foreground">
              Public
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-gray-600">
              Private
            </span>
          )}
          {hasLogo && (
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs text-gray-600">
              Logo
            </span>
          )}
        </div>

        <SubmissionsPreview
          submissionCount={submissionCount}
          lastSubmissionAt={lastSubmissionAt}
        />

        <BrandingPreview
          productName={project.name}
          description={project.description ?? undefined}
          buttonColor={color}
          logoUrl={project.logo_url ?? undefined}
        />

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" asChild className="flex-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View public page for ${name}`}
            >
              <ExternalLink className={cn("mr-1", CARD_ICON_SIZE)} aria-hidden />
              View page
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Link
              to={`/project/${project.id}/submissions`}
              aria-label={`View submissions for ${name}`}
            >
              Submissions
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
