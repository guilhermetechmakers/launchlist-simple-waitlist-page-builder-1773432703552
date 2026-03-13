import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FolderPlus, AlertCircle } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { safeMap } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { DashboardProject } from "@/types/project";

export interface ProjectsListProps {
  /** Projects to render; null-safe: uses empty array if null/undefined */
  projects: DashboardProject[] | null | undefined;
  totalCount?: number;
  isLoading?: boolean;
  /** Optional error message; when set, error state is shown */
  error?: string | null;
  /** Optional CTA for empty state (e.g. navigate to create project) */
  onCreateNew?: () => void;
  onEdit?: (projectId: string) => void;
  onViewSubmissions?: (projectId: string) => void;
  onExport?: (projectId: string) => void;
  exportingProjectId?: string | null;
}

export function ProjectsList({
  projects,
  isLoading,
  error,
  onCreateNew,
  onExport,
  exportingProjectId,
}: ProjectsListProps) {
  const list = Array.isArray(projects) ? projects : (projects ?? []);
  const hasItems = list.length > 0;
  const hasError = typeof error === "string" && error.length > 0;

  if (isLoading) {
    return (
      <Card
        className="mt-8"
        role="status"
        aria-label="Loading projects"
      >
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card
        className="mt-8 border-accent/30 bg-accent/5"
        role="alert"
        aria-live="polite"
      >
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          <AlertCircle className="h-12 w-12 text-accent shrink-0" aria-hidden />
          <p className="mt-4 text-center font-medium text-foreground">
            Something went wrong
          </p>
          <p className="mt-1 text-center text-sm text-muted-foreground max-w-sm">
            {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!hasItems) {
    return (
      <Card
        className={cn(
          "mt-8 flex flex-col items-center justify-center py-16 animate-fade-in"
        )}
        role="status"
        aria-label="No waitlist projects"
      >
        <CardContent className="flex flex-col items-center justify-center px-6 text-center">
          <FolderPlus
            className="h-12 w-12 text-muted-foreground"
            aria-hidden
          />
          <p className="mt-4 font-medium text-foreground">
            No waitlists yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create your first waitlist to start collecting signups.
          </p>
          {typeof onCreateNew === "function" && (
            <Button
              className="mt-6 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={onCreateNew}
            >
              Create your first waitlist
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8" role="list" aria-label="Waitlist projects">
      <CardContent className="pt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeMap(list, (project) => (
            <div key={project.id} role="listitem">
              <ProjectCard
                project={project}
                onExport={onExport}
                isExporting={exportingProjectId === project.id}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
