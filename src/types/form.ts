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
