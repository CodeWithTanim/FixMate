import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardLayoutClient, { SafeDashboardUser } from "@/components/DashboardLayoutClient";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let safeUser: SafeDashboardUser | null = null;

  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (session?.user) {
      const rawUser = session.user as Record<string, unknown>;
      const role = typeof rawUser.role === "string" ? rawUser.role : "customer";
      safeUser = {
        id: String(rawUser.id || rawUser._id || ""),
        name: String(rawUser.name || "Customer"),
        email: String(rawUser.email || ""),
        role,
        image: typeof rawUser.image === "string" ? rawUser.image : null,
      };
    }
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err) {
      const digest = String((err as { digest?: string }).digest);
      if (digest.startsWith("NEXT_REDIRECT") || digest === "DYNAMIC_SERVER_USAGE") {
        throw err;
      }
    }
    console.error("DashboardLayout session retrieval non-fatal error:", err);
  }

  return (
    <DashboardLayoutClient initialUser={safeUser}>
      {children}
    </DashboardLayoutClient>
  );
}
