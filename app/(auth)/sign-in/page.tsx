"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Signing in...");

    try {
      const res = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to sign in. Please check your credentials.", { id: toastId });
        setErrorMsg(res.error.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      toast.success("Signed in successfully!", { id: toastId });

      // Redirect safely to callback or dashboard
      const safeTarget = callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
      router.push(safeTarget);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error(message, { id: toastId });
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
        <p className="text-xs text-slate-500">Sign in to manage repair requests and bookings</p>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-semibold text-sky-600 hover:text-sky-700">
          Create an account
        </Link>
      </div>
    </div>
  );
}
