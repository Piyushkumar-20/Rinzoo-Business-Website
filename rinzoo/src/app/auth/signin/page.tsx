"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const ADMIN_ROLES = ["super_admin", "marketing_manager", "sales_manager", "content_manager"];

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    // Fetch session to determine role-based redirect
    const session = await getSession();
    const role = session?.user?.role ?? "user";

    if (ADMIN_ROLES.includes(role)) {
      // Admin users go to the admin dashboard (or their intended admin destination)
      const dest = callbackUrl.startsWith("/admin") ? callbackUrl : "/admin/dashboard";
      router.push(dest);
    } else {
      // Regular users go to the home page (or a non-admin callbackUrl)
      const dest = callbackUrl && !callbackUrl.startsWith("/admin") ? callbackUrl : "/";
      router.push(dest);
    }
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0d1f4a] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/5" />

        <div className="relative z-10 text-center">
          <Image src="/images/logo.png" alt="Rinzoo" width={160} height={64} className="h-16 w-auto object-contain mx-auto mb-8" />
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Welcome to<br />
            <span className="text-[#e91e63]">Rinzoo</span>
          </h2>
          <p className="mt-4 text-gray-300 max-w-xs mx-auto text-sm leading-relaxed">
            Premium detergent powder by Ropox Industries — powerful cleaning at a price every household can trust.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Image src="/images/logo.png" alt="Rinzoo" width={120} height={48} className="h-12 w-auto object-contain" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                className="rounded-xl"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                className="rounded-xl"
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Signing in…</>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-[#e91e63] hover:underline">
              Create one free
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-gray-500">
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              ← Back to Rinzoo.in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
