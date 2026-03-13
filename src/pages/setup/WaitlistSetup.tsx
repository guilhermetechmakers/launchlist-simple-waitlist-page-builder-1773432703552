/**
 * Setup Page (Create / Edit Waitlist): minimal form, live preview, slug/URL, visibility.
 * Routes: /setup/waitlist/new (create), /setup/waitlist/:id (edit).
 */

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
import { BrandingCustomizerPanel } from "@/components/Setup/BrandingCustomizerPanel";
import { LivePreviewPanel } from "@/components/Setup/LivePreviewPanel";
import { SlugEditor } from "@/components/Setup/SlugEditor";
import { slugify, getSlugError } from "@/utils/slugify";
import { toast } from "sonner";

const schema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(80, "Max 80 characters"),
  description: z
    .string()
    .min(1, "Short description is required")
    .max(160, "Max 160 characters"),
  recipient_email: z.string().email("Valid email required"),
  slug: z
    .string()
    .min(1, "URL slug is required")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  button_color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Use a hex color e.g. #D6FF2A")
    .optional()
    .transform((v) => v ?? "#D6FF2A"),
  logo_url: z.string().optional(),
  is_public: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function WaitlistSetup() {
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
    const slugError = getSlugError(data.slug);
    if (slugError) {
      form.setError("slug", { message: slugError });
      return;
    }
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
            showSuccessToast(updated);
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
          onSuccess: (newProject) => {
            showSuccessToast(newProject);
            navigate(`/setup/waitlist/${newProject.id}`);
          },
        }
      );
    }
  };

  function showSuccessToast(p: { slug: string }) {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const publicUrl = p?.slug ? `${baseUrl}/r/${p.slug}` : "";
    toast.success("Waitlist saved", {
      description: publicUrl
        ? "Copy the link below to share your waitlist."
        : undefined,
      action: publicUrl
        ? {
            label: "Copy link",
            onClick: () => {
              navigator.clipboard.writeText(publicUrl);
              toast.success("Link copied");
            },
          }
        : undefined,
    });
    if (publicUrl) {
      toast.info(publicUrl, {
        duration: 8000,
        action: {
          label: "Open",
          onClick: () => window.open(publicUrl, "_blank"),
        },
      });
    }
  }

  const pending = createProject.isPending || updateProject.isPending;
  const watchName = form.watch("name");
  const watchDescription = form.watch("description");
  const watchRecipient = form.watch("recipient_email");
  const watchButtonColor = form.watch("button_color");
  const watchLogoUrl = form.watch("logo_url");
  const watchSlug = form.watch("slug");

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
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-[1300px]">
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
                <p className="text-sm text-muted-foreground">
                  Product name, description, and where to receive signups.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
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
                              maxLength={80}
                              aria-label="Product name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            {(field.value ?? "").length}/80
                          </p>
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
                              aria-label="Recipient email"
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
                          <SlugEditor
                            slug={field.value ?? ""}
                            onSlugChange={field.onChange}
                            error={form.formState.errors.slug?.message}
                            suggestedSlug={suggestedSlug}
                            disabled={pending}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <BrandingCustomizerPanel
                      productName={watchName}
                      description={watchDescription}
                      recipientEmail={watchRecipient}
                      buttonColor={watchButtonColor}
                      logoUrl={watchLogoUrl ?? undefined}
                      onDescriptionChange={(v) => form.setValue("description", v)}
                      onButtonColorChange={(v) => form.setValue("button_color", v)}
                      onLogoUrlChange={(v) => form.setValue("logo_url", v)}
                      descriptionError={form.formState.errors.description?.message}
                      buttonColorError={form.formState.errors.button_color?.message}
                      disabled={pending}
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
                              aria-label="Toggle public visibility"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-wrap gap-2">
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
                      <Button type="button" variant="ghost" asChild>
                        <Link to="/dashboard">Cancel</Link>
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <LivePreviewPanel
                productName={watchName}
                description={watchDescription}
                recipientEmail={watchRecipient}
                buttonColor={watchButtonColor}
                logoUrl={watchLogoUrl || undefined}
                slug={watchSlug}
                publicUrl={project?.public_link ?? undefined}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
