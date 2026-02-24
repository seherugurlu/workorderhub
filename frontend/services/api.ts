import { ApiError, ApiResult, WorkOrder, Status } from "@/types/workorder";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": init?.body instanceof FormData ? "" : "application/json",
        "x-api-key": apiKey,
        ...(init?.headers || {})
      }
    });

    const contentType = res.headers.get("content-type") || "";
    const body: unknown = contentType.includes("application/json") ? await res.json() : null;

    if (!body) {
      if (res.ok) {
        return {
          ok: true,
          requestId: res.headers.get("x-request-id") || "unknown",
          data: undefined as T
        };
      }

      return {
        ok: false,
        requestId: res.headers.get("x-request-id") || "unknown",
        error: { code: "INTERNAL_ERROR", message: "Unexpected response" }
      };
    }

    const typedBody = body as {
      success: boolean;
      requestId: string;
      data?: T;
      error?: ApiError;
    };

    if (typedBody.success) {
      return { ok: true, requestId: typedBody.requestId, data: typedBody.data as T };
    }

    return {
      ok: false,
      requestId: typedBody.requestId,
      error: (typedBody.error ?? { code: "INTERNAL_ERROR", message: "Unexpected response" }) as ApiError
    };
  } catch {
    return { ok: false, requestId: "unknown", error: { code: "INTERNAL_ERROR", message: "Network error" } };
  }
}

export function listWorkOrders(
  query: Record<string, string | number | boolean | null | undefined>
) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") params.set(k, String(v));
  });
  const qs = params.toString() ? `?${params.toString()}` : "";
  return request<{ items: WorkOrder[]; page: number; limit: number; total: number }>(`/api/workorders${qs}`);
}

export function getWorkOrder(id: string) {
  return request<WorkOrder>(`/api/workorders/${id}`);
}

export function createWorkOrder(payload: Partial<WorkOrder>) {
  return request<WorkOrder>(`/api/workorders`, { method: "POST", body: JSON.stringify(payload) });
}

export function updateWorkOrder(id: string, payload: Partial<WorkOrder>) {
  return request<WorkOrder>(`/api/workorders/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export function changeStatus(id: string, status: Status) {
  return request<WorkOrder>(`/api/workorders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export function deleteWorkOrder(id: string) {
  return request<{ deleted: boolean }>(`/api/workorders/${id}`, { method: "DELETE" });
}

export async function bulkUploadCsv(file: File): Promise<ApiResult<unknown>> {
  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await fetch(`${baseUrl}/api/workorders/bulk-upload`, {
      method: "POST",
      headers: { "x-api-key": apiKey },
      body: fd
    });

    const body: unknown = await res.json();

    const typedBody = body as {
      success: boolean;
      requestId: string;
      data?: unknown;
      error?: ApiError;
    };

    if (typedBody.success) return { ok: true, requestId: typedBody.requestId, data: typedBody.data };
    return {
      ok: false,
      requestId: typedBody.requestId,
      error: (typedBody.error ?? { code: "INTERNAL_ERROR", message: "Unexpected response" }) as ApiError
    };
  } catch {
    return { ok: false, requestId: "unknown", error: { code: "INTERNAL_ERROR", message: "Network error" } };
  }
}