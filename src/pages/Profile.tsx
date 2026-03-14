import { Link } from "react-router-dom";
import { LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";
import { useUser, useSignOut } from "@/hooks/useAuth";

export default function Profile() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const signOut = useSignOut();

  // Loading state: show skeleton while auth state is resolving (avoids flash of empty state)
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen flex-col" role="main" aria-busy="true" aria-label="Loading profile">
        <Navbar />
        <main className="flex-1 px-4 py-8 md:px-6">
          <div className="mx-auto max-w-[600px] space-y-6">
            <Skeleton className="h-9 w-24 rounded-button" aria-hidden />
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-24" aria-hidden />
                <Skeleton className="mt-2 h-4 w-56" aria-hidden />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-16 w-full rounded-lg" aria-hidden />
                <Skeleton className="h-11 w-28 rounded-button" aria-hidden />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Empty state: not signed in — helpful copy, icon, and clear CTA per design guidelines
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col" role="main" aria-label="Profile page">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 md:px-6">
          <Card className="w-full max-w-[400px] border-border shadow-card animate-fade-in">
            <CardHeader className="text-center">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50 text-muted-foreground"
                aria-hidden
              >
                <LogIn className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl">You’re not signed in</CardTitle>
              <CardDescription className="mt-2 text-base">
                Sign in to view your profile, manage waitlists, and access your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button asChild className="w-full" aria-label="Go to login page">
                <Link to="/login">
                  <LogIn className="h-4 w-4" aria-hidden />
                  Log in
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" role="main" aria-label="Profile page">
      <Navbar />
      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-[600px]">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-6"
            aria-label="Back to dashboard"
          >
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Dashboard
            </Link>
          </Button>
          <Card>
            <CardHeader>
              <CardTitle id="profile-heading">Profile</CardTitle>
              <CardDescription id="profile-description">
                Your account details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground" id="email-label">Email</p>
                <p className="mt-1 text-foreground" aria-labelledby="email-label">{user.email ?? "—"}</p>
              </div>
              {user.user_metadata?.full_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground" id="name-label">Name</p>
                  <p className="mt-1 text-foreground" aria-labelledby="name-label">{String(user.user_metadata.full_name)}</p>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => signOut.mutate()}
                disabled={signOut.isPending}
                loading={signOut.isPending}
                aria-label={signOut.isPending ? "Signing out…" : "Sign out of your account"}
                aria-busy={signOut.isPending}
              >
                {signOut.isPending ? "Signing out…" : "Sign out"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
