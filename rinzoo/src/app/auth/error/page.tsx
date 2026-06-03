"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "There is a server configuration error. Please contact the administrator.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The sign-in link has expired or has already been used.",
  Default: "An unexpected error occurred. Please try again.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";
  const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default;

  return (
    <Card className="bg-neutral-900 border border-white/10">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff6467]/15">
            <AlertTriangle className="h-6 w-6 text-[#ff6467]" />
          </div>
        </div>
        <CardTitle className="text-lg text-[#ff6467]">Authentication Error</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-[#a1a1a1]">{message}</p>
        <Button asChild variant="outline" className="w-full bg-transparent text-[#5ea3ff] border-[#2b7fff] border-2 hover:bg-[#2b7fff]/10">
          <Link href="/auth/signin">Back to Sign In</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="h-48 rounded-xl bg-neutral-900 border border-white/10 animate-pulse" />}>
          <AuthErrorContent />
        </Suspense>
      </div>
    </div>
  );
}
