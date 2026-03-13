import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { useProject, useCreateProject, useUpdateProject } from "@/hooks/useProjects";

const schema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  recipient_email: z.string().email("Valid email required"),
  slug: z.string().min(1, "URL slug is required").regex(/^[a-z0-9-]+$/i, "Only letters, numbers, and hyphens"),
  button_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Use a hex color e.g. #D6FF2A"),
  is_public: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "waitlist";
}

export default function Setup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: project, isLoading } = useProject(id);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject(id ?? "");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      recipient_email: "",
      slug: "",
      button_color: "#D6FF2A",
      is_public: true,
    },
  });

  const name = form.watch("name");
  const slug = form.watch("slug");
  const suggestedSlug = useMemo(() => slugify(name), [name]);

  useEffect(() => {
    if (!slug && name) form.setValue("slug", suggestedSlug);
  }, [suggestedSlug, name, slug, form]);

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description ?? "",
        recipient_email: project.recipient_email,
        slug: project.slug,
        button_color: project.button_color,
        is_public: project.is_public,
      });
    }
  }, [project, form]);

  const onSubmit = (data: FormValues) => {
    if (isEdit) {
      updateProject.mutate(
        {
          name: data.name,
          description: data.description || null,
          recipient_email: data.recipient_email,
          slug: data.slug,
          button_color: data.button_color,
          is_public: data.is_public,
        },
        {
          onSuccess: () => navigate("/dashboard"),
        }
      );
    } else {
      createProject.mutate(
        {
          name: data.name,
          description: data.description || null,
          recipient_email: data.recipient_email,
          slug: data.slug,
          button_color: data.button_color,
          is_public: data.is_public,
        },
        {
          onSuccess: (newProject) => navigate(`/setup/${newProject.id}`),
        }
      );
    }
  };

  const pending = createProject.isPending || updateProject.isPending;

  if (isEdit && isLoading && !project) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center p-8">
          <p className="text-muted-foreground">Loading…</p>
        </main>
      </div>
    );
  }

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/r/${form.getValues("slug") || "..."}` : "";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">← Dashboard</Link>
            </Button>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {isEdit ? "Edit waitlist" : "New waitlist"}
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <h2 className="font-heading text-lg font-semibold">Details</h2>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product name</FormLabel>
                          <FormControl>
                            <Input placeholder="My Awesome App" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short description (optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="One line that describes your product." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="recipient_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notify this email when someone joins</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL slug</FormLabel>
                          <FormControl>
                            <Input placeholder="my-awesome-app" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="button_color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button color (hex)</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="#D6FF2A" {...field} />
                              <input
                                type="color"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="h-12 w-14 cursor-pointer rounded-xl border border-border"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_public"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                          <div>
                            <FormLabel>Public</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Anyone with the link can join the waitlist.
                            </p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={pending}>
                      {pending ? "Saving…" : isEdit ? "Save changes" : "Save & publish"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <h2 className="font-heading text-lg font-semibold">Preview</h2>
                  <p className="text-sm text-muted-foreground">Your public page</p>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-border bg-background p-6">
                    <p className="font-heading text-lg font-semibold text-foreground">
                      {form.watch("name") || "Your Product"}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {form.watch("description") || "Short description for early adopters."}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Input
                        placeholder="you@example.com"
                        className="flex-1"
                        readOnly
                        disabled
                      />
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: form.watch("button_color") || "#D6FF2A",
                          color: "#0B0B0B",
                        }}
                      >
                        Join
                      </Button>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Join 0 others on the list
                    </p>
                  </div>
                </CardContent>
              </Card>
              {form.watch("slug") && (
                <p className="text-sm text-muted-foreground">
                  Public URL:{" "}
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {publicUrl}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
