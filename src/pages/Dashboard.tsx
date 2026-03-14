import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DashboardLayout,
  QuickFiltersBar,
  ProjectsList,
  EmptyState,
} from "@/components/dashboard";
import type { SortKey, VisibilityFilter } from "@/components/dashboard";
import { useProjects } from "@/hooks/useProjects";
import { useExportSubmissions } from "@/hooks/useSubmissions";
import { safeFilter } from "@/lib/utils";
import {
  toDashboardProject,
  type ProjectWithCount,
  type DashboardProject,
} from "@/types/project";

const PAGE_SIZE = 12;
const DEBOUNCE_MS = 300;

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, DEBOUNCE_MS);
  const [sortKey, setSortKey] = useState<SortKey>("recent_activity");
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>("all");
  const [page, setPage] = useState(1);
  const [exportingProjectId, setExportingProjectId] = useState<string | null>(
    null
  );

  const { data: projectsRaw, isLoading } = useProjects();
  const exportMutation = useExportSubmissions();

  const projects: DashboardProject[] = useMemo(() => {
    const list = Array.isArray(projectsRaw) ? projectsRaw : (projectsRaw ?? []);
    return list.map((p: ProjectWithCount) => toDashboardProject(p));
  }, [projectsRaw]);

  const filtered = useMemo(() => {
    const bySearch = safeFilter(projects, (p) => {
      if (!debouncedSearch.trim()) return true;
      const q = debouncedSearch.toLowerCase();
      const name = (p.name ?? "").toLowerCase();
      const slug = (p.slug ?? "").toLowerCase();
      return name.includes(q) || slug.includes(q);
    });
    const byVisibility = safeFilter(bySearch, (p) => {
      if (visibilityFilter === "all") return true;
      if (visibilityFilter === "public") return p.is_public === true;
      return p.is_public === false;
    });
    const sorted = [...byVisibility].sort((a, b) => {
      if (sortKey === "alphabetical") {
        return (a.name ?? "").localeCompare(b.name ?? "");
      }
      if (sortKey === "recently_created") {
        const ta = new Date(a.created_at ?? 0).getTime();
        const tb = new Date(b.created_at ?? 0).getTime();
        return tb - ta;
      }
      const ta = new Date(a.updated_at ?? a.created_at ?? 0).getTime();
      const tb = new Date(b.updated_at ?? b.created_at ?? 0).getTime();
      return tb - ta;
    });
    return sorted;
  }, [projects, debouncedSearch, visibilityFilter, sortKey]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleExportForProject = useCallback(
    (projectId: string) => {
      setExportingProjectId(projectId);
      exportMutation.mutate(
        { projectId },
        {
          onSettled: () => setExportingProjectId(null),
        }
      );
    },
    [exportMutation]
  );

  return (
    <DashboardLayout>
      <QuickFiltersBar
        searchQuery={searchInput}
        sortKey={sortKey}
        visibilityFilter={visibilityFilter}
        onQueryChange={setSearchInput}
        onSortChange={(k) => {
          setSortKey(k);
          setPage(1);
        }}
        onVisibilityChange={(v) => {
          setVisibilityFilter(v);
          setPage(1);
        }}
      />

      {(() => {
        if (isLoading) {
          return (
            <ProjectsList
              projects={[]}
              isLoading
              onExport={handleExportForProject}
            />
          );
        }
        const list = paginated;
        const hasProjects = (projects ?? []).length > 0;
        const hasFiltered = list.length > 0;

        if (!hasFiltered) {
          return (
            <EmptyState
              onCreate={() => navigate("/setup")}
              hasProjects={hasProjects}
            />
          );
        }

        return (
          <>
            <ProjectsList
              projects={list}
              totalCount={totalCount}
              isLoading={false}
              onEdit={(id) => navigate(`/setup/${id}`)}
              onViewSubmissions={(id) =>
                navigate(`/project/${id}/submissions`)
              }
              onExport={handleExportForProject}
              exportingProjectId={exportingProjectId}
            />
            {totalPages > 1 && (
              <nav
                className="mt-8 flex items-center justify-center gap-2"
                role="navigation"
                aria-label="Waitlist projects pagination"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                >
                  Previous
                </Button>
                <span
                  className="text-sm text-muted-foreground"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  aria-label="Next page"
                >
                  Next
                </Button>
              </nav>
            )}
          </>
        );
      })()}
    </DashboardLayout>
  );
}
