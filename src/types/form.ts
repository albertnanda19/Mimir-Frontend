export type FormStatus = "draft" | "published" | "closed";

export interface FormSummary {
  id: string;
  title: string;
  status: FormStatus;
  responses: number;
  completionRate: number;
  avgDurationSec: number;
  createdAt: string;
  lastResponseAt: string | null;
}

/** Response envelope for paginated form list endpoints. */
export interface PaginatedForms {
  items: FormSummary[];
  total: number;
  page: number;
  pageSize: number;
}

/** Query params for fetching form lists. */
export interface FormsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: FormStatus | "all";
}
