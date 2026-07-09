import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { fetchForms, fetchSeries, fetchSummary, toResult } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/api/token.server";
import { getAppUser } from "@/lib/supabase/user";

export const metadata: Metadata = { title: "Dashboard — Mimir" };

export default async function DashboardPage() {
  const user = await getAppUser();
  if (!user) redirect("/login");

  const token = await getAccessToken();
  const [summary, initialSeries, initialForms] = await Promise.all([
    toResult(fetchSummary(token)),
    toResult(fetchSeries(token, "all", 30)),
    toResult(fetchForms(token, { page: 1, pageSize: 12 })),
  ]);

  return <DashboardView user={user} summary={summary} initialSeries={initialSeries} initialForms={initialForms} />;
}
