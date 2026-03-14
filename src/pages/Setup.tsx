import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";
import { useProject, useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { usePublishProject } from "@/hooks/usePublishProject";
import { DEFAULT_BUTTON_COLOR } from "@/lib/design-tokens";
import {
  BrandingUploader,
  ButtonColorPicker,
  CopyEditor,
  LivePreview,
  PublicLinkGenerator,
} from "@/components/branding";
import { AlertCircle, ArrowLeft } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Product name is required").max(100, "Max 100 characters"),
  description: z.string().max(160).optional(),
  recipient_email: z.string().email("Valid email required"),
  slug: z
    .string()
    .min(1, "URL slug is required")
    .regex(/^[a-z0-9-]+$/i, "Only letters, numbers, and hyphens"),
  button_color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, `Use a hex color e.g. ${DEFAULT_BUTTON_COLOR}`)
    .optional()
    .transform((v) => v || DEFAULT_BUTTON_COLOR),
  logo_url: z.string().optional(),
  is_public: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "waitlist"
  );
}

export default function Setup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: project, isLoading, isError, error, refetch } = useProject(id);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject(id ?? "");
  const publishProject = usePublishProject();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      recipient_email: "",
      slug: "",
      button_color: DEFAULT_BUTTON_COLOR,
      logo_url: "",
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
        button_color: project.button_color ?? DEFAULT_BUTTON_COLOR,
        logo_url: project.logo_url ?? "",
        is_public: project.is_public,
      });
    }
  }, [project, form]);

  const onSubmit = (data: FormValues) => {
    const loadingToastId = toast.loading(isEdit ? "Saving waitlist…" : "Creating waitlist…");
    if (isEdit) {
      updateProject.mutate(
        {
          name: data.name,
          description: data.description || null,
          recipient_email: data.recipient_email,
          slug: data.slug,
          button_color: data.button_color,
          logo_url: data.logo_url || null,
          is_public: data.is_public,
        },
        {
          onSettled: () => toast.dismiss(loadingToastId),
          onSuccess: (updated) => {
            publishProject.mutate(updated.id);
          },
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
          logo_url: data.logo_url || null,
          is_public: data.is_public,
        },
        {
          onSettled: () => toast.dismiss(loadingToastId),
          onSuccess: (newProject) => navigate(`/setup/${newProject.id}`),
        }
      );
    }
  };

  const pending = createProject.isPending || updateProject.isPending;
  const watchName = form.watch("name");
  const watchDescription = form.watch("description");
  const watchRecipient = form.watch("recipient_email");
  const watchButtonColor = form.watch("button_color");
  const watchLogoUrl = form.watch("logo_url");

  // Skeleton loading state while project data is loading (edit mode only)
  if (isEdit && isLoading && !project) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-8 md:px-6" aria-busy="true" aria-label="Loading waitlist setup">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-6 flex items-center gap-4">
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-8 w-40 rounded-md" />
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="rounded-xl border border-border bg-card shadow-md">
                <CardHeader className="p-6 pb-4">
                  <Skeleton className="h-6 w-20 rounded-lg" />
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24 rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  ))}
                  <div className="flex gap-4 pt-4">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-6">
                <Card className="rounded-xl border border-border bg-card shadow-md">
                  <CardHeader className="p-6 pb-4">
                    <Skeleton className="h-6 w-24 rounded-lg" />
                    <Skeleton className="h-4 w-full max-w-xs rounded-lg" />
                  </CardHeader>
                  <CardContent className="space-y-4 p-6 pt-0">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </CardContent>
                </Card>
                <Card className="rounded-xl border border-border bg-card shadow-md">
                  <CardHeader className="p-6 pb-4">
                    <Skeleton className="h-6 w-28 rounded-lg" />
                    <Skeleton className="h-4 w-full max-w-sm rounded-lg" />
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state when project fails to load (edit mode)
  if (isEdit && isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <Card className="w-full max-w-md rounded-xl border border-destructive/30 bg-destructive/5 shadow-md">
            <CardContent className="flex flex-col items-center gap-6 p-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" aria-hidden />
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Could not load waitlist
              </h2>
              <p className="text-sm text-secondary">
                {error instanceof Error ? error.message : "Something went wrong."}
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => refetch()} className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="Retry loading waitlist">
                  Retry
                </Button>
                <Button asChild className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Link to="/dashboard" aria-label="Back to dashboard">
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 md:px-6" role="main" aria-label={isEdit ? "Edit waitlist setup" : "Create new waitlist"}>
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="Back to dashboard">
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
                Dashboard
              </Link>
            </Button>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {isEdit ? "Edit waitlist" : "New waitlist"}
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="rounded-xl border border-border bg-card shadow-md">
              <CardHeader className="p-6 pb-4">
                <h2 className="font-heading text-lg font-semibold text-foreground">Details</h2>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="My Awesome App"
                              maxLength={100}
                              {...field}
                            />
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
                          <CopyEditor
                            label="Short description (optional)"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            placeholder="One line that describes your product."
                            error={form.formState.errors.description?.message}
                          />
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
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              {...field}
                            />
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
                          <ButtonColorPicker
                            value={field.value}
                            onChange={field.onChange}
                            error={form.formState.errors.button_color?.message}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="logo_url"
                      render={({ field }) => (
                        <FormItem>
                          <BrandingUploader
                            logoUrl={field.value || undefined}
                            onLogoUrlChange={field.onChange}
                            disabled={pending}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_public"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border p-4">
                          <div className="space-y-1">
                            <FormLabel>Public</FormLabel>
                            <p className="text-sm text-secondary">
                              Anyone with the link can join the waitlist.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              aria-label="Allow anyone with the link to join the waitlist"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4 pt-2">
                      <Button
                        type="submit"
                        disabled={pending}
                        className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label={isEdit ? "Save and publish waitlist" : "Create and publish waitlist"}
                      >
                        {pending
                          ? "Saving…"
                          : isEdit
                            ? "Save & publish"
                            : "Save & publish"}
                      </Button>
                      {isEdit && project && (
                        <Button
                          type="button"
                          variant="outline"
                          disabled={publishProject.isPending}
                          onClick={() => publishProject.mutate(project.id)}
                          className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label="Publish waitlist to generate public link"
                        >
                          {publishProject.isPending ? "Publishing…" : "Publish"}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              <LivePreview
                productName={watchName}
                description={watchDescription}
                recipientEmail={watchRecipient}
                buttonColor={watchButtonColor}
                logoUrl={watchLogoUrl || undefined}
              />
              <PublicLinkGenerator
                slug={slug}
                publicLink={project?.public_link}
                brandingVersion={project?.branding_version ?? 0}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
