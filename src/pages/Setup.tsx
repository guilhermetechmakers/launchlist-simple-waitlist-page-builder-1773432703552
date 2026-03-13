import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo } from "react";
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
import { Navbar } from "@/components/layout/Navbar";
import { useProject, useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { usePublishProject } from "@/hooks/usePublishProject";
import {
  BrandingUploader,
  ButtonColorPicker,
  CopyEditor,
  LivePreview,
  PublicLinkGenerator,
} from "@/components/branding";

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
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Use a hex color e.g. #D6FF2A")
    .optional()
    .transform((v) => v || "#D6FF2A"),
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
  const { data: project, isLoading } = useProject(id);
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
      button_color: "#D6FF2A",
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
        button_color: project.button_color ?? "#D6FF2A",
        logo_url: project.logo_url ?? "",
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
          logo_url: data.logo_url || null,
          is_public: data.is_public,
        },
        {
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
            <Card className="shadow-card">
              <CardHeader>
                <h2 className="font-heading text-lg font-semibold">Details</h2>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
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
                            value={field.value}
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
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                          <div>
                            <FormLabel>Public</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Anyone with the link can join the waitlist.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={pending}>
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
                        >
                          {publishProject.isPending ? "Publishing…" : "Publish"}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <LivePreview
                productName={watchName}
                description={watchDescription}
                recipientEmail={watchRecipient}
                buttonColor={watchButtonColor}
                logoUrl={watchLogoUrl || undefined}
              />
              <PublicLinkGenerator
                slug={form.watch("slug")}
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
