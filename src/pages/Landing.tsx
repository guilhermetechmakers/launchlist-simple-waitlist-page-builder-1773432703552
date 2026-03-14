import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ListPlus, Zap, Share2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Landing() {
  // Loading state for hero preview: show skeleton briefly to avoid layout shift and demonstrate loading pattern
  const [isHeroPreviewReady, setHeroPreviewReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setHeroPreviewReady(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1" role="main" aria-label="LaunchList landing page">
        <section
          id="hero"
          aria-labelledby="hero-heading"
          className="relative overflow-hidden border-b border-border bg-surface-dark px-4 py-16 md:px-6 md:py-24 lg:py-32"
        >
          <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <h1
                id="hero-heading"
                className="font-heading text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
              >
                Waitlist pages in under two minutes
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-hero-subtitle">
                Create a minimal, conversion-focused landing page to collect emails before launch. No complexity—just headline, description, and signup.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:opacity-95 focus-visible:ring-primary/30"
                  aria-label="Get started free — create your waitlist"
                >
                  <Link to="/signup">Get started free</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 focus-visible:ring-white/30"
                  aria-label="Log in to your account"
                >
                  <Link to="/login">Log in</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-[28px] bg-surface-dark-raised p-8 shadow-xl">
              {!isHeroPreviewReady ? (
                <div
                  className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-card p-6"
                  aria-busy="true"
                  aria-label="Loading preview"
                >
                  <Skeleton className="h-6 w-24 rounded-md" aria-hidden />
                  <Skeleton className="h-4 w-full rounded-md" aria-hidden />
                  <Skeleton className="h-12 w-full rounded-xl" aria-hidden />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-xl" aria-hidden />
                    <Skeleton className="h-10 w-14 rounded-xl" aria-hidden />
                  </div>
                  <Skeleton className="h-3 w-32 rounded-md" aria-hidden />
                </div>
              ) : (
                <div
                  className={cn(
                    "w-full max-w-sm rounded-2xl border border-white/10 bg-card p-6 text-center shadow-card",
                    "animate-fade-in-up"
                  )}
                >
                  <p className="font-heading text-lg font-semibold text-foreground">Your Product</p>
                  <p className="mt-2 text-sm text-muted-foreground">Short description for early adopters.</p>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="hero-preview-email" className="sr-only">
                      Email address for waitlist signup
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="hero-preview-email"
                        type="email"
                        placeholder="you@example.com"
                        readOnly
                        className="flex-1"
                        aria-label="Email address for waitlist signup (preview)"
                        aria-invalid={false}
                      />
                      <Button size="sm" className="shrink-0" aria-label="Join waitlist">
                        Join
                      </Button>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">Join 0 others on the list</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          aria-labelledby="how-it-works-heading"
          className="border-b border-border bg-background px-4 py-16 md:px-6 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <h2
              id="how-it-works-heading"
              className="font-heading text-3xl font-bold text-foreground md:text-4xl"
            >
              How it works
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Three steps to a live waitlist page.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3" role="list">
              {[
                {
                  step: "1",
                  title: "Create your waitlist",
                  description: "Add your product name, short description, and where to receive signups. Pick a button color and optional logo.",
                  icon: ListPlus,
                },
                {
                  step: "2",
                  title: "Publish & share",
                  description: "Get a public link instantly. Share it on Twitter, in your bio, or anywhere you want to capture interest.",
                  icon: Share2,
                },
                {
                  step: "3",
                  title: "Collect & export",
                  description: "See signups in one place. Export to CSV anytime. Get notified when someone joins.",
                  icon: BarChart3,
                },
              ].map(({ step, title, description, icon: Icon }) => (
                <div
                  key={step}
                  role="listitem"
                  className="animate-fade-in-up rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary" aria-hidden>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-heading text-lg font-semibold text-foreground">{title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          aria-labelledby="features-heading"
          className="border-b border-border bg-card px-4 py-16 md:px-6 md:py-24"
        >
          <div className="mx-auto max-w-[1200px]">
            <h2
              id="features-heading"
              className="font-heading text-3xl font-bold text-foreground md:text-4xl"
            >
              Built for makers
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Minimal setup. Professional result. No code required.
            </p>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2" role="list">
              {[
                "Custom headline and description",
                "Optional logo and button color",
                "Public link you can share anywhere",
                "Email notifications on new signups",
                "CSV export for your list",
                "Simple dashboard to manage everything",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <Zap className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="cta-heading"
          className="bg-background px-4 py-16 md:px-6 md:py-24"
        >
          <div className="mx-auto max-w-[1200px] text-center">
            <h2
              id="cta-heading"
              className="font-heading text-3xl font-bold text-foreground md:text-4xl"
            >
              Start collecting signups today
            </h2>
            <p className="mt-4 text-muted-foreground">
              Free to start. Set up in under two minutes.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 focus-visible:ring-primary/30"
              aria-label="Get started — create your waitlist"
            >
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
