export interface ChartTheme {
  brand: string;
  brandFadeTop: string;
  brandFadeBottom: string;
  axisLine: string;
  splitLine: string;
  label: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  statusColors: Record<"draft" | "published" | "closed" | "archived", string>;
}

export function getChartTheme(isDark: boolean): ChartTheme {
  if (isDark) {
    return {
      brand: "#4A87E0",
      brandFadeTop: "rgba(74, 135, 224, 0.35)",
      brandFadeBottom: "rgba(74, 135, 224, 0.02)",
      axisLine: "#2E3448",
      splitLine: "#1E2230",
      label: "#6B7494",
      tooltipBg: "#1E2230",
      tooltipBorder: "#2E3448",
      tooltipText: "#E4E8F0",
      statusColors: { published: "#4A87E0", draft: "#E0A030", closed: "#6B7494", archived: "#454D66" },
    };
  }
  return {
    brand: "#2B6ACC",
    brandFadeTop: "rgba(43, 106, 204, 0.22)",
    brandFadeBottom: "rgba(43, 106, 204, 0.01)",
    axisLine: "#C8D0DC",
    splitLine: "#E4E8F0",
    label: "#6B7494",
    tooltipBg: "#FFFFFF",
    tooltipBorder: "#C8D0DC",
    tooltipText: "#0D0F14",
    statusColors: { published: "#2B6ACC", draft: "#CC8010", closed: "#A0AABB", archived: "#C8D0DC" },
  };
}
