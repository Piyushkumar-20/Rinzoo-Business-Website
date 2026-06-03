"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type State = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [state, setState] = useState<State>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("No verification token found. Please check your email link.");
      return;
    }

    fetch(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setState("success");
          setMessage(json.data.message ?? "Your email has been verified.");
          // Redirect to sign-in after 2 s
          setTimeout(() => router.push("/auth/signin?verified=true"), 2000);
        } else {
          setState("error");
          setMessage(json.error?.message ?? "This link is invalid or has expired.");
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token, router]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="size-12 rounded-xl bg-[#2b7fff] flex items-center justify-center overflow-hidden mx-auto mb-8">
          <Image src="/images/logo.png" alt="Rinzoo" width={48} height={48} className="object-cover w-full h-full" />
        </div>

        {state === "loading" && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#5ea3ff] mx-auto" />
            <p className="text-neutral-300 font-medium">Verifying your email…</p>
          </div>
        )}

        {state === "success" && (
          <div className="space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2b7fff]/15 mx-auto">
              <CheckCircle2 className="h-9 w-9 text-[#5ea3ff]" />
            </div>
            <h1 className="text-xl font-bold text-neutral-50">Email Verified!</h1>
            <p className="text-[#a1a1a1] text-sm">{message}</p>
            <p className="text-neutral-500 text-xs">Redirecting you to sign in…</p>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff6467]/15 mx-auto">
              <XCircle className="h-9 w-9 text-[#ff6467]" />
            </div>
            <h1 className="text-xl font-bold text-neutral-50">Verification Failed</h1>
            <p className="text-[#a1a1a1] text-sm">{message}</p>
            <div className="flex flex-col gap-2 mt-4">
              <Link
                href="/auth/signup"
                className="rounded-full bg-[#2b7fff] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#2b7fff]/90 transition-colors"
              >
                Create a new account
              </Link>
              <Link href="/auth/signin" className="text-sm text-neutral-500 hover:text-neutral-300">
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
