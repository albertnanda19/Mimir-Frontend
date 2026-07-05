import type { ReactNode } from "react";

interface ChartCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}

export function ChartCard({ icon, title, subtitle, action, children }: ChartCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elevation-1)] transition-shadow duration-200 hover:shadow-[var(--elevation-2)]">
      <div className="flex items-center justify-between gap-3 border-b border-line-subtle px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-subtle text-brand-text [&>svg]:size-[18px]">
            {icon}
          </span>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-[15px] font-medium leading-tight text-ink">{title}</h3>
            <p className="text-[13px] leading-tight text-muted">{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      <div className="flex flex-1 flex-col p-5">{children}</div>
    </div>
  );
}
