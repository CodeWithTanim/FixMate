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
          <label className="block text-xs font-bold text-[#152C2B] mb-1.5">
            I want to join as
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition cursor-pointer ${
                role === "customer"
                  ? "border-[#18756B] bg-[#18756B]/10 text-[#18756B] shadow-xs"
                  : "border-[#DCE5DF] bg-white text-[#526564] hover:bg-[#F6F5EF]"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-[#18756B]" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("technician")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition cursor-pointer ${
                role === "technician"
                  ? "border-[#18756B] bg-[#18756B]/10 text-[#18756B] shadow-xs"
                  : "border-[#DCE5DF] bg-white text-[#526564] hover:bg-[#F6F5EF]"
              }`}
            >
              <Wrench className="h-4 w-4 text-[#18756B]" />
              <span>Technician</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#152C2B] mb-1" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-[#526564]" />
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-9 pr-3 text-sm text-[#152C2B] placeholder:text-[#526564]/50 focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#152C2B] mb-1" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#526564]" />
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
              placeholder="At least 6 chars (A-Z & a-z)"
              className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-9 pr-3 text-sm text-[#152C2B] placeholder:text-[#526564]/50 focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
            />
          </div>
          <p className="mt-1 text-[11px] text-[#526564]">
            Must include at least 6 characters with uppercase and lowercase letters.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#18756B] py-3 text-sm font-bold text-white shadow-xs hover:bg-[#135d55] disabled:opacity-60 transition cursor-pointer"
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

      <div className="text-center text-xs text-[#526564] pt-2 border-t border-[#DCE5DF]">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-bold text-[#18756B] hover:text-[#135d55]">
          Sign in
        </Link>
      </div>
    </div>
  );
}
