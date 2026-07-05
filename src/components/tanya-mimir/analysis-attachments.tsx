"use client";

import { useState } from "react";
import { CheckCircle, Tag, Trash } from "@mynaui/icons-react";
import type { AnalysisCluster, AnalysisStat, CleanupProposal } from "@/types/tanya-mimir";

export function StatsGrid({ stats }: { stats: AnalysisStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 animate-enter sm:grid-cols-4">
      {stats.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-3 shadow-[var(--elevation-1)]">
          <span className="text-[11px] font-medium text-muted">{label}</span>
          <span className="font-display text-lg font-semibold tracking-[-0.01em] text-ink">{value}</span>
        </div>
      ))}
    </div>
  );
}

export function ClusterList({
  clusters,
  onClusterClick,
}: {
  clusters: AnalysisCluster[];
  onClusterClick: (cluster: AnalysisCluster) => void;
}) {
  const max = Math.max(...clusters.map((cluster) => cluster.count), 1);
  return (
    <div className="flex flex-col gap-2 animate-enter">
      {clusters.map((cluster, index) => (
        <button
          key={cluster.name}
          type="button"
          onClick={() => onClusterClick(cluster)}
          style={{ animationDelay: `${index * 50}ms` }}
          className="flex cursor-pointer flex-col gap-1.5 rounded-lg border border-line bg-surface p-3 text-left shadow-[var(--elevation-1)] transition-all duration-150 animate-enter hover:-translate-y-0.5 hover:border-brand hover:shadow-[var(--elevation-2)] active:translate-y-0"
        >
          <div className="flex w-full items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
              <Tag className="size-3.5 text-brand" />
              {cluster.name}
            </span>
            <span className="rounded-full bg-brand-subtle px-2 py-0.5 font-mono text-[11px] font-medium text-brand-text">
              {cluster.count}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-overlay">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-500 ease-[var(--ease-enter)]"
              style={{ width: `${Math.round((cluster.count / max) * 100)}%` }}
            />
          </div>
          {cluster.samples.length > 0 && (
            <p className="text-xs leading-relaxed text-muted">
              {cluster.samples.map((sample) => `“${sample}”`).join(" · ")}
            </p>
          )}
          <span className="text-[11px] text-faint">Klik untuk lihat data mentahnya</span>
        </button>
      ))}
    </div>
  );
}

export function CleanupCard({
  cleanup,
  onInspect,
  onApply,
}: {
  cleanup: CleanupProposal;
  onInspect: () => void;
  onApply: () => void;
}) {
  const [stage, setStage] = useState<"idle" | "working" | "done">("idle");

  async function handleApply() {
    setStage("working");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onApply();
    setStage("done");
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 shadow-[var(--elevation-1)] animate-enter">
      <div className="flex items-start gap-3">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-md ${stage === "done" ? "bg-success-subtle text-success-text" : "bg-danger-subtle text-danger-text"}`}>
          {stage === "done" ? <CheckCircle className="size-5" /> : <Trash className="size-5" />}
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-ink">
            {stage === "done" ? `${cleanup.count} respons dibersihkan` : cleanup.description}
          </p>
          <p className="text-[13px] leading-relaxed text-muted">
            {stage === "done"
              ? "Tabel respons dan statistik sudah diperbarui."
              : `${cleanup.count} respons cocok dengan kriteria ini. Aksi tidak bisa dibatalkan.`}
          </p>
        </div>
      </div>
      {stage !== "done" && (
        <div className="flex flex-wrap items-center gap-2 pl-12">
          <button
            type="button"
            disabled={stage === "working"}
            onClick={handleApply}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md bg-danger px-3.5 text-[13px] font-medium text-white shadow-[var(--elevation-1)] transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {stage === "working" ? "Membersihkan…" : `Hapus ${cleanup.count} respons`}
          </button>
          <button
            type="button"
            onClick={onInspect}
            className="inline-flex h-9 cursor-pointer items-center rounded-md border border-line bg-surface px-3.5 text-[13px] font-medium text-muted transition-all duration-150 hover:border-line-strong hover:text-ink active:scale-[0.98]"
          >
            Periksa datanya dulu
          </button>
          <span className="text-xs text-faint">Perlu konfirmasimu dulu</span>
        </div>
      )}
    </div>
  );
}
