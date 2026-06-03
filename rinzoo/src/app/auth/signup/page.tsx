"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    // 1. Create account
    const res = await fetch("/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    });

    const json = await res.json();

    if (!res.ok) {
      setServerError(json?.error?.message ?? "Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);

    // 2. Auto-login
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    // 3. Redirect to home
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0d1f4a] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative z-10 text-center">
          <Image src="/images/logo.png" alt="Rinzoo" width={160} height={64} className="h-16 w-auto object-contain mx-auto mb-8" />
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Join the<br />
            <span className="text-[#e91e63]">Rinzoo Family</span>
          </h2>
          <p className="mt-4 text-gray-300 max-w-xs mx-auto text-sm leading-relaxed">
            Create your account to stay updated on exclusive offers, new launches, and distributor opportunities.
          </p>

          <div className="mt-8 space-y-3 text-left max-w-xs mx-auto">
            {["Exclusive member offers", "Early access to new products", "Distributor network benefits"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="h-4 w-4 text-[#e91e63] shrink-0" />
                {item}
              </div>
            ))}
          </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Free to join — takes less than a minute</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Account created!</h3>
              <p className="text-sm text-gray-500 mt-2">Signing you in automatically…</p>
              <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto mt-4" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {serverError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {serverError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Arjun Sharma"
                  autoComplete="name"
                  {...register("name")}
                  className="rounded-xl"
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
              </div>

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
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  {...register("password")}
                  className="rounded-xl"
                />
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className="rounded-xl"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full rounded-xl bg-[#e91e63] hover:bg-[#c2185b]" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Creating account…</>
                ) : (
                  "Create account"
                )}
              </Button>

              <p className="text-center text-xs text-gray-400">
                By creating an account you agree to our terms of service.
              </p>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-semibold text-[#e91e63] hover:underline">
              Sign in
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
