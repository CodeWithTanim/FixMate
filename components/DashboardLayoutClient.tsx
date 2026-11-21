"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Loader2 } from "lucide-react";

export interface SafeDashboardUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
}

export default function DashboardLayoutClient({
  initialUser,
  children,
}: {
  initialUser: SafeDashboardUser | null;
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const [currentUser, setCurrentUser] = useState<SafeDashboardUser | null>(initialUser);

  // Instantly eject on sign-out event
  useEffect(() => {
    const handleSignOut = () => {
      setCurrentUser(null);
      if (typeof window !== "undefined") {
        window.location.replace("/sign-in");
      }
    };

    window.addEventListener("fixmate:sign-out", handleSignOut);
    return () => {
      window.removeEventListener("fixmate:sign-out", handleSignOut);
    };
  }, []);

  useEffect(() => {
    // If client session is resolved and user is not authenticated, instantly redirect to sign-in
    if (!isPending && !session?.user) {
      setCurrentUser(null);
      if (typeof window !== "undefined") {
        window.location.replace("/sign-in");
      }
      return;
    }

    if (session?.user) {
      const u = session.user as Record<string, unknown>;
      setCurrentUser({
        id: String(u.id || u._id || ""),
        name: String(u.name || "Customer"),
        email: String(u.email || ""),
        role: String(u.role || "customer"),
        image: typeof u.image === "string" ? u.image : null,
      });
      return;
    }

    if (initialUser) {
      setCurrentUser(initialUser);
    }
  }, [initialUser, session, isPending]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F6F5EF] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl border border-[#DCE5DF] shadow-xs max-w-sm w-full text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#18756B]" />
          <div>
            <h2 className="text-sm font-bold text-[#152C2B]">Redirecting to Sign In...</h2>
            <p className="text-xs text-[#526564] mt-1">Please sign in to access FixMate dashboards.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5EF] flex flex-col lg:flex-row antialiased">
      {/* Role-tailored Sidebar (250px) */}
      <DashboardSidebar user={currentUser} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top contextual header */}
        <DashboardHeader user={currentUser} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
