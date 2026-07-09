"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { AppNavbar } from "@/components/layout/app-navbar";
import { StatCards } from "@/components/dashboard/stat-cards";
import { FormsPanel } from "@/components/dashboard/forms-panel";
import { CreateFormMenu } from "@/components/dashboard/create-form-menu";
import { fetchSummary, toResult } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/api/token.client";
import { useResponsesRealtime } from "@/hooks/use-responses-realtime";
import type { AppUser } from "@/types/auth";
import type { DashboardSummary, FormsPage, ResponseSeries, Result } from "@/types/dashboard";

function ChartSkeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl border border-line bg-surface ${className}`} />;
}

const ResponsesAreaChart = dynamic(
  () => import("@/components/dashboard/responses-area-chart").then((mod) => mod.ResponsesAreaChart),
  { ssr: false, loading: () => <ChartSkeleton className="h-[369px]" /> },
);
const StatusDonutChart = dynamic(
  () => import("@/components/dashboard/status-donut-chart").then((mod) => mod.StatusDonutChart),
  { ssr: false, loading: () => <ChartSkeleton className="h-full min-h-[369px]" /> },
);
const TopFormsChart = dynamic(
  () => import("@/components/dashboard/top-forms-chart").then((mod) => mod.TopFormsChart),
  { ssr: false, loading: () => <ChartSkeleton className="h-[349px]" /> },
);

interface DashboardViewProps {
  user: AppUser;
  summary: Result<DashboardSummary>;
  initialSeries: Result<ResponseSeries>;
  initialForms: Result<FormsPage>;
}

export function DashboardView({ user, summary, initialSeries, initialForms }: DashboardViewProps) {
  const [summaryResult, setSummaryResult] = useState(summary);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetchAll = useCallback(async () => {
    const token = await getAccessToken();
    setSummaryResult(await toResult(fetchSummary(token)));
    setRefreshKey((key) => key + 1);
  }, []);

  useResponsesRealtime(refetchAll);

  const formOptions = [
    { value: "all", label: "Semua form" },
    ...(initialForms.ok ? initialForms.data.forms.map((form) => ({ value: form.id, label: form.title })) : []),
  ];

  return (
    <div className="min-h-dvh bg-subtle">
      <AppNavbar user={user} />

      <main className="mx-auto flex w-full max-w-[80rem] flex-col gap-8 px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-8 animate-enter">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-[1.75rem] font-semibold tracking-[-0.02em] text-ink">
                Halo, {user.name.split(" ")[0]}
              </h1>
              <p className="text-[15px] text-muted">Ringkasan performa seluruh formmu hari ini.</p>
            </div>
            <CreateFormMenu />
          </div>

          <StatCards result={summaryResult} onRetry={refetchAll} />

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ResponsesAreaChart initial={initialSeries} formOptions={formOptions} refreshKey={refreshKey} />
            </div>
            <StatusDonutChart result={summaryResult} onRetry={refetchAll} />
            <div className="lg:col-span-3">
              <TopFormsChart result={summaryResult} onRetry={refetchAll} />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="font-display text-xl font-semibold tracking-[-0.01em] text-ink">Form saya</h2>
            <FormsPanel initial={initialForms} refreshKey={refreshKey} onMutate={refetchAll} />
          </div>
        </div>
      </main>
    </div>
  );
}
