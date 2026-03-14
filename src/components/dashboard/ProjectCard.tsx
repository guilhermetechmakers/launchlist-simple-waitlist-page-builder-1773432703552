import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, List, MoreHorizontal, Pencil, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_BUTTON_COLOR } from "@/lib/design-tokens";
import { BrandingPreview } from "./BrandingPreview";
import { SubmissionsPreview } from "./SubmissionsPreview";
import type { DashboardProject } from "@/types/project";

export interface ProjectCardProps {
  project: DashboardProject;
  onExport?: (projectId: string) => void;
  isExporting?: boolean;
}

function publicUrl(slug: string): string {
  if (typeof window === "undefined") return `/r/${slug}`;
  return `${window.location.origin}/r/${slug}`;
}

export function ProjectCard({ project, onExport, isExporting }: ProjectCardProps) {
  const slug = project.slug ?? "";
  const name = project.name ?? "Untitled";
  const url = project.url ?? publicUrl(slug);
  const submissionCount = project.submissionCount ?? project.waitlist_count ?? 0;
  const lastSubmissionAt = project.lastSubmissionAt ?? project.updated_at ?? null;
  const isPublic = project.is_public ?? true;
  const hasLogo = project.hasLogo ?? !!project.logo_url;
  const color = project.color ?? project.button_color ?? DEFAULT_BUTTON_COLOR;

  return (
    <Card
      className={cn(
        "flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover animate-fade-in-up",
        "group"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 space-y-1.5 min-w-0">
          <h3 className="font-heading text-lg font-semibold text-foreground truncate">
            {project.name ?? "Untitled"}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description ?? "No description"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Open menu for ${name}`}
              aria-haspopup="menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/setup/${project.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/project/${project.id}/submissions`}>
                <List className="mr-2 h-4 w-4" />
                View submissions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExport?.(project.id)}
              disabled={isExporting}
              aria-label={isExporting ? "Exporting CSV…" : `Export submissions as CSV for ${name}`}
            >
              <Download className="mr-2 h-4 w-4" aria-hidden />
              Export CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-foreground no-underline hover:bg-muted"
            aria-label={`View public waitlist page for ${name}`}
          >
            <ExternalLink className="mr-1 h-3 w-3" aria-hidden />
            /r/{slug || "…"}
          </a>
          {isPublic ? (
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-foreground">
              Public
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              Private
            </span>
          )}
          {hasLogo && (
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs text-muted-foreground">
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

        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View public page for ${name}`}
            >
              <ExternalLink className="mr-1 h-3 w-3" aria-hidden />
              View page
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
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
