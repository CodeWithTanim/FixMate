import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/sign-in?callbackUrl=/dashboard/admin");
  }

  const role = (session.user as { role?: string }).role || "customer";
  if (role !== "admin") {
    redirect(role === "technician" ? "/dashboard/technician" : "/dashboard/customer");
  }

  return <>{children}</>;
}
