"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#F6F5EF] px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-[#DCE5DF] bg-white p-8 sm:p-10 shadow-lg text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
          <AlertCircle className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            System Diagnostic Alert
          </span>
          <h2 className="text-2xl font-black text-[#152C2B] tracking-tight">
            Unexpected Service Glitch
          </h2>
          <p className="text-xs text-[#526564] leading-relaxed">
            We encountered an unexpected error processing this view. You can retry the operation or return to the main dashboard.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#18756B] px-4 py-3 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-4 py-3 text-xs font-bold text-[#152C2B] hover:bg-[#DCE5DF] transition"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
