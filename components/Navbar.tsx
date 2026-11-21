"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, ChevronDown, User as UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { signOutUser } from "@/lib/api/client";
import toast from "react-hot-toast";
import type { UserProfile } from "@/types";
import UserAvatar from "./UserAvatar";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOverride, setProfileOverride] = useState<{ name?: string; image?: string | null } | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

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

  const user = session?.user as unknown as UserProfile | undefined;
  const displayName = profileOverride?.name || user?.name;
  const displayImage = profileOverride?.image !== undefined ? profileOverride.image : user?.image;
  const role = user?.role || "customer";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
  ];

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setDropdownOpen(false);
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to complete sign out");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#DCE5DF] bg-[#F6F5EF]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="FixMate Logo"
            width={38}
            height={38}
            className="rounded-xl shadow-xs group-hover:scale-105 transition-transform object-contain"
            priority
          />
          <span className="text-xl font-bold tracking-tight text-[#152C2B]">
            Fix<span className="text-[#18756B]">Mate</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold transition ${
                pathname === link.href ? "text-[#18756B]" : "text-[#526564] hover:text-[#152C2B]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Actions / Avatar Dropdown */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-[#DCE5DF]" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-[#DCE5DF] bg-white px-3 py-1.5 shadow-2xs hover:bg-[#F6F5EF] transition cursor-pointer"
              >
                <UserAvatar src={displayImage} name={displayName} size="sm" />
                <div className="text-left text-xs">
                  <div className="font-bold text-[#152C2B] leading-none">{displayName?.split(" ")[0]}</div>
                  <div className="text-[10px] text-[#526564] capitalize leading-tight mt-0.5">{role}</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#526564]" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#DCE5DF] bg-white py-1.5 shadow-lg z-50">
                  <div className="px-3 py-2 border-b border-[#DCE5DF]/60">
                    <p className="text-xs font-bold text-[#152C2B] truncate">{displayName || user?.name}</p>
                    <p className="text-[10px] text-[#526564] truncate">{user?.email}</p>
                  </div>
                  <Link
                    href={`/dashboard/${role}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#152C2B] hover:bg-[#F6F5EF]"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[#18756B]" />
                    <span>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#152C2B] hover:bg-[#F6F5EF]"
                  >
                    <span>My Profile</span>
                  </Link>
                  <div className="border-t border-[#DCE5DF]/60 pt-1 mt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-[#152C2B] hover:text-[#18756B] transition px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-xl bg-[#18756B] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#135d55] transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#152C2B] hover:bg-[#DCE5DF]/40 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#DCE5DF] bg-[#F6F5EF] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-[#152C2B] hover:bg-[#DCE5DF]/50"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#DCE5DF]">
            {session ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-[#DCE5DF]">
                  <UserAvatar src={displayImage} name={displayName} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#152C2B] truncate">{displayName || user?.name}</p>
                    <p className="text-[10px] text-[#526564] truncate">{user?.email}</p>
                    <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[#18756B] bg-[#18756B]/10 px-2 py-0.5 rounded-full">
                      {role}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Link
                    href={`/dashboard/${role}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl bg-[#0B3638] px-3 py-2.5 text-xs font-bold text-white text-center hover:bg-[#152C2B] transition"
                  >
                    Go to {role.toUpperCase()} Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#DCE5DF] bg-white px-3 py-2 text-xs font-bold text-[#152C2B] hover:bg-[#F6F5EF] transition"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-[#18756B]" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition border border-rose-100"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center rounded-xl border border-[#DCE5DF] bg-white py-2 text-sm font-semibold text-[#152C2B]"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center rounded-xl bg-[#18756B] py-2 text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
