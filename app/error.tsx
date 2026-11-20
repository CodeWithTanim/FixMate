"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
        !
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Something went wrong</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        We encountered an unexpected error while processing your request. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
