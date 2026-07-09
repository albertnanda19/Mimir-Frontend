import type { ReactNode } from "react";

interface ChartEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  children?: ReactNode;
}

export function ChartEmptyState({ icon, title, description, className = "", children }: ChartEmptyStateProps) {
  return (
    <div
      className={`flex animate-enter flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-line bg-subtle px-6 text-center ${className}`}
    >
      <span className="flex size-12 animate-pop items-center justify-center rounded-full bg-overlay text-faint">
        {icon}
      </span>
      <div className="flex max-w-xs flex-col gap-1">
        <p className="font-display text-[15px] font-medium text-ink">{title}</p>
        <p className="text-[13px] leading-relaxed text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}
