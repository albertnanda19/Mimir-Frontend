import Link from "next/link";
import { Grid, Sparkles } from "@mynaui/icons-react";

export function ManualBuilderPlaceholder() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 animate-enter">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl border border-line bg-surface p-10 text-center shadow-[var(--elevation-1)]">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-overlay text-faint">
          <Grid className="size-7" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-xl font-semibold tracking-[-0.015em] text-ink">
            Manual Builder segera hadir
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Mode susun drag-and-drop sedang disiapkan. Sementara itu, biarkan Mimir menyusun formmu lewat percakapan.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Link
            href="/forms/new?mode=ai"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-brand px-5 text-sm font-medium text-white shadow-[var(--elevation-1)] transition-all duration-150 hover:bg-brand-hover hover:shadow-[var(--elevation-2)] active:scale-[0.98]"
          >
            <Sparkles className="size-4" />
            Buat dengan bantuan Mimir
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md px-5 text-sm font-medium text-muted transition-colors duration-150 hover:bg-overlay hover:text-ink"
          >
            Kembali ke dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
