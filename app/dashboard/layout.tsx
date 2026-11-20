import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Home } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  const user = session.user as {
    id?: string;
    name: string;
    email: string;
    role?: string;
    image?: string | null;
  };
  const role = user.role || "customer";

  return (
    <div className="min-h-screen bg-[#F6F5EF] flex flex-col lg:flex-row antialiased">
      {/* Role-tailored Sidebar (250px) */}
      <DashboardSidebar user={{ ...user, role }} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top contextual header */}
        <header className="sticky top-0 z-20 hidden lg:flex h-16 items-center justify-between border-b border-[#DCE5DF] bg-white/95 px-8 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#526564]">Signed in as</span>
            <span className="text-xs font-bold text-[#152C2B] bg-[#F6F5EF] px-2.5 py-1 rounded-md border border-[#DCE5DF]">
              {user.name} ({role})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#526564] hover:text-[#18756B] transition"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Public Site</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
