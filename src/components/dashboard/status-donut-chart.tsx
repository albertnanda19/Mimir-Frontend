"use client";

import type { EChartsOption } from "echarts";
import { ChartPie, CircleDashed } from "@mynaui/icons-react";
import { EChart } from "@/components/dashboard/echart";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartEmptyState } from "@/components/dashboard/chart-empty-state";
import { ChartErrorState } from "@/components/dashboard/chart-error-state";
import { useIsDarkTheme } from "@/hooks/use-is-dark-theme";
import { getChartTheme } from "@/lib/chart-theme";
import type { DashboardSummary, Result } from "@/types/dashboard";

interface StatusDonutChartProps {
  result: Result<DashboardSummary>;
  onRetry: () => void;
}

export function StatusDonutChart({ result, onRetry }: StatusDonutChartProps) {
  const isDark = useIsDarkTheme();
  const theme = getChartTheme(isDark);

  if (!result.ok) {
    return (
      <ChartCard icon={<ChartPie />} title="Status form" subtitle="Distribusi seluruh form">
        <ChartErrorState message={result.message} onRetry={onRetry} className="flex-1 py-10" />
      </ChartCard>
    );
  }

  const { statusBreakdown, stats } = result.data;

  if (stats.totalForms === 0) {
    return (
      <ChartCard icon={<ChartPie />} title="Status form" subtitle="Distribusi seluruh form">
        <ChartEmptyState
          icon={<CircleDashed className="size-6" />}
          title="Lingkaran takdir belum terisi"
          description="Buat form pertamamu dan lihat sebarannya terukir di sini."
          className="flex-1 py-10"
        />
      </ChartCard>
    );
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: theme.tooltipText, fontFamily: "var(--font-body)", fontSize: 12 },
      valueFormatter: (value) => `${value} form`,
    },
    series: [
      {
        type: "pie",
        radius: ["62%", "84%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        itemStyle: { borderRadius: 6, borderColor: theme.tooltipBg, borderWidth: 2 },
        label: { show: false },
        labelLine: { show: false },
        data: statusBreakdown.map((slice) => ({
          value: slice.count,
          name: slice.label,
          itemStyle: { color: theme.statusColors[slice.status] },
        })),
      },
    ],
  };

  return (
    <ChartCard icon={<ChartPie />} title="Status form" subtitle="Distribusi seluruh form">
      <div className="relative">
        <EChart option={option} style={{ height: 200 }} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold text-ink">{stats.totalForms}</span>
          <span className="text-xs text-muted">total form</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 rounded-lg bg-subtle p-3">
        {statusBreakdown.map((slice) => (
          <div key={slice.status} className="flex items-center gap-2 text-[13px]">
            <span className="size-2.5 rounded-full" style={{ background: theme.statusColors[slice.status] }} />
            <span className="text-muted">{slice.label}</span>
            <span className="ml-auto font-mono text-ink">{slice.count}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
