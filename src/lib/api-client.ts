import type { ApiEnvelope, PaginatedEnvelope } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly code: string | null = null) {
    super(message);
  }
}

export function apiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  return "Terjadi kesalahan. Silakan coba lagi.";
}

async function request<E extends ApiEnvelope<unknown>>(path: string, token: string, init?: RequestInit): Promise<E> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...init?.headers },
    cache: "no-store",
  });
  const body = (await res.json()) as E;
  if (!res.ok || body.error) {
    throw new ApiError(body.message ?? res.statusText, res.status, body.error?.code ?? null);
  }
  return body;
}

export function apiGet<T>(path: string, token: string): Promise<ApiEnvelope<T>> {
  return request<ApiEnvelope<T>>(path, token);
}

export function apiGetPaginated<T>(path: string, token: string): Promise<PaginatedEnvelope<T>> {
  return request<PaginatedEnvelope<T>>(path, token);
}

export function apiPost<T>(path: string, token: string): Promise<ApiEnvelope<T>> {
  return request<ApiEnvelope<T>>(path, token, { method: "POST" });
}

export function apiDelete<T>(path: string, token: string): Promise<ApiEnvelope<T>> {
  return request<ApiEnvelope<T>>(path, token, { method: "DELETE" });
}
