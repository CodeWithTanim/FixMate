import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function CustomerSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/sign-in?callbackUrl=/dashboard/customer");
  }

  const role = (session.user as { role?: string }).role || "customer";
  if (role !== "customer") {
    redirect(role === "admin" ? "/dashboard/admin" : "/dashboard/technician");
  }

  return <>{children}</>;
}
