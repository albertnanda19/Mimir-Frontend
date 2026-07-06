"use client";

import dynamic from "next/dynamic";
import { AppNavbar } from "@/components/layout/app-navbar";
import { StatCards } from "@/components/dashboard/stat-cards";
import { FormsPanel } from "@/components/dashboard/forms-panel";
import { CreateFormMenu } from "@/components/dashboard/create-form-menu";
import type { AppUser } from "@/types/auth";

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

export function DashboardView({ user }: { user: AppUser }) {
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

            <StatCards />

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ResponsesAreaChart />
              </div>
              <StatusDonutChart />
              <div className="lg:col-span-3">
                <TopFormsChart />
              </div>
            </div>

          <div className="flex flex-col gap-5">
            <h2 className="font-display text-xl font-semibold tracking-[-0.01em] text-ink">Form saya</h2>
            <FormsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
