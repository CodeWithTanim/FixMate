import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { mongoDb } from "@/lib/db";
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
      let role = typeof rawUser.role === "string" ? rawUser.role : "customer";
      const pathname = reqHeaders.get("x-pathname") || "";

      // Allow same account to act as both customer & technician based on destination portal
      if (rawUser.role !== "admin") {
        const rawId = String(rawUser.id || rawUser._id || "");
        const filter = ObjectId.isValid(rawId)
          ? { $or: [{ _id: new ObjectId(rawId) }, { id: rawId }] }
          : { id: rawId };

        if (pathname.startsWith("/dashboard/technician") && role !== "technician") {
          role = "technician";
          mongoDb.collection("user").updateOne(filter, { $set: { role: "technician", updatedAt: new Date() } }).catch(() => {});
        } else if (pathname.startsWith("/dashboard/customer") && role !== "customer") {
          role = "customer";
          mongoDb.collection("user").updateOne(filter, { $set: { role: "customer", updatedAt: new Date() } }).catch(() => {});
        }
      }

      safeUser = {
        id: String(rawUser.id || rawUser._id || ""),
        name: String(rawUser.name || "User"),
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
