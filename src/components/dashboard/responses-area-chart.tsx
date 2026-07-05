"use client";

import { useState } from "react";
import type { EChartsOption } from "echarts";
import { EChart } from "@/components/dashboard/echart";
import { useIsDarkTheme } from "@/hooks/use-is-dark-theme";
import { getChartTheme } from "@/lib/chart-theme";
import { RESPONSES_SERIES } from "@/lib/dashboard-data";

const RANGES = [
  { label: "7 hari", days: 7 },
  { label: "30 hari", days: 30 },
];

export function ResponsesAreaChart() {
  const [days, setDays] = useState(30);
  const isDark = useIsDarkTheme();
  const theme = getChartTheme(isDark);
  const data = RESPONSES_SERIES.slice(-days);

  const option: EChartsOption = {
    grid: { top: 16, right: 16, bottom: 28, left: 36 },
    tooltip: {
      trigger: "axis",
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: theme.tooltipText, fontFamily: "var(--font-body)", fontSize: 12 },
      axisPointer: { type: "line", lineStyle: { color: theme.axisLine, type: "dashed" } },
      valueFormatter: (value) => `${value} respons`,
    },
    xAxis: {
      type: "category",
      data: data.map((point) => point.label),
      boundaryGap: false,
      axisLine: { lineStyle: { color: theme.axisLine } },
      axisTick: { show: false },
      axisLabel: { color: theme.label, fontFamily: "var(--font-body)", fontSize: 11, interval: days > 7 ? 4 : 0 },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: theme.splitLine } },
      axisLabel: { color: theme.label, fontFamily: "var(--font-body)", fontSize: 11 },
    },
    series: [
      {
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        showSymbol: false,
        data: data.map((point) => point.count),
        lineStyle: { width: 2.5, color: theme.brand },
        itemStyle: { color: theme.brand, borderColor: theme.tooltipBg, borderWidth: 2 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: theme.brandFadeTop },
              { offset: 1, color: theme.brandFadeBottom },
            ],
          },
        },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5 shadow-[var(--elevation-1)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[15px] font-medium text-ink">Respons masuk</h3>
          <p className="text-[13px] text-muted">Tren pengumpulan data seluruh form</p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-line bg-subtle p-1">
          {RANGES.map((range) => (
            <button
              key={range.days}
              type="button"
              onClick={() => setDays(range.days)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${
                days === range.days ? "bg-surface text-ink shadow-[var(--elevation-1)]" : "text-muted hover:text-ink"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <EChart option={option} style={{ height: 260 }} />
    </div>
  );
}
