import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardIndex() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

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
