import type { FormStatus, FormSummary } from "./form";

export interface DashboardStats {
  totalForms: number;
  totalResponses: number;
  publishedForms: number;
  avgCompletion: number;
  responsesLast7: number;
  responsesDeltaPct: number | null;
}

export interface StatusSlice {
  status: FormStatus;
  label: string;
  count: number;
}

export interface TopForm {
  id: string;
  title: string;
  responses: number;
}

export interface DashboardSummary {
  stats: DashboardStats;
  statusBreakdown: StatusSlice[];
  topForms: TopForm[];
}

export interface SeriesPoint {
  label: string;
  count: number;
}

export interface ResponseSeries {
  formId: string;
  days: number;
  total: number;
  points: SeriesPoint[];
}

export type StatusCounts = Record<FormStatus | "all", number>;

export interface FormsPage {
  forms: FormSummary[];
  statusCounts: StatusCounts;
  total: number;
  page: number;
  pageSize: number;
}

export type Result<T> = { ok: true; data: T } | { ok: false; message: string };
