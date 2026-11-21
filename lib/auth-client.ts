import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Auth cookies and API requests must belong to the page the user is visiting.
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
});

export const { signIn, signUp, signOut, useSession } = authClient;
