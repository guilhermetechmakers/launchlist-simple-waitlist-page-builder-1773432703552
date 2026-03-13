import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 py-8"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading authentication"
      >
        {/* Spinner: visible loading indicator per design system */}
        <div className="flex flex-col items-center gap-4">
          <Loader2
            className="h-10 w-10 animate-spin text-primary"
            aria-hidden
          />
          {/* Skeleton lines for consistent loading-state UX */}
          <div className="flex w-full max-w-xs flex-col gap-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        {/* Screen reader text: live region announces this message */}
        <p className="sr-only">Loading your account…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
