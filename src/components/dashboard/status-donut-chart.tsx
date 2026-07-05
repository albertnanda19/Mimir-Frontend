"use client";

import type { EChartsOption } from "echarts";
import { EChart } from "@/components/dashboard/echart";
import { useIsDarkTheme } from "@/hooks/use-is-dark-theme";
import { getChartTheme } from "@/lib/chart-theme";
import { STATUS_BREAKDOWN, DASHBOARD_STATS } from "@/lib/dashboard-data";

export function StatusDonutChart() {
  const isDark = useIsDarkTheme();
  const theme = getChartTheme(isDark);

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
        data: STATUS_BREAKDOWN.map((slice) => ({
          value: slice.count,
          name: slice.label,
          itemStyle: { color: theme.statusColors[slice.status] },
        })),
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5 shadow-[var(--elevation-1)]">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-[15px] font-medium text-ink">Status form</h3>
        <p className="text-[13px] text-muted">Distribusi seluruh form</p>
      </div>
      <div className="relative">
        <EChart option={option} style={{ height: 200 }} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold text-ink">{DASHBOARD_STATS.totalForms}</span>
          <span className="text-xs text-muted">total form</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {STATUS_BREAKDOWN.map((slice) => (
          <div key={slice.status} className="flex items-center gap-2 text-[13px]">
            <span className="size-2.5 rounded-full" style={{ background: theme.statusColors[slice.status] }} />
            <span className="text-muted">{slice.label}</span>
            <span className="ml-auto font-mono text-ink">{slice.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
