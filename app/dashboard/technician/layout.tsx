import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function TechnicianSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/sign-in?callbackUrl=/dashboard/technician");
  }

  const role = (session.user as { role?: string }).role || "customer";
  if (role !== "technician") {
    redirect(role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
  }

  return <>{children}</>;
}
