import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";
import { useProjects } from "@/hooks/useProjects";
import { Plus, ExternalLink, List, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import type { ProjectWithCount } from "@/types/project";

export default function Dashboard() {
  const { data: projects, isLoading } = useProjects();
  const [search, setSearch] = useState("");

  const filtered =
    projects?.filter(
      (p: ProjectWithCount) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Your waitlists
            </h1>
            <Button asChild>
              <Link to="/setup">
                <Plus className="mr-2 h-4 w-4" />
                New waitlist
              </Link>
            </Button>
          </div>

          <div className="mt-6">
            <Input
              placeholder="Search by name or slug…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="mt-2 h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="mt-8 flex flex-col items-center justify-center py-16">
              <List className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-medium text-foreground">
                {projects?.length === 0
                  ? "No waitlists yet"
                  : "No waitlists match your search"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {projects?.length === 0
                  ? "Create your first waitlist to start collecting signups."
                  : "Try a different search."}
              </p>
              {projects?.length === 0 && (
                <Button asChild className="mt-6">
                  <Link to="/setup">Create waitlist</Link>
                </Button>
              )}
            </Card>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project: ProjectWithCount) => (
                <Card key={project.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1.5">
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        {project.name}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {project.description || "No description"}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/setup/${project.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/project/${project.id}/submissions`}>
                            View submissions
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {project.waitlist_count ?? 0}
                      </span>{" "}
                      signups
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a
                          href={`${window.location.origin}/r/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          View page
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/project/${project.id}/submissions`}>
                          Submissions
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
