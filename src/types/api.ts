export interface ApiEnvelope<T> {
  data: T | null;
  message: string | null;
  error: { code: string; details: unknown } | null;
}

export interface PaginatedEnvelope<T> extends ApiEnvelope<T> {
  pagination: { total: number; page: number; page_size: number };
}
