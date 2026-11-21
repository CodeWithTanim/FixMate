import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const reqHeaders = await headers();
    const session = await (await getAuth()).api.getSession({
      headers: reqHeaders,
    });

    if (session?.user) {
      const role = (session.user as { role?: string }).role || "customer";
      if (role !== "admin") {
        redirect(role === "technician" ? "/dashboard/technician" : "/dashboard/customer");
      }
    }
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err) {
      const digest = String((err as { digest?: string }).digest);
      if (digest.startsWith("NEXT_REDIRECT") || digest === "DYNAMIC_SERVER_USAGE") {
        throw err;
      }
    }
    console.warn("AdminSegmentLayout session check warning:", err);
  }

  return <>{children}</>;
}
