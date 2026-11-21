"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Lock, Mail, Loader2 } from "lucide-react";
import { getSafeRedirectUrl } from "@/lib/utils";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: getSafeRedirectUrl(callbackUrl, "/dashboard/customer"),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to initiate Google sign in.";
      toast.error(message);
      setErrorMsg(message);
      setGoogleLoading(false);
    }
  };

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

      let defaultRoleUrl = "/dashboard/customer";
      const userRole = (res.data?.user as { role?: string })?.role;
      if (userRole === "admin") defaultRoleUrl = "/dashboard/admin";
      else if (userRole === "technician") defaultRoleUrl = "/dashboard/technician";

      const targetUrl = getSafeRedirectUrl(callbackUrl, defaultRoleUrl);
      router.push(targetUrl);
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
              className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-9 pr-3 text-sm text-[#152C2B] placeholder:text-[#526564]/50 focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#152C2B] mb-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#526564]" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-9 pr-3 text-sm text-[#152C2B] placeholder:text-[#526564]/50 focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#18756B] py-3 text-sm font-bold text-white shadow-xs hover:bg-[#135d55] disabled:opacity-60 transition cursor-pointer"
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

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#DCE5DF]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[#526564] font-medium">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        disabled={loading || googleLoading}
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#DCE5DF] bg-white py-2.5 text-xs font-bold text-[#152C2B] shadow-2xs hover:bg-[#F6F5EF] hover:border-[#18756B]/40 disabled:opacity-60 transition cursor-pointer"
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-[#18756B]" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Sign in with Google</span>
      </button>

      <div className="text-center text-xs text-[#526564] pt-2 border-t border-[#DCE5DF]">
        Don&apos;t have an account?{" "}
        <Link
          href={callbackUrl ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-up"}
          className="font-bold text-[#18756B] hover:text-[#135d55]"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
