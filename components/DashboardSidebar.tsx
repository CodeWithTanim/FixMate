"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  User,
  PlusCircle,
  Briefcase,
  Users,
  ShieldCheck,
  ListOrdered,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { signOutUser } from "@/lib/api/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DashboardSidebarProps {
  user: {
    id?: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOverride, setProfileOverride] = useState<{ name?: string; image?: string | null } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

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

  const displayName = profileOverride?.name || user.name;
  const displayImage = profileOverride?.image !== undefined ? profileOverride.image : user.image;
  const role = user.role || "customer";

  const getNavLinks = () => {
    switch (role) {
      case "technician":
        return [
          { name: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
          { name: "Repair Requests", href: "/dashboard/technician/requests", icon: Briefcase },
          { name: "My Services", href: "/dashboard/technician/my-services", icon: ListOrdered },
          { name: "Add Service", href: "/dashboard/technician/add-service", icon: PlusCircle },
          { name: "My Profile", href: "/dashboard/profile", icon: User },
        ];
      case "admin":
        return [
          { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
          { name: "Service Moderation", href: "/dashboard/admin/services", icon: ShieldCheck },
          { name: "User Management", href: "/dashboard/admin/users", icon: Users },
          { name: "All Bookings", href: "/dashboard/admin/bookings", icon: CalendarCheck },
          { name: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
          { name: "My Profile", href: "/dashboard/profile", icon: User },
        ];
      case "customer":
      default:
        return [
          { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
          { name: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarCheck },
          { name: "Payment History", href: "/dashboard/customer/payments", icon: CreditCard },
          { name: "My Profile", href: "/dashboard/profile", icon: User },
        ];
    }
  };

  const navLinks = getNavLinks();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B3638] text-white select-none">
      {/* Brand logo & role badge */}
      <div className="p-6 border-b border-white/10">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#18756B] text-white shadow-md group-hover:bg-[#135d55] transition">
            <Wrench className="h-5 w-5 text-[#F4B740]" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              Fix<span className="text-[#F4B740]">Mate</span>
            </span>
            <div className="text-[10px] font-semibold text-emerald-300 tracking-wider uppercase">
              {role} portal
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
          Navigation
        </div>
        {navLinks.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-[#18756B] text-white shadow-xs font-bold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-[#F4B740]" : "text-white/50"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
          Shortcuts
        </div>
        <Link
          href="/services"
          onClick={() => setMobileOpen(false)}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition"
        >
          <span className="flex items-center gap-3">
            <ExternalLink className="h-4 w-4 text-white/50" />
            <span>Public Catalog</span>
          </span>
        </Link>
      </nav>

      {/* User profile & sign out at bottom */}
      <div className="p-4 border-t border-white/10 bg-black/10">
        <div className="flex items-center gap-3 mb-3 px-2">
          {displayImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayImage}
              alt={displayName}
              className="h-9 w-9 rounded-full object-cover border border-[#18756B]"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#18756B] font-bold text-white text-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{displayName}</div>
            <div className="text-[10px] text-white/60 truncate">{user.email}</div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/80 hover:text-rose-200 text-xs font-semibold transition border border-white/10"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar: 250px */}
      <aside className="hidden lg:block w-[250px] shrink-0 sticky top-0 h-screen z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile drawer toggle */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-[#0B3638] px-4 py-3 text-white border-b border-white/10 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18756B]">
            <Wrench className="h-4 w-4 text-[#F4B740]" />
          </div>
          <span className="text-base font-bold text-white">
            Fix<span className="text-[#F4B740]">Mate</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          aria-label="Toggle Dashboard Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-[280px] max-w-full h-full shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
