import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <h1 className="font-heading text-5xl font-bold text-foreground">404</h1>
      <p className="mt-4 text-gray-600">This page doesn’t exist.</p>
      <Button asChild className="mt-8 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}
