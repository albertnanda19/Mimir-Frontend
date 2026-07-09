"use client";

import type { EChartsOption } from "echarts";
import { ChartBar, ChartBarIncreasing } from "@mynaui/icons-react";
import { EChart } from "@/components/dashboard/echart";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartEmptyState } from "@/components/dashboard/chart-empty-state";
import { ChartErrorState } from "@/components/dashboard/chart-error-state";
import { useIsDarkTheme } from "@/hooks/use-is-dark-theme";
import { getChartTheme } from "@/lib/chart-theme";
import type { DashboardSummary, Result } from "@/types/dashboard";

interface TopFormsChartProps {
  result: Result<DashboardSummary>;
  onRetry: () => void;
}

export function TopFormsChart({ result, onRetry }: TopFormsChartProps) {
  const isDark = useIsDarkTheme();
  const theme = getChartTheme(isDark);

  if (!result.ok) {
    return (
      <ChartCard icon={<ChartBar />} title="Form paling ramai" subtitle="Peringkat berdasarkan jumlah respons">
        <ChartErrorState message={result.message} onRetry={onRetry} className="h-[240px]" />
      </ChartCard>
    );
  }

  if (result.data.topForms.length === 0) {
    return (
      <ChartCard icon={<ChartBar />} title="Form paling ramai" subtitle="Peringkat berdasarkan jumlah respons">
        <ChartEmptyState
          icon={<ChartBarIncreasing className="size-6" />}
          title="Belum ada yang naik takhta"
          description="Form dengan respons terbanyak akan bersanding di sini. Terbitkan formmu dan kumpulkan respons pertama."
          className="h-[240px]"
        />
      </ChartCard>
    );
  }

  const ordered = [...result.data.topForms].reverse();

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
