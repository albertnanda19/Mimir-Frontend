"use client";

import type { CSSProperties } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";

echarts.use([LineChart, BarChart, PieChart, GridComponent, TooltipComponent, CanvasRenderer]);

export function EChart({ option, style }: { option: EChartsOption; style?: CSSProperties }) {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      notMerge
      lazyUpdate
      style={{ height: 280, width: "100%", ...style }}
    />
  );
}
