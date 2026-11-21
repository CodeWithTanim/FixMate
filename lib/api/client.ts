import { authClient } from "@/lib/auth-client";

export type TokenResult = {
  token: string | null;
  operationalError?: string;
  status?: number;
};

let memoryToken: string | null = null;
let tokenExpiresAt: number = 0;
let inFlightTokenPromise: Promise<TokenResult> | null = null;
let activeSessionEpoch: number = 0;

export function clearApiToken() {
  activeSessionEpoch++;
  memoryToken = null;
  tokenExpiresAt = 0;
  inFlightTokenPromise = null;
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    // Clear token cache if auth credentials or sessions change in another tab
    if (!e.key || e.key.includes("better-auth") || e.key.includes("session") || e.key.includes("auth")) {
      clearApiToken();
    }
  });
  window.addEventListener("fixmate:sign-out", () => {
    clearApiToken();
  });
}

export async function signOutUser() {
  clearApiToken();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fixmate:sign-out"));
  }
  const res = await authClient.signOut();
  if (res?.error) {
    throw new Error(res.error.message || "Sign-out failed");
  }
}

export async function getApiToken(): Promise<TokenResult> {
  const now = Date.now();
  if (memoryToken && tokenExpiresAt > now + 30000) {
    return { token: memoryToken };
  }

  if (inFlightTokenPromise) {
    return inFlightTokenPromise;
  }

  const currentEpoch = activeSessionEpoch;

  let activePromise: Promise<TokenResult> | null = null;
  const promise = (async (): Promise<TokenResult> => {
    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      // Discard token if sign-out occurred during fetch
      if (activeSessionEpoch !== currentEpoch) {
        return { token: null };
      }

      if (!res.ok) {
        memoryToken = null;
        tokenExpiresAt = 0;
        if (res.status === 429) {
          return {
            token: null,
            operationalError: "Rate limit exceeded. Please try again shortly.",
            status: 429,
          };
        }
        if (res.status >= 500) {
          return {
            token: null,
            operationalError: `Token service unavailable (${res.status})`,
            status: res.status,
          };
        }
        return { token: null, status: res.status };
      }

      const data = await res.json();
      if (activeSessionEpoch !== currentEpoch) {
        return { token: null };
      }

      memoryToken = data.token;
      tokenExpiresAt = Date.now() + (data.expiresIn || 300) * 1000;
      return { token: memoryToken };
    } catch (err: unknown) {
      if (activeSessionEpoch === currentEpoch) {
        memoryToken = null;
        tokenExpiresAt = 0;
      }
      const error = err as { message?: string; status?: number };
      return {
        token: null,
        operationalError: error.message || "Token service unavailable",
        status: error.status || 503,
      };
    } finally {
      if (inFlightTokenPromise === activePromise) {
        inFlightTokenPromise = null;
      }
    }
  })();

  activePromise = promise;
  inFlightTokenPromise = promise;

  return promise;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const tokenResult = await getApiToken();

  // If token endpoint failed with operational error (e.g. 503), do not send downstream anonymous request
  if (tokenResult.operationalError) {
    return {
      error: tokenResult.operationalError,
      status: tokenResult.status || 503,
    };
  }

  let token = tokenResult.token;
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://fix-mate-server-teal.vercel.app";
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    let res = await fetch(url, {
      ...options,
      headers,
    });

    // Bounded retry on genuine 401 token expiry for idempotent GET requests only
    if (res.status === 401 && token && (!options.method || options.method === "GET")) {
      clearApiToken();
      const retryTokenResult = await getApiToken();
      token = retryTokenResult.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        res = await fetch(url, {
          ...options,
          headers,
        });
      }
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        error: data?.message || data?.error || `Request failed with status ${res.status}`,
        status: res.status,
      };
    }

    return { data, status: res.status };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network connection failed";
    return { error: msg, status: 503 };
  }
}

function createApiError(message: string, status: number): Error & { status: number } {
  const err = new Error(message) as Error & { status: number };
  err.status = status;
  return err;
}

export const apiClient = {
  get: async <T = unknown>(endpoint: string, options?: RequestInit): Promise<T> => {
    const res = await apiRequest<T>(endpoint, { ...options, method: "GET" });
    if (res.error) throw createApiError(res.error, res.status);
    return res.data as T;
  },
  post: async <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> => {
    const res = await apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.error) throw createApiError(res.error, res.status);
    return res.data as T;
  },
  patch: async <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> => {
    const res = await apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.error) throw createApiError(res.error, res.status);
    return res.data as T;
  },
  delete: async <T = unknown>(endpoint: string, options?: RequestInit): Promise<T> => {
    const res = await apiRequest<T>(endpoint, { ...options, method: "DELETE" });
    if (res.error) throw createApiError(res.error, res.status);
    return res.data as T;
  },
};
