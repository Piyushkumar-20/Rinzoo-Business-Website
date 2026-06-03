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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 text-sm mb-8">
          An unexpected error occurred. Our team has been notified.
          {error.digest && (
            <span className="block mt-1 text-xs text-gray-400">Error ID: {error.digest}</span>
          )}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-[#e91e63] px-6 py-3 text-sm font-bold text-white hover:bg-[#c2185b] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
