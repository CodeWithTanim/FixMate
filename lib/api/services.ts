import type { ServiceItem } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ServicesResponse {
  data: ServiceItem[];
  total: number;
  limit: number;
  skip: number;
  error?: string;
}

export async function getPublicServices(params?: {
  limit?: number;
  skip?: number;
}): Promise<ServicesResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.skip) query.set("skip", params.skip.toString());

  try {
    const res = await fetch(`${API_BASE_URL}/api/services?${query.toString()}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      console.warn(`Services API returned status ${res.status}`);
      return { data: [], total: 0, limit: params?.limit || 20, skip: params?.skip || 0, error: "Failed to fetch services" };
    }

    const json = await res.json();
    return {
      data: json.data || [],
      total: json.total || 0,
      limit: json.limit || 20,
      skip: json.skip || 0,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    console.warn(`Could not connect to Services API: ${message}`);
    return { data: [], total: 0, limit: params?.limit || 20, skip: params?.skip || 0, error: message };
  }
}
