import { DangerTriangle, Refresh } from "@mynaui/icons-react";

interface ChartErrorStateProps {
  message: string;
  onRetry: () => void;
  className?: string;
}

export function ChartErrorState({ message, onRetry, className = "" }: ChartErrorStateProps) {
  return (
    <div
      className={`flex animate-enter flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-line bg-subtle px-6 text-center ${className}`}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-danger-subtle text-danger-text">
        <DangerTriangle className="size-6" />
      </span>
      <div className="flex max-w-xs flex-col gap-1">
        <p className="font-display text-[15px] font-medium text-ink">Gagal memuat data</p>
        <p className="text-[13px] leading-relaxed text-muted">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-3 text-[13px] font-medium text-muted transition-colors hover:bg-overlay hover:text-ink focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
      >
        <Refresh className="size-4" />
        Coba lagi
      </button>
    </div>
  );
}
