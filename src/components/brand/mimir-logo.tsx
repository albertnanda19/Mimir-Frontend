import { GitBranch } from "@mynaui/icons-react";

export function MimirLogo({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-md bg-brand text-white shadow-[var(--elevation-1)]">
        <GitBranch className="size-[18px]" />
      </span>
      <span
        className={`font-display text-lg font-medium tracking-[-0.02em] ${onDark ? "text-white" : "text-ink"}`}
      >
        Mimir
      </span>
    </span>
  );
}
