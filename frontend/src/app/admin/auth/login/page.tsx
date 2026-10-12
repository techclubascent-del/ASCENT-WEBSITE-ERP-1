"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MinimalBackground from "@/components/MinimalBackground";
import { ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginValues = z.infer<typeof loginSchema>;

function AdminLoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin";

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    try {
      await signIn(values.email, values.password);
      
      // Additional check for admin role can be done here, 
      // but role verification is also in layout/middleware
      
      router.push(redirectTo);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in. Please check your credentials.";
      setServerError(message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <MinimalBackground />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col p-8">
          
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <ShieldCheck className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Gateway</h1>
            <p className="text-sm text-purple-200/70 mt-1">Authorized personnel only</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ascent.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/80">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                className="bg-white/5 border-white/10 text-white focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-sm text-red-400 text-center font-medium">{serverError}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Authenticating...
                </>
              ) : (
                "Access Portal"
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-xs text-white/40">
            <p>Access attempts are logged and monitored.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
