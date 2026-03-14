import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useResetPassword } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const reset = useResetPassword();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: FormValues) => reset.mutate(data.email);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md animate-fade-in-up rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>
              Enter your email and we’ll send you a link to set a new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={reset.isPending}
                >
                  {reset.isPending ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-foreground/80">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md text-primary outline-none transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Back to log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
