import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await (await getAuth()).api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/admin");
  const role = (session.user as { role?: string }).role || "customer";
  if (role !== "admin") redirect(role === "technician" ? "/dashboard/technician" : "/dashboard/customer");

  return <>{children}</>;
}
