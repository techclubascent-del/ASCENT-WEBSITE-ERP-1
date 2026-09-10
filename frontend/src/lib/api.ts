// ─────────────────────────────────────────────────────────────────────────────
// Central API client
//
// ALL communication with the FastAPI backend must go through this module.
// Never fetch the backend URL directly from a page or component.
//
// Usage:
//   import { api } from "@/lib/api";
//   const user = await api.get<User>("/users/me");
//   const result = await api.post<Opportunity>("/opportunities", body);
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from "@/lib/supabase";
import type { ApiError } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Types ──────────────────────────────────────────────────────────────────

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string,
    public readonly code?: string,
  ) {
    super(detail);
    this.name = "ApiClientError";
  }
}

// ── Core fetch helper ──────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  // Attach the Supabase session token as a Bearer token for every request
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let errorData: ApiError = { detail: "An unexpected error occurred." };
    try {
      errorData = (await response.json()) as ApiError;
    } catch {
      // Non-JSON error body — use the default message above
    }
    throw new ApiClientError(response.status, errorData.detail, errorData.code);
  }

  // 204 No Content — return undefined cast to T
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ── Public API surface ─────────────────────────────────────────────────────

export const api = {
  /** Perform a GET request. */
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  /** Perform a POST request with a JSON body. */
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),

  /** Perform a PATCH request with a JSON body. */
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),

  /** Perform a PUT request with a JSON body. */
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),

  /** Perform a DELETE request. */
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

export { ApiClientError };
