"use client";

import { useEffect, useRef, useState } from "react";
import type { EChartsOption } from "echarts";
import { ChartLine } from "@mynaui/icons-react";
import { EChart } from "@/components/dashboard/echart";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartEmptyState } from "@/components/dashboard/chart-empty-state";
import { ChartErrorState } from "@/components/dashboard/chart-error-state";
import { SelectField } from "@/components/ui/select-field";
import { useIsDarkTheme } from "@/hooks/use-is-dark-theme";
import { getChartTheme } from "@/lib/chart-theme";
import { fetchSeries } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/api/token.client";
import { apiErrorMessage } from "@/lib/api-client";
import type { ResponseSeries, Result } from "@/types/dashboard";

const RANGES: { label: string; days: 7 | 30 }[] = [
  { label: "7 hari", days: 7 },
  { label: "30 hari", days: 30 },
];

type Phase = "loading" | "success" | "error";

interface ResponsesAreaChartProps {
  initial: Result<ResponseSeries>;
  formOptions: { value: string; label: string }[];
  refreshKey: number;
}

export function ResponsesAreaChart({ initial, formOptions, refreshKey }: ResponsesAreaChartProps) {
  const [days, setDays] = useState<7 | 30>(30);
  const [formId, setFormId] = useState("all");
  const [series, setSeries] = useState(initial.ok ? initial.data : null);
  const [phase, setPhase] = useState<Phase>(initial.ok ? "success" : "error");
  const [errorMessage, setErrorMessage] = useState(initial.ok ? "" : initial.message);
  const skipFirstRun = useRef(true);
  const isDark = useIsDarkTheme();
  const theme = getChartTheme(isDark);

  async function load(targetFormId: string, targetDays: 7 | 30) {
    setPhase("loading");
    try {
      const token = await getAccessToken();
      setSeries(await fetchSeries(token, targetFormId, targetDays));
      setPhase("success");
    } catch (err) {
      setErrorMessage(apiErrorMessage(err));
      setPhase("error");
    }
  }

  useEffect(() => {
    if (skipFirstRun.current) {
      skipFirstRun.current = false;
      return;
    }
    load(formId, days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, days, refreshKey]);

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
      data: series?.points.map((point) => point.label) ?? [],
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
        data: series?.points.map((point) => point.count) ?? [],
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
      subtitle={
        phase === "success" && series
          ? `${series.total.toLocaleString("id-ID")} respons dalam ${days} hari terakhir`
          : `${days} hari terakhir`
      }
      action={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <SelectField
            options={formOptions}
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
      {phase === "loading" ? (
        <div className="h-[260px] animate-pulse rounded-lg bg-overlay" />
      ) : phase === "error" ? (
        <ChartErrorState message={errorMessage} onRetry={() => load(formId, days)} className="h-[260px]" />
      ) : series && series.total === 0 ? (
        <ChartEmptyState
          icon={<ChartLine className="size-6" />}
          title="Sungai respons masih tenang"
          description="Belum ada respons pada rentang ini. Saat respons pertama tiba, arusnya akan tergambar di sini."
          className="h-[260px]"
        />
      ) : (
        <EChart option={option} style={{ height: 260 }} />
      )}
    </ChartCard>
  );
}
