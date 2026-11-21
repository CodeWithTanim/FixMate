import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { auth } from "@/lib/auth";

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
    if (role === "admin") redirect("/dashboard/admin");
    else if (role === "technician") redirect("/dashboard/technician");
    else redirect("/dashboard/customer");
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#F6F5EF] py-12 sm:px-6 lg:px-8 antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#18756B] text-white shadow-sm group-hover:bg-[#135d55] transition">
            <Wrench className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#152C2B]">
            Fix<span className="text-[#18756B]">Mate</span>
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-2xl border border-[#DCE5DF] bg-white p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
