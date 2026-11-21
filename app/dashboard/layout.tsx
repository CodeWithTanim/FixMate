import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  const pathname = reqHeaders.get("x-pathname") || "/dashboard";
  const search = reqHeaders.get("x-search") || "";
  const fullTarget = pathname + search;

  if (!session || !session.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(fullTarget)}`);
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
        <DashboardHeader user={{ ...user, role }} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
