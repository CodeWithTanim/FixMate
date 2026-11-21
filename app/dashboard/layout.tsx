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
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: reqHeaders,
    });
  } catch (err) {
    console.error("DashboardLayout session retrieval error:", err);
  }

  const pathname = reqHeaders.get("x-pathname") || "/dashboard";
  const search = reqHeaders.get("x-search") || "";
  const fullTarget = pathname + search;

  if (!session || !session.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(fullTarget)}`);
  }

  const rawUser = session.user as Record<string, unknown>;
  const role = typeof rawUser.role === "string" ? rawUser.role : "customer";

  // Ensure 100% plain serializable object for Client Component boundary (DashboardSidebar & DashboardHeader)
  const safeUser = {
    id: String(rawUser.id || rawUser._id || ""),
    name: String(rawUser.name || "Customer"),
    email: String(rawUser.email || ""),
    role,
    image: typeof rawUser.image === "string" ? rawUser.image : null,
  };

  return (
    <div className="min-h-screen bg-[#F6F5EF] flex flex-col lg:flex-row antialiased">
      {/* Role-tailored Sidebar (250px) */}
      <DashboardSidebar user={safeUser} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top contextual header */}
        <DashboardHeader user={safeUser} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
