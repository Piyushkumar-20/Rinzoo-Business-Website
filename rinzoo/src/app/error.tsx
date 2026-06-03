"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ff6467]/15 mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-[#ff6467]" />
        </div>
        <h1 className="text-2xl font-extrabold text-neutral-50 mb-2">Something went wrong</h1>
        <p className="text-[#a1a1a1] text-sm mb-8">
          An unexpected error occurred. Our team has been notified.
          {error.digest && (
            <span className="block mt-1 text-xs text-neutral-500">Error ID: {error.digest}</span>
          )}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-[#2b7fff] px-6 py-3 text-sm font-bold text-white hover:bg-[#2b7fff]/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border-2 border-white/15 px-6 py-3 text-sm font-bold text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
