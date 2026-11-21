import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import AdminSignInForm from "@/components/AdminSignInForm";

export const metadata: Metadata = { title: "Admin Sign In" };

export default async function AdminLoginPage() {
  const session = await (await getAuth()).api.getSession({ headers: await headers() });
  if ((session?.user as { role?: string } | undefined)?.role === "admin") {
    redirect("/dashboard/admin");
  }
  return <AdminSignInForm />;
}
