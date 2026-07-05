"use client";

import { useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartLine } from "@mynaui/icons-react";
import { EChart } from "@/components/dashboard/echart";
import { ChartCard } from "@/components/dashboard/chart-card";
import { SelectField } from "@/components/ui/select-field";
import { useIsDarkTheme } from "@/hooks/use-is-dark-theme";
import { getChartTheme } from "@/lib/chart-theme";
import { RESPONSES_SERIES, RESPONSES_BY_FORM, FORM_FILTER_OPTIONS } from "@/lib/dashboard-data";

const RANGES = [
  { label: "7 hari", days: 7 },
  { label: "30 hari", days: 30 },
];

export function ResponsesAreaChart() {
  const [days, setDays] = useState(30);
  const [formId, setFormId] = useState("all");
  const isDark = useIsDarkTheme();
  const theme = getChartTheme(isDark);

  const series = formId === "all" ? RESPONSES_SERIES : RESPONSES_BY_FORM[formId];
  const data = series.slice(-days);
  const total = data.reduce((sum, point) => sum + point.count, 0);

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
    <ChartCard
      icon={<ChartLine />}
      title="Respons masuk"
      subtitle={`${total.toLocaleString("id-ID")} respons dalam ${days} hari terakhir`}
      action={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <SelectField
            options={FORM_FILTER_OPTIONS.map((option) => ({ value: option.id, label: option.title }))}
            value={formId}
            onChange={setFormId}
            ariaLabel="Filter form"
            searchPlaceholder="Cari form…"
            align="right"
            size="sm"
            className="w-44"
          />
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
      }
    >
      <EChart option={option} style={{ height: 260 }} />
    </ChartCard>
  );
}
