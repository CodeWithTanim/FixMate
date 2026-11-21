"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, User as UserIcon } from "lucide-react";
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
