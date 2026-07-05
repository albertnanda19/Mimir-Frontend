"use client";

import type { EChartsOption } from "echarts";
import { ChartBar } from "@mynaui/icons-react";
import { EChart } from "@/components/dashboard/echart";
import { ChartCard } from "@/components/dashboard/chart-card";
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
    <ChartCard icon={<ChartBar />} title="Form paling ramai" subtitle="Peringkat berdasarkan jumlah respons">
      <EChart option={option} style={{ height: 240 }} />
    </ChartCard>
  );
}
