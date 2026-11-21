import { authClient } from "@/lib/auth-client";

let memoryToken: string | null = null;
let tokenExpiresAt: number = 0;
let inFlightTokenPromise: Promise<string | null> | null = null;
let activeSessionEpoch: number = 0;

export function clearApiToken() {
  activeSessionEpoch++;
  memoryToken = null;
  tokenExpiresAt = 0;
  inFlightTokenPromise = null;
}

export async function signOutUser() {
  clearApiToken();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fixmate:sign-out"));
  }
  try {
    await authClient.signOut();
  } catch (err) {
    console.warn("Sign-out network notice:", err);
  }
}

export async function getApiToken(): Promise<string | null> {
  const now = Date.now();
  if (memoryToken && tokenExpiresAt > now + 30000) {
    return memoryToken;
  }

  if (inFlightTokenPromise) {
    return inFlightTokenPromise;
  }

  const currentEpoch = activeSessionEpoch;

  inFlightTokenPromise = (async () => {
    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      // Discard token if sign-out occurred during fetch
      if (activeSessionEpoch !== currentEpoch) {
        return null;
      }

      if (!res.ok) {
        memoryToken = null;
        tokenExpiresAt = 0;
        return null;
      }

      const data = await res.json();
      if (activeSessionEpoch !== currentEpoch) {
        return null;
      }

      memoryToken = data.token;
      tokenExpiresAt = Date.now() + (data.expiresIn || 300) * 1000;
      return memoryToken;
    } catch {
      if (activeSessionEpoch === currentEpoch) {
        memoryToken = null;
        tokenExpiresAt = 0;
      }
      return null;
    } finally {
      inFlightTokenPromise = null;
    }
  })();

  return inFlightTokenPromise;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  let token = await getApiToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    let res = await fetch(url, {
      ...options,
      headers,
    });

    // Bounded retry on genuine 401 token expiry for idempotent GET requests only
    if (res.status === 401 && token && (!options.method || options.method === "GET")) {
      clearApiToken();
      token = await getApiToken();
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

export const apiClient = {
  get: async <T = unknown>(endpoint: string, options?: RequestInit): Promise<T> => {
    const res = await apiRequest<T>(endpoint, { ...options, method: "GET" });
    if (res.error) throw new Error(res.error);
    return res.data as T;
  },
  post: async <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> => {
    const res = await apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.error) throw new Error(res.error);
    return res.data as T;
  },
  patch: async <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> => {
    const res = await apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.error) throw new Error(res.error);
    return res.data as T;
  },
  delete: async <T = unknown>(endpoint: string, options?: RequestInit): Promise<T> => {
    const res = await apiRequest<T>(endpoint, { ...options, method: "DELETE" });
    if (res.error) throw new Error(res.error);
    return res.data as T;
  },
};
