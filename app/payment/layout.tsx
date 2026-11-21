import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  const pathname = reqHeaders.get("x-pathname") || "/payment/success";
  const search = reqHeaders.get("x-search") || "";
  const fullTarget = pathname + search;

  if (!session || !session.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(fullTarget)}`);
  }

  const role = (session.user as { role?: string }).role || "customer";
  if (role !== "customer") {
    if (role === "admin") redirect("/dashboard/admin");
    else redirect("/dashboard/technician");
  }

  return <>{children}</>;
}
