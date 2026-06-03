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
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const ADMIN_ROLES = ["super_admin", "marketing_manager", "sales_manager", "content_manager"];

const inputClass =
  "w-full rounded-xl bg-neutral-900 border border-white/10 text-neutral-50 placeholder:text-neutral-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fff] focus:border-transparent";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "";
  const justVerified = searchParams.get("verified") === "true";
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

    const session = await getSession();
    const role = session?.user?.role ?? "user";
    if (ADMIN_ROLES.includes(role)) {
      router.push(callbackUrl.startsWith("/admin") ? callbackUrl : "/admin/dashboard");
    } else {
      router.push(callbackUrl && !callbackUrl.startsWith("/admin") ? callbackUrl : "/");
    }
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-neutral-950 text-neutral-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-900 flex-col items-center justify-center p-12 relative overflow-hidden border-r border-white/10">
        <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-[#2b7fff]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 -left-10 size-64 rounded-full bg-[oklch(0.62_0.19_47)]/15 blur-3xl" />
        <div className="relative z-10 text-center">
          <div className="size-16 rounded-2xl bg-[#2b7fff] flex items-center justify-center overflow-hidden mx-auto mb-8">
            <Image src="/images/logo.png" alt="Rinzoo" width={64} height={64} className="object-cover w-full h-full" />
          </div>
          <h2 className="text-3xl font-extrabold leading-tight">
            Welcome to<br />
            <span className="bg-gradient-to-r from-[#5ea3ff] to-[oklch(0.78_0.12_240)] bg-clip-text text-transparent">Rinzoo</span>
          </h2>
          <p className="mt-4 text-[#a1a1a1] max-w-xs mx-auto text-sm leading-relaxed">
            Premium detergent powder by Ropox Industries — powerful cleaning at a price every household can trust.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="size-12 rounded-xl bg-[#2b7fff] flex items-center justify-center overflow-hidden">
              <Image src="/images/logo.png" alt="Rinzoo" width={48} height={48} className="object-cover w-full h-full" />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-50">Sign in</h1>
            <p className="text-sm text-[#a1a1a1] mt-1">Enter your credentials to continue</p>
          </div>

          {justVerified && (
            <div className="flex items-center gap-2 rounded-xl bg-[#2b7fff]/10 border border-[#2b7fff]/30 px-4 py-3 text-sm text-[#5ea3ff] mb-5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Email verified! You can now sign in.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-[#ff6467]/10 border border-[#ff6467]/30 px-4 py-3 text-sm text-[#ff6467]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-neutral-300">Email address</Label>
              <input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} className={inputClass} />
              {errors.email && <p className="text-xs text-[#ff6467]">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-neutral-300">Password</Label>
              <input id="password" type="password" placeholder="••••••••" autoComplete="current-password" {...register("password")} className={inputClass} />
              {errors.password && <p className="text-xs text-[#ff6467]">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full rounded-xl bg-[#2b7fff] hover:bg-[#2b7fff]/90 text-white" disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="h-4 w-4 animate-spin" />Signing in…</>) : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#a1a1a1]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-[#5ea3ff] hover:underline">Create one free</Link>
          </p>
          <p className="mt-4 text-center text-sm">
            <Link href="/" className="text-neutral-500 hover:text-neutral-300 transition-colors">← Back to Rinzoo.in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
