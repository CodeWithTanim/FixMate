import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { UserRole, UserProfile } from "@/types";

export async function requireAuth(): Promise<UserProfile> {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  return session.user as unknown as UserProfile;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<UserProfile> {
  const user = await requireAuth();
  const userRole = (user.role || "customer") as UserRole;

  if (!allowedRoles.includes(userRole)) {
    redirect(`/dashboard/${userRole}`);
  }

  return user;
}
