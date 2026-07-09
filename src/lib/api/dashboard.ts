import { apiDelete, apiGet, apiGetPaginated, apiPost, apiErrorMessage } from "@/lib/api-client";
import type {
  DashboardSummary,
  FormsPage,
  ResponseSeries,
  Result,
  StatusCounts,
} from "@/types/dashboard";
import type { FormStatus, FormSummary } from "@/types/form";

interface SummaryDto {
  stats: {
    total_forms: number;
    total_responses: number;
    published_forms: number;
    avg_completion: number;
    responses_last7: number;
    responses_delta_pct: number | null;
  };
  status_breakdown: { status: FormStatus; label: string; count: number }[];
  top_forms: { id: string; title: string; responses: number }[] | null;
}

interface SeriesDto {
  form_id: string;
  days: number;
  total: number;
  points: { label: string; count: number }[];
}

interface FormListDto {
  forms:
    | {
        id: string;
        title: string;
        status: FormStatus;
        responses: number;
        completion_rate: number;
        avg_duration_sec: number;
        created_at: string;
        last_response_at: string | null;
      }[]
    | null;
  status_counts: StatusCounts;
}

export interface FormsRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: FormStatus | "all";
}

export async function fetchSummary(token: string): Promise<DashboardSummary> {
  const { data } = await apiGet<SummaryDto>("/dashboard/summary", token);
  const dto = data!;
  return {
    stats: {
      totalForms: dto.stats.total_forms,
      totalResponses: dto.stats.total_responses,
      publishedForms: dto.stats.published_forms,
      avgCompletion: dto.stats.avg_completion,
      responsesLast7: dto.stats.responses_last7,
      responsesDeltaPct: dto.stats.responses_delta_pct,
    },
    statusBreakdown: dto.status_breakdown,
    topForms: dto.top_forms ?? [],
  };
}

export async function fetchSeries(token: string, formId: string, days: 7 | 30): Promise<ResponseSeries> {
  const { data } = await apiGet<SeriesDto>(
    `/dashboard/response-series?form_id=${encodeURIComponent(formId)}&days=${days}`,
    token,
  );
  const dto = data!;
  return { formId: dto.form_id, days: dto.days, total: dto.total, points: dto.points };
}

export async function fetchForms(token: string, q: FormsRequest): Promise<FormsPage> {
  const params = new URLSearchParams();
  if (q.page) params.set("page", String(q.page));
  if (q.pageSize) params.set("page_size", String(q.pageSize));
  if (q.search?.trim()) params.set("search", q.search.trim());
  if (q.status && q.status !== "all") params.set("status", q.status);
  const query = params.toString();

  const { data, pagination } = await apiGetPaginated<FormListDto>(`/forms${query ? `?${query}` : ""}`, token);
  const dto = data!;
  const forms: FormSummary[] = (dto.forms ?? []).map((f) => ({
    id: f.id,
    title: f.title,
    status: f.status,
    responses: f.responses,
    completionRate: f.completion_rate,
    avgDurationSec: f.avg_duration_sec,
    createdAt: f.created_at,
    lastResponseAt: f.last_response_at,
  }));
  return {
    forms,
    statusCounts: dto.status_counts,
    total: pagination.total,
    page: pagination.page,
    pageSize: pagination.page_size,
  };
}

export async function duplicateForm(token: string, id: string): Promise<void> {
  await apiPost(`/forms/${id}/duplicate`, token);
}

export async function deleteForm(token: string, id: string): Promise<void> {
  await apiDelete(`/forms/${id}`, token);
}

export async function toResult<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await promise };
  } catch (err) {
    return { ok: false, message: apiErrorMessage(err) };
  }
}
