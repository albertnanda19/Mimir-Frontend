"use client";

import { FileText, InboxCheck, CheckCircle, ChartLine, TrendingUp, TrendingDown } from "@mynaui/icons-react";
import { ChartErrorState } from "@/components/dashboard/chart-error-state";
import type { DashboardSummary, Result } from "@/types/dashboard";

interface StatCardsProps {
  result: Result<DashboardSummary>;
  onRetry: () => void;
}

export function StatCards({ result, onRetry }: StatCardsProps) {
  if (!result.ok) {
    return <ChartErrorState message={result.message} onRetry={onRetry} className="py-10" />;
  }

  const { stats } = result.data;
  const isEmpty = stats.totalForms === 0;
  const cards = [
    {
      icon: FileText,
      label: "Total form",
      value: stats.totalForms.toLocaleString("id-ID"),
      hint: isEmpty ? "buat form pertamamu" : `${stats.publishedForms} sedang terbit`,
      chip: "bg-brand-subtle text-brand-text",
    },
    {
      icon: InboxCheck,
      label: "Total respons",
      value: stats.totalResponses.toLocaleString("id-ID"),
      delta: isEmpty ? null : stats.responsesDeltaPct,
      hint: "belum ada data",
      chip: "bg-brand-subtle text-brand-text",
    },
    {
      icon: CheckCircle,
      label: "Form terbit",
      value: stats.publishedForms.toLocaleString("id-ID"),
      hint: isEmpty ? "belum ada data" : "menerima respons",
      chip: "bg-success-subtle text-success-text",
    },
    {
      icon: ChartLine,
      label: "Rata-rata selesai",
      value: `${stats.avgCompletion}%`,
      hint: isEmpty ? "belum ada data" : "tingkat penyelesaian",
      chip: "bg-accent-subtle text-accent-text",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ icon: Icon, label, value, hint, delta, chip }) => (
        <div
          key={label}
          className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5 shadow-[var(--elevation-1)] transition-shadow duration-200 hover:shadow-[var(--elevation-2)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">{label}</span>
            <span className={`flex size-9 items-center justify-center rounded-md ${chip}`}>
              <Icon className="size-[18px]" />
            </span>
          </div>
          <span className="font-display text-[2rem] font-semibold leading-none tracking-[-0.02em] text-ink">
            {value}
          </span>
          {delta !== undefined && delta !== null ? (
            <span
              className={`inline-flex w-fit items-center gap-1 text-[13px] font-medium ${
                delta < 0 ? "text-danger-text" : "text-success-text"
              }`}
            >
              {delta < 0 ? <TrendingDown className="size-3.5" /> : <TrendingUp className="size-3.5" />}
              {delta > 0 ? "+" : ""}
              {delta}% <span className="font-normal text-faint">vs 7 hari lalu</span>
            </span>
          ) : (
            <span className="text-[13px] text-faint">{hint}</span>
          )}
        </div>
      ))}
    </div>
  );
}
