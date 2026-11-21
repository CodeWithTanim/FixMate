import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardIndex() {
  let session = null;
  try {
    const reqHeaders = await headers();
    session = await auth.api.getSession({
      headers: reqHeaders,
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err) {
      const digest = String((err as { digest?: string }).digest);
      if (digest.startsWith("NEXT_REDIRECT") || digest === "DYNAMIC_SERVER_USAGE") {
        throw err;
      }
    }
    console.warn("DashboardIndex getSession warning:", err);
  }

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const role = (session.user as { role?: string }).role || "customer";

  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "technician") {
    redirect("/dashboard/technician");
  } else {
    redirect("/dashboard/customer");
  }
}
