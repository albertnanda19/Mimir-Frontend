import type { FormsQuery, PaginatedForms } from "@/types/form";

export type { FormsQuery, PaginatedForms } from "@/types/form";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getForms(query?: FormsQuery): Promise<PaginatedForms> {
  await delay(300);
  const { DUMMY_FORMS } = await import("@/lib/dashboard-data");

  const page = query?.page ?? 1;
  const pageSize = query?.pageSize ?? 50;
  const q = query?.search?.toLowerCase().trim() ?? "";
  const status = query?.status;

  let filtered = DUMMY_FORMS;
  if (status && status !== "all") filtered = filtered.filter((f) => f.status === status);
  if (q) filtered = filtered.filter((f) => f.title.toLowerCase().includes(q));

  // ponytail: client-side pagination until BE is wired; server pagination replaces this
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { items, total: filtered.length, page, pageSize };
}
