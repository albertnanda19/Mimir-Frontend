import { FileText, InboxCheck, CheckCircle, ChartLine, TrendingUp } from "@mynaui/icons-react";
import { DASHBOARD_STATS } from "@/lib/dashboard-data";

const CARDS = [
  { icon: FileText, label: "Total form", value: DASHBOARD_STATS.totalForms.toLocaleString("id-ID"), hint: `${DASHBOARD_STATS.publishedForms} sedang terbit` },
  { icon: InboxCheck, label: "Total respons", value: DASHBOARD_STATS.totalResponses.toLocaleString("id-ID"), delta: DASHBOARD_STATS.responsesDeltaPct },
  { icon: CheckCircle, label: "Form terbit", value: DASHBOARD_STATS.publishedForms.toLocaleString("id-ID"), hint: "menerima respons" },
  { icon: ChartLine, label: "Rata-rata selesai", value: `${DASHBOARD_STATS.avgCompletion}%`, hint: "tingkat penyelesaian" },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CARDS.map(({ icon: Icon, label, value, hint, delta }) => (
        <div key={label} className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5 shadow-[var(--elevation-1)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">{label}</span>
            <Icon className="size-[18px] text-faint" />
          </div>
          <span className="font-display text-[2rem] font-semibold leading-none tracking-[-0.02em] text-ink">
            {value}
          </span>
          {delta !== undefined ? (
            <span className="inline-flex w-fit items-center gap-1 text-[13px] font-medium text-success-text">
              <TrendingUp className="size-3.5" />
              +{delta}% <span className="font-normal text-faint">vs 7 hari lalu</span>
            </span>
          ) : (
            <span className="text-[13px] text-faint">{hint}</span>
          )}
        </div>
      ))}
    </div>
  );
}
