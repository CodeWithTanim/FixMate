"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { clearApiToken } from "@/lib/api/client";

export default function AdminSignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        fetchOptions: { headers: { "x-fixmate-account-role": "admin" } },
      });
      if (result.error) {
        setError(getAuthErrorMessage(result.error, "Invalid admin email or password."));
        setLoading(false);
        return;
      }
      if ((result.data?.user as { role?: string } | undefined)?.role !== "admin") {
        await authClient.signOut();
        throw new Error("Administrator access is required.");
      }
      clearApiToken();
      router.replace("/dashboard/admin");
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#18756B]/10 text-[#18756B]">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#152C2B]">Admin Sign In</h1>
          <p className="mt-2 text-sm text-[#526564]">Use your administrator credentials to manage FixMate.</p>
        </div>
      </div>

      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="admin-email" className="block text-xs font-bold text-[#152C2B]">Admin Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-[#526564]" aria-hidden="true" />
            <input id="admin-email" name="email" type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-10 pr-3 text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="admin-password" className="block text-xs font-bold text-[#152C2B]">Password</label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-[#526564]" aria-hidden="true" />
            <input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-10 pr-10 text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]" />
            <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-3 text-[#526564] hover:text-[#18756B] cursor-pointer">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18756B] px-4 py-3 text-sm font-bold text-white hover:bg-[#135d55] disabled:opacity-60 disabled:cursor-wait cursor-pointer">
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {loading ? "Signing in..." : "Sign In to Admin Dashboard"}
        </button>
      </form>
      <p className="text-center text-xs text-[#526564]">Customer or technician? <Link href="/sign-in" className="font-semibold text-[#18756B] hover:underline">Use regular sign in</Link></p>
    </div>
  );
}
