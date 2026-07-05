import Link from "next/link";
import { Check } from "@mynaui/icons-react";

const STEPS = [
  { step: 1, label: "Racik dengan AI", href: "/forms/new?mode=ai" },
  { step: 2, label: "Susun manual", href: "/forms/new?mode=manual" },
  { step: 3, label: "Publikasi", href: null },
] as const;

export function BuilderStepper({ current }: { current: 1 | 2 }) {
  return (
    <nav aria-label="Langkah pembuatan form" className="flex items-center gap-1.5">
      {STEPS.map(({ step, label, href }, index) => {
        const isActive = step === current;
        const isDone = step < current;
        const content = (
          <span
            className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-[13px] font-medium transition-colors duration-150 ${
              isActive ? "text-ink" : "text-muted"
            } ${href && !isActive ? "hover:bg-overlay hover:text-ink" : ""}`}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-150 ${
                isActive
                  ? "bg-brand text-white shadow-[var(--elevation-1)]"
                  : isDone
                    ? "bg-brand-subtle text-brand-text"
                    : "bg-overlay text-faint"
              }`}
            >
              {isDone ? <Check className="size-3.5" /> : step}
            </span>
            {label}
          </span>
        );
        return (
          <span key={step} className="flex items-center gap-1.5">
            {index > 0 && (
              <span className={`h-px w-5 ${step <= current ? "bg-brand" : "bg-line"}`} />
            )}
            {href && !isActive ? (
              <Link href={href} className="cursor-pointer rounded-full" aria-label={`Ke langkah ${step}: ${label}`}>
                {content}
              </Link>
            ) : (
              <span aria-current={isActive ? "step" : undefined}>{content}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
