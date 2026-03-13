import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { useUser, useSignOut } from "@/hooks/useAuth";

export default function Profile() {
  const { data: user } = useUser();
  const signOut = useSignOut();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center p-8">
          <p className="text-muted-foreground">Not signed in.</p>
          <Button asChild className="mt-4">
            <Link to="/login">Log in</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-[600px]">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/dashboard">← Dashboard</Link>
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Your account details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="mt-1 text-foreground">{user.email}</p>
              </div>
              {user.user_metadata?.full_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="mt-1 text-foreground">{user.user_metadata.full_name}</p>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => signOut.mutate()}
                disabled={signOut.isPending}
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
