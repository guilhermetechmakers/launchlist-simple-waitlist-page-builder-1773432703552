import { useParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePublicWaitlistPage } from "@/hooks/useProjects";
import { useJoinWaitlist } from "@/hooks/useJoinWaitlist";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { projectKeys } from "@/hooks/useProjects";


const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function PublicWaitlist() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = usePublicWaitlistPage(slug);
  const project = data?.project;
  const waitlistCount = data?.waitlistCount ?? 0;
  const join = useJoinWaitlist(slug ?? "");
  const [joined, setJoined] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: FormValues) => {
    join.mutate(data.email, {
      onSuccess: () => {
        setJoined(true);
        if (slug) {
          queryClient.invalidateQueries({
            queryKey: [...projectKeys.bySlug(slug), "page"],
          });
        }
      },
    });
  };

  if (isLoading || !slug) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <Skeleton className="h-12 w-64 animate-pulse" />
        <Skeleton className="mt-4 h-6 w-48 animate-pulse" />
        <Skeleton className="mt-8 h-12 w-80 animate-pulse" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Waitlist not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          This page doesn’t exist or is not public.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    );
  }

  // Use design tokens when no custom color; custom color uses inline style with token for text.
  const customButtonColor = project.button_color?.trim() ?? "";
  const usePrimaryToken = !customButtonColor;
  const description =
    project.description?.trim() || "Join the waitlist to get early access.";
  const productName = project.name?.trim() || "Waitlist";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border px-4 py-4">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Link
            to="/"
            className="font-heading text-lg font-bold text-foreground rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            LaunchList
          </Link>
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-foreground rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-border bg-card p-6 shadow-lg transition-shadow duration-200 hover:shadow-xl md:p-8">
          {project.logo_url && (
            <img
              src={project.logo_url}
              alt=""
              className="mx-auto mb-6 h-16 w-auto max-w-[200px] object-contain"
            />
          )}
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            {productName}
          </h1>
          <p className="mt-4 text-muted-foreground">{description}</p>

          {joined ? (
            <div className="mt-8 flex flex-col items-center gap-2 rounded-xl bg-primary/10 py-6 text-center animate-scale-in">
              <Check className="h-10 w-10 text-primary" />
              <p className="font-semibold text-foreground">
                You’re on the list!
              </p>
              <p className="text-sm text-muted-foreground">
                We’ll notify you when we launch.
              </p>
            </div>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="public-waitlist-email" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="public-waitlist-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...form.register("email")}
                  className="h-12 w-full rounded-xl border-border bg-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-invalid={Boolean(form.formState.errors.email)}
                  aria-describedby={
                    form.formState.errors.email
                      ? "public-waitlist-email-error"
                      : undefined
                  }
                />
                {form.formState.errors.email && (
                  <p
                    id="public-waitlist-email-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="h-12 w-full rounded-xl text-primary-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={
                  usePrimaryToken
                    ? undefined
                    : { backgroundColor: customButtonColor }
                }
                disabled={join.isPending}
              >
                {join.isPending ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden
                    />
                    <span>Joining…</span>
                  </>
                ) : (
                  "Join waitlist"
                )}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {waitlistCount === 0
              ? "Be the first to join. Share this page to grow the waitlist."
              : `Join ${waitlistCount} other${waitlistCount === 1 ? "" : "s"} on the list. Share this page to grow your waitlist.`}
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            Powered by LaunchList
          </Link>
          {" · "}
          <Link to="/privacy" className="hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            Privacy
          </Link>
        </p>
      </main>
    </div>
  );
}
