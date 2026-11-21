"use client";

import { LogOut } from "lucide-react";
import { signOutUser } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DashboardSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to complete sign out");
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition cursor-pointer"
      title="Sign Out"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Sign Out</span>
    </button>
  );
}
