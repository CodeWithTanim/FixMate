"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, User as UserIcon, Wrench, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import UserAvatar from "./UserAvatar";
import ThemeToggle from "./ThemeToggle";

interface DashboardHeaderProps {
  user: {
    id?: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [profileOverride, setProfileOverride] = useState<{
    name?: string;
    image?: string | null;
  } | null>(null);

  useEffect(() => {
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ name?: string; image?: string | null }>;
      if (customEvent.detail) {
        setProfileOverride({
          name: customEvent.detail.name,
          image: customEvent.detail.image,
        });
      }
    };

    const handleSignOutEvent = () => {
      setProfileOverride(null);
    };

    window.addEventListener("fixmate:profile-updated", handleProfileUpdate);
    window.addEventListener("fixmate:sign-out", handleSignOutEvent);
    return () => {
      window.removeEventListener("fixmate:profile-updated", handleProfileUpdate);
      window.removeEventListener("fixmate:sign-out", handleSignOutEvent);
    };
  }, []);

  const handleSwitchRole = async (targetRole: "customer" | "technician") => {
    const toastId = toast.loading(`Switching to ${targetRole === "technician" ? "Technician" : "Customer"} Portal...`);
    try {
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to switch role");
      }
      toast.success(`Active role switched to ${targetRole}!`, { id: toastId });
      window.location.href = data.redirectUrl || `/dashboard/${targetRole}`;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Role switch failed";
      toast.error(msg, { id: toastId });
    }
  };

  const displayName = profileOverride?.name || user.name;
  const displayImage = profileOverride?.image !== undefined ? profileOverride.image : user.image;

  return (
    <header className="sticky top-0 z-20 hidden lg:flex h-16 items-center justify-between border-b border-[#DCE5DF] bg-white/95 px-8 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-[#526564]">Signed in as</span>
        <div className="flex items-center gap-2">
          <UserAvatar src={displayImage} name={displayName} size="sm" />
          <span className="text-xs font-bold text-[#152C2B] bg-[#F6F5EF] px-2.5 py-1 rounded-md border border-[#DCE5DF]">
            {displayName} ({user.role})
          </span>
          {user.role !== "admin" && (
            <button
              type="button"
              onClick={() => handleSwitchRole(user.role === "technician" ? "customer" : "technician")}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer border shadow-2xs ${
                user.role === "technician"
                  ? "bg-emerald-50 text-[#0B3638] border-emerald-300 hover:bg-emerald-100"
                  : "bg-[#18756B]/10 text-[#18756B] border-[#18756B]/30 hover:bg-[#18756B]/20"
              }`}
            >
              {user.role === "technician" ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-[#0B3638]" />
                  <span>Switch to Customer</span>
                </>
              ) : (
                <>
                  <Wrench className="h-3.5 w-3.5 text-[#18756B]" />
                  <span>Switch to Technician</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#526564] hover:text-[#18756B] transition"
        >
          <UserIcon className="h-3.5 w-3.5" />
          <span>My Profile</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#526564] hover:text-[#18756B] transition"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Public Site</span>
        </Link>
      </div>
    </header>
  );
}
