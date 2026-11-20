let memoryToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getApiToken(): Promise<string | null> {
  const now = Date.now();
  if (memoryToken && tokenExpiresAt > now + 30000) {
    return memoryToken;
  }

  try {
    const res = await fetch("/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      memoryToken = null;
      return null;
    }

    const data = await res.json();
    memoryToken = data.token;
    tokenExpiresAt = now + (data.expiresIn || 300) * 1000;
    return memoryToken;
  } catch {
    memoryToken = null;
    return null;
  }
}

export function clearApiToken() {
  memoryToken = null;
  tokenExpiresAt = 0;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const token = await getApiToken();
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
    const res = await fetch(url, {
      ...options,
      headers,
    });

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
