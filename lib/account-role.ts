import { AsyncLocalStorage } from "node:async_hooks";
import { getOAuthState } from "better-auth/api";

export type AccountRole = "customer" | "technician" | "admin";
const accountRoles = new AsyncLocalStorage<AccountRole>();

export function publicAccountRole(value: unknown): "customer" | "technician" {
  return value === "technician" ? "technician" : "customer";
}

export function withAccountRole<T>(role: AccountRole, action: () => T): T {
  return accountRoles.run(role, action);
}

export async function getAccountRole(): Promise<AccountRole> {
  // OAuth callbacks use the role bound to their verified state, never a cookie
  // that another tab could have changed during Google's redirect.
  try {
    const state = await getOAuthState();
    const role = state?.serverContext?.accountRole;
    if (role === "customer" || role === "technician" || role === "admin") return role;
  } catch {
    // Direct API calls outside an OAuth endpoint use the request scope below.
  }
  return accountRoles.getStore() || "customer";
}
