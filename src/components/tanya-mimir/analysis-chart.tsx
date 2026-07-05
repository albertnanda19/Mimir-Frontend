"use client";

import type { EChartsOption } from "echarts";
import type { AnalysisChart } from "@/types/tanya-mimir";
import { EChart } from "@/components/dashboard/echart";
import { getChartTheme } from "@/lib/chart-theme";
import { useIsDarkTheme } from "@/hooks/use-is-dark-theme";

const CATEGORICAL_LIGHT = ["#2B6ACC", "#CC8010", "#1A8A4A", "#6D40C4", "#0C7B6B", "#B02020"];
const CATEGORICAL_DARK = ["#4A87E0", "#E0A030", "#22A85C", "#8A63D2", "#17A08C", "#D03030"];

export function AnalysisChartCard({ chart }: { chart: AnalysisChart }) {
  const isDark = useIsDarkTheme();
  const theme = getChartTheme(isDark);
  const palette = isDark ? CATEGORICAL_DARK : CATEGORICAL_LIGHT;

  const tooltip = {
    backgroundColor: theme.tooltipBg,
    borderColor: theme.tooltipBorder,
    textStyle: { color: theme.tooltipText, fontSize: 12 },
  };

  const axis = {
    axisLine: { lineStyle: { color: theme.axisLine } },
    axisLabel: { color: theme.label, fontSize: 11 },
    axisTick: { show: false },
  };

  let option: EChartsOption;
  if (chart.kind === "pie") {
    option = {
      color: palette,
      tooltip: { ...tooltip, trigger: "item" },
      series: [
        {
          type: "pie",
          radius: ["45%", "72%"],
          itemStyle: { borderRadius: 6, borderWidth: 2, borderColor: "transparent" },
          label: { color: theme.label, fontSize: 11, formatter: "{b}\n{c}" },
          data: chart.points.map((point) => ({ name: point.label, value: point.value })),
        },
      ],
    };
  } else {
    option = {
      color: [theme.brand],
      tooltip: { ...tooltip, trigger: "axis" },
      grid: { left: 8, right: 12, top: 16, bottom: 8, containLabel: true },
      xAxis: { type: "category", data: chart.points.map((point) => point.label), ...axis },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: theme.splitLine } },
        axisLabel: { color: theme.label, fontSize: 11 },
      },
      series: [
        chart.kind === "bar"
          ? {
              type: "bar",
              barMaxWidth: 42,
              itemStyle: { borderRadius: [5, 5, 0, 0] },
              data: chart.points.map((point) => point.value),
            }
          : {
              type: "line",
              smooth: true,
              symbol: "circle",
              symbolSize: 5,
              lineStyle: { width: 2.5 },
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: theme.brandFadeTop },
                    { offset: 1, color: theme.brandFadeBottom },
                  ],
                },
              },
              data: chart.points.map((point) => point.value),
            },
      ],
    };
  }

  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-surface shadow-[var(--elevation-1)] animate-enter">
      <figcaption className="border-b border-line-subtle px-4 py-2.5 text-[13px] font-medium text-ink">
        {chart.title}
      </figcaption>
      <div className="p-2">
        <EChart option={option} style={{ height: 240 }} />
      </div>
    </figure>
  );
}
