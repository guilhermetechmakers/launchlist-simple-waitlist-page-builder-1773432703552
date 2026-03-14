import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";
import { useProject } from "@/hooks/useProjects";
import { useSubmissions, useExportSubmissions, useDeleteSubmission } from "@/hooks/useSubmissions";
import { Label } from "@/components/ui/label";
import { Download, ArrowLeft, Trash2, Inbox, AlertCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Number of skeleton rows shown while submissions are loading */
const SKELETON_ROW_COUNT = 5;

export default function Submissions() {
  const { id } = useParams<{ id: string }>();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { data: project, isLoading: projectLoading } = useProject(id);
  const {
    data: entries,
    isLoading: entriesLoading,
    isError: entriesError,
    error: entriesErrorDetail,
    refetch: refetchSubmissions,
  } = useSubmissions(id, from || undefined, to || undefined);
  const exportCsv = useExportSubmissions();
  const deleteEntry = useDeleteSubmission(id ?? "");

  // Safe list for rendering; never call .map on possibly undefined
  const entryList = Array.isArray(entries) ? entries : [];

  if (projectLoading || !id) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 p-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-6 h-64 w-full" />
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex flex-1 items-center justify-center p-8">
          <p className="text-gray-600">Project not found.</p>
          <Button asChild className="mt-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="Go back to dashboard">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="Back to dashboard">
                <Link to="/dashboard">
                  <ArrowLeft className="mr-1 h-4 w-4" aria-hidden />
                  Dashboard
                </Link>
              </Button>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {project.name} – Submissions
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              aria-label="Export submissions as CSV"
              onClick={() => id && exportCsv.mutate({ projectId: id, from: from || undefined, to: to || undefined })}
              disabled={exportCsv.isPending || !id}
              className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h2 className="font-heading text-lg font-semibold text-foreground">Signups</h2>
              <span className="text-sm text-gray-600" aria-live="polite">
                {entryList.length} total
              </span>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="filter-from" className="text-sm">
                    From
                  </Label>
                  <Input
                    id="filter-from"
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-40"
                    aria-label="Filter submissions from this date"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="filter-to" className="text-sm">
                    To
                  </Label>
                  <Input
                    id="filter-to"
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-40"
                    aria-label="Filter submissions until this date"
                  />
                </div>
              </div>

              {/* Inline error: API/fetch failure with retry */}
              {entriesError && (
                <div
                  role="alert"
                  className={cn(
                    "mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-4 text-sm",
                    "animate-fade-in"
                  )}
                >
                  <AlertCircle className="h-5 w-5 shrink-0 text-destructive" aria-hidden />
                  <p className="min-w-0 flex-1 text-destructive/90">
                    {entriesErrorDetail instanceof Error
                      ? entriesErrorDetail.message
                      : "Failed to load submissions. Please try again."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchSubmissions()}
                    aria-label="Retry loading submissions"
                    className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:ring-offset-2"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
                    Try again
                  </Button>
                </div>
              )}

              {/* Loading: table-shaped skeleton for entries */}
              {entriesLoading && (
                <div className="space-y-4" aria-busy="true" aria-label="Loading submissions">
                  <div className="flex gap-4 border-b border-border pb-4">
                    <Skeleton className="h-5 w-32 rounded-lg" />
                    <Skeleton className="h-5 w-24 rounded-lg" />
                    <Skeleton className="h-5 w-28 rounded-lg" />
                  </div>
                  {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
                    <div key={i} className="flex gap-4 py-2">
                      <Skeleton className="h-5 flex-1 max-w-[200px] rounded-lg" />
                      <Skeleton className="h-5 w-20 rounded-lg" />
                      <Skeleton className="h-5 w-24 rounded-lg" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state with CTA */}
              {!entriesLoading && !entriesError && entryList.length === 0 && (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center animate-fade-in"
                  role="status"
                  aria-label="No submissions yet"
                >
                  <Inbox className="h-12 w-12 text-gray-600" aria-hidden />
                  <p className="mt-4 font-medium text-foreground">No submissions yet</p>
                  <p className="mt-2 max-w-sm text-sm text-gray-600">
                    Share your waitlist link to start collecting signups.
                  </p>
                  <Button
                    asChild
                    className="mt-6 bg-primary text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <Link to={`/setup/${id}`} aria-label="View setup and get your waitlist link">
                      View setup & get link
                    </Link>
                  </Button>
                </div>
              )}

              {/* Data table when loaded and not empty */}
              {!entriesLoading && !entriesError && entryList.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">Email</TableHead>
                      <TableHead scope="col">Referrer</TableHead>
                      <TableHead scope="col">Date</TableHead>
                      <TableHead scope="col" className="w-[80px]" aria-label="Actions">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entryList.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium text-foreground">{entry.email}</TableCell>
                        <TableCell className="text-gray-600">
                          {entry.referrer ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {format(new Date(entry.created_at), "MMM d, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:ring-offset-2"
                            onClick={() => deleteEntry.mutate(entry.id)}
                            disabled={deleteEntry.isPending}
                            aria-label={`Delete submission for ${entry.email}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
