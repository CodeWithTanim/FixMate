"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wrench, Menu, X, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearApiToken } from "@/lib/api/client";
import type { UserProfile } from "@/types";

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

    window.addEventListener("fixmate:profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("fixmate:profile-updated", handleProfileUpdate);
    };
  }, []);

  const user = session?.user as unknown as UserProfile | undefined;
  const displayName = profileOverride?.name || user?.name;
  const role = user?.role || "customer";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
    { name: "How It Works", href: "/about" },
  ];

  const handleSignOut = async () => {
    clearApiToken();
    await authClient.signOut();
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#DCE5DF] bg-[#F6F5EF]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B3638] text-[#F4B740] shadow-xs group-hover:scale-105 transition-transform">
            <Wrench className="h-5 w-5" />
          </div>
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
        <div className="hidden md:flex items-center gap-4">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-[#DCE5DF]" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-[#DCE5DF] bg-white px-3 py-1.5 shadow-2xs hover:bg-[#F6F5EF] transition cursor-pointer"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#18756B] text-white text-xs font-bold uppercase">
                  {displayName?.[0] || "U"}
                </div>
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

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-[#152C2B] hover:bg-[#DCE5DF]/40"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
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
              <div className="space-y-2">
                <Link
                  href={`/dashboard/${role}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-[#0B3638] px-3 py-2.5 text-sm font-bold text-white text-center"
                >
                  Go to {role.toUpperCase()} Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-center rounded-lg py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
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
