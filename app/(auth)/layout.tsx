import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (session?.user) {
    const role = (session.user as { role?: string }).role || "customer";
    const targetDashboard =
      role === "admin"
        ? "/dashboard/admin"
        : role === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";
    redirect(targetDashboard);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5EF] antialiased">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <div className="rounded-2xl border border-[#DCE5DF] bg-white p-8 shadow-sm">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
