import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "./ProjectCard";
import { safeMap } from "@/lib/utils";
import type { DashboardProject } from "@/types/project";

export interface ProjectsListProps {
  /** Projects to render; null-safe: uses empty array if null/undefined */
  projects: DashboardProject[] | null | undefined;
  totalCount?: number;
  isLoading?: boolean;
  onEdit?: (projectId: string) => void;
  onViewSubmissions?: (projectId: string) => void;
  onExport?: (projectId: string) => void;
  exportingProjectId?: string | null;
}

export function ProjectsList({
  projects,
  isLoading,
  onExport,
  exportingProjectId,
}: ProjectsListProps) {
  const list = Array.isArray(projects) ? projects : (projects ?? []);

  if (isLoading) {
    return (
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading projects">
        {[1, 2, 3].map((i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="list"
      aria-label="Waitlist projects"
    >
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
