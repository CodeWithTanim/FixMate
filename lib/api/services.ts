import type { ServiceItem } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ServicesResponse {
  data: ServiceItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  error?: string;
}

export async function getPublicServices(params?: {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<ServicesResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.category && params.category !== "All") query.set("category", params.category);
  if (params?.serviceMode && params.serviceMode !== "All") query.set("serviceMode", params.serviceMode);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());

  try {
    const res = await fetch(`${API_BASE_URL}/api/services?${query.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        data: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 9,
        totalPages: 1,
        error: "Failed to load services",
      };
    }

    const json = await res.json();
    const pagination = json.pagination || {};
    return {
      data: json.data || [],
      total: pagination.total ?? json.total ?? 0,
      page: pagination.page ?? json.page ?? 1,
      limit: pagination.limit ?? json.limit ?? 9,
      totalPages: pagination.totalPages ?? json.totalPages ?? 1,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Service connection error";
    return {
      data: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 9,
      totalPages: 1,
      error: message,
    };
  }
}

export async function getServiceById(id: string): Promise<{
  service?: ServiceItem;
  error?: string;
  isNotFound?: boolean;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return { isNotFound: true, error: "Service listing not found or is currently unavailable" };
    }

    if (!res.ok) {
      return { error: `Server error loading service (${res.status})` };
    }

    const data = await res.json();
    return { service: data.service };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Service connection error";
    return { error: message };
  }
}
