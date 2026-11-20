"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { User, Mail, Lock, Loader2, ShieldCheck, Wrench } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }

    // Password validation: at least 6 chars, with uppercase and lowercase
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    if (!hasUpper || !hasLower) {
      setErrorMsg("Password must contain at least one uppercase and one lowercase letter.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your FixMate account...");

    try {
      const res = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      } as unknown as { name: string; email: string; password: string });

      if (res.error) {
        toast.error(res.error.message || "Failed to create account.", { id: toastId });
        setErrorMsg(res.error.message || "Registration failed.");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully!", { id: toastId });
      router.push(`/dashboard/${role}`);
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
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Create an Account</h2>
        <p className="text-xs text-slate-500">Join FixMate as a customer or service technician</p>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            I want to join as
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-xs font-semibold transition cursor-pointer ${
                role === "customer"
                  ? "border-sky-600 bg-sky-50 text-sky-700 shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("technician")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-xs font-semibold transition cursor-pointer ${
                role === "technician"
                  ? "border-sky-600 bg-sky-50 text-sky-700 shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Wrench className="h-4 w-4 text-sky-600" />
              <span>Technician</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

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
              placeholder="At least 6 chars (A-Z & a-z)"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Must include at least 6 characters with uppercase and lowercase letters.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-sky-600 hover:text-sky-700">
          Sign in
        </Link>
      </div>
    </div>
  );
}
