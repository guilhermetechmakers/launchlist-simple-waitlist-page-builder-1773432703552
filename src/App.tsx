import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthGuard } from "@/components/AuthGuard";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import Setup from "@/pages/Setup";
import WaitlistSetup from "@/pages/setup/WaitlistSetup";
import PublicWaitlist from "@/pages/PublicWaitlist";
import Submissions from "@/pages/Submissions";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/r/:slug" element={<PublicWaitlist />} />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/projects"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/setup"
            element={
              <AuthGuard>
                <Setup />
              </AuthGuard>
            }
          />
          <Route
            path="/setup/:id"
            element={
              <AuthGuard>
                <Setup />
              </AuthGuard>
            }
          />
          <Route
            path="/setup/waitlist/new"
            element={
              <AuthGuard>
                <WaitlistSetup />
              </AuthGuard>
            }
          />
          <Route
            path="/setup/waitlist/:id"
            element={
              <AuthGuard>
                <WaitlistSetup />
              </AuthGuard>
            }
          />
          <Route
            path="/project/:id/submissions"
            element={
              <AuthGuard>
                <Submissions />
              </AuthGuard>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy" />} />
          <Route path="/terms" element={<PlaceholderPage title="Terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="font-heading text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-muted-foreground">Content coming soon.</p>
    </div>
  );
}
