import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
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
    const session = await (await getAuth()).api.getSession({
      headers: reqHeaders,
    });

    if (session?.user) {
      const rawUser = session.user as Record<string, unknown>;
      safeUser = {
        id: String(rawUser.id || rawUser._id || ""),
        name: String(rawUser.name || "User"),
        email: String(rawUser.email || ""),
        role: typeof rawUser.role === "string" ? rawUser.role : "customer",
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
