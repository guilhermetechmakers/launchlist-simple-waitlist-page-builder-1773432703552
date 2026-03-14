import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { useSignIn } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: FormValues) => {
    signIn.mutate(data, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md animate-fade-in-up rounded-xl border border-border bg-card shadow-md transition-shadow duration-200 hover:shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-foreground">Log in</CardTitle>
            <CardDescription className="text-foreground/80">
              Enter your email and password to access your waitlists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {signIn.isError && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{signIn.error?.message ?? "Sign in failed. Please try again."}</span>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          aria-label="Email address"
                          className="min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          aria-label="Password"
                          className="min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/forgot-password"
                    className="inline-flex min-h-[44px] min-w-[44px] items-center text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={signIn.isPending}
                >
                  {signIn.isPending ? "Signing in…" : "Log in"}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-foreground/85">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="inline-flex min-h-[44px] items-center font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
