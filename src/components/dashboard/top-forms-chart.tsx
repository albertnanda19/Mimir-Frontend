"use client";

import type { EChartsOption } from "echarts";
import { EChart } from "@/components/dashboard/echart";
import { useIsDarkTheme } from "@/hooks/use-is-dark-theme";
import { getChartTheme } from "@/lib/chart-theme";
import { TOP_FORMS } from "@/lib/dashboard-data";

export function TopFormsChart() {
  const isDark = useIsDarkTheme();
  const theme = getChartTheme(isDark);
  const ordered = [...TOP_FORMS].reverse();

  const option: EChartsOption = {
    grid: { top: 8, right: 24, bottom: 8, left: 8, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow", shadowStyle: { color: theme.splitLine } },
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: theme.tooltipText, fontFamily: "var(--font-body)", fontSize: 12 },
      valueFormatter: (value) => `${value} respons`,
    },
    xAxis: {
      type: "value",
      splitLine: { lineStyle: { color: theme.splitLine } },
      axisLabel: { color: theme.label, fontFamily: "var(--font-body)", fontSize: 11 },
    },
    yAxis: {
      type: "category",
      data: ordered.map((form) => form.title),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: theme.label,
        fontFamily: "var(--font-body)",
        fontSize: 12,
        width: 150,
        overflow: "truncate",
      },
    },
    series: [
      {
        type: "bar",
        data: ordered.map((form) => form.responses),
        barWidth: 14,
        itemStyle: { color: theme.brand, borderRadius: [0, 4, 4, 0] },
        label: {
          show: true,
          position: "right",
          color: theme.label,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5 shadow-[var(--elevation-1)]">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-[15px] font-medium text-ink">Form paling ramai</h3>
        <p className="text-[13px] text-muted">Peringkat berdasarkan jumlah respons</p>
      </div>
      <EChart option={option} style={{ height: 240 }} />
    </div>
  );
}
