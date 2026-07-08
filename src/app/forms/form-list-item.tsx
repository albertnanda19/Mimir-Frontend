"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye, Copy, Trash, Menu } from "@mynaui/icons-react";
import type { FormStatus, FormSummary } from "@/types/form";
import { STATUS_META } from "@/lib/dashboard-data";

const STATUS_BADGE: Record<FormStatus, string> = {
  published: "bg-success-subtle text-success-text",
  draft: "bg-accent-subtle text-accent-text",
  closed: "bg-overlay text-muted",
};

const ACCENT_COLOR: Record<FormStatus, string> = {
  published: "var(--success-default)",
  draft: "var(--accent-default)",
  closed: "var(--muted)",
};

interface FormListItemProps {
  form: FormSummary;
  onDuplicate: (form: FormSummary) => void;
  onDeleteRequest: (form: FormSummary) => void;
}

export function FormListItem({ form, onDuplicate, onDeleteRequest }: FormListItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    function handlePointer(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [isMenuOpen]);

  return (
    <div
      className="group flex flex-col rounded-xl border border-line bg-surface shadow-[var(--elevation-1)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--elevation-2)]"
      style={{ borderLeft: `3px solid ${ACCENT_COLOR[form.status]}`, contentVisibility: "auto" }}
    >
      {/* Row 1: Status badge + Menu trigger */}
      <div className="flex items-start justify-between gap-2 px-5 pt-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[form.status]}`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {STATUS_META[form.status].label}
        </span>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Aksi form"
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-faint transition-colors duration-150 hover:bg-overlay hover:text-ink"
          >
            <Menu className="size-5" />
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-30 mt-1 w-44 origin-top-right animate-pop rounded-lg border border-line bg-surface p-1.5 shadow-[var(--elevation-2)]"
            >
              <Link
                href={`/forms/${form.id}`}
                onClick={() => setIsMenuOpen(false)}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-overlay hover:text-ink"
              >
                <Eye className="size-[18px]" />
                Lihat respons
              </Link>
              <button
                type="button"
                onClick={() => { onDuplicate(form); setIsMenuOpen(false); }}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-overlay hover:text-ink"
              >
                <Copy className="size-[18px]" />
                Duplikat
              </button>
              <button
                type="button"
                onClick={() => { onDeleteRequest(form); setIsMenuOpen(false); }}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-danger-subtle hover:text-danger-text"
              >
                <Trash className="size-[18px]" />
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Title */}
      <Link href={`/forms/${form.id}`} className="mt-3 px-5">
        <h4 className="line-clamp-1 font-display text-[17px] font-medium leading-snug text-ink transition-colors group-hover:text-brand-text">
          {form.title}
        </h4>
      </Link>

      {/* Row 3: Response count + completion rate */}
      <div className="mt-4 flex items-center justify-between px-5">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
            {form.responses.toLocaleString("id-ID")}
          </span>
          <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted">
            respons
          </span>
        </div>

        {(form.status === "published" || form.status === "closed") && form.completionRate > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-overlay">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${form.completionRate}%` }}
              />
            </div>
            <span className="font-mono text-xs text-muted">{form.completionRate}%</span>
          </div>
        )}
      </div>

      {/* Row 4: Meta */}
      <div className="mt-3 flex items-center gap-2 px-5 pb-4 text-[13px] text-muted">
        <span>Dibuat {form.createdAt}</span>
        {form.lastResponseAt && (
          <>
            <span className="text-faint">·</span>
            <span className="font-mono text-xs text-faint">{form.lastResponseAt}</span>
          </>
        )}
      </div>
    </div>
  );
}
