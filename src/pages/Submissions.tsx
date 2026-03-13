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
import { Download, ArrowLeft, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function Submissions() {
  const { id } = useParams<{ id: string }>();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: entries, isLoading: entriesLoading } = useSubmissions(id, from || undefined, to || undefined);
  const exportCsv = useExportSubmissions(id ?? "");
  const deleteEntry = useDeleteSubmission(id ?? "");

  if (projectLoading || !id) {
    return (
      <div className="flex min-h-screen flex-col">
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
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center p-8">
          <p className="text-muted-foreground">Project not found.</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="mr-1 h-4 w-4" />
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
              onClick={() => exportCsv.mutate({ from: from || undefined, to: to || undefined })}
              disabled={exportCsv.isPending}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h2 className="font-heading text-lg font-semibold">Signups</h2>
              <span className="text-sm text-muted-foreground">
                {entries?.length ?? 0} total
              </span>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="filter-from" className="text-sm">From</Label>
                  <Input
                    id="filter-from"
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="filter-to" className="text-sm">To</Label>
                  <Input
                    id="filter-to"
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>

              {entriesLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : !entries?.length ? (
                <p className="py-8 text-center text-muted-foreground">
                  No submissions yet. Share your waitlist link to start collecting signups.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Referrer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.email}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {entry.referrer || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(entry.created_at), "MMM d, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteEntry.mutate(entry.id)}
                            disabled={deleteEntry.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
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
