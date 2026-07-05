import type { ReactNode } from "react";
import { DangerTriangle, CheckCircle } from "@mynaui/icons-react";

export function FormAlert({ tone, children }: { tone: "danger" | "success"; children: ReactNode }) {
  const Icon = tone === "danger" ? DangerTriangle : CheckCircle;
  const styles =
    tone === "danger" ? "bg-danger-subtle text-danger-text" : "bg-success-subtle text-success-text";
  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-md px-3.5 py-3 text-[13px] leading-relaxed animate-pop ${styles}`}
    >
      <Icon className="mt-px size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
