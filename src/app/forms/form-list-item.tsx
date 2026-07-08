"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Copy, Trash, DotsVertical } from "@mynaui/icons-react";
import type { FormStatus, FormSummary } from "@/types/form";
import { STATUS_META } from "@/lib/dashboard-data";

const STATUS_BADGE: Record<FormStatus, string> = {
  published: "bg-success-subtle text-success-text",
  draft: "bg-accent-subtle text-accent-text",
  closed: "bg-overlay text-muted",
};

interface FormListItemProps {
  form: FormSummary;
  index: number;
  onDuplicate: (form: FormSummary) => void;
  onDeleteRequest: (form: FormSummary) => void;
}

export function FormListItem({ form, index, onDuplicate, onDeleteRequest }: FormListItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    function handlePointer(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isMenuOpen]);

  return (
    <div
      className="group relative flex animate-enter flex-col rounded-xl border border-line bg-surface shadow-[var(--elevation-1)] transition-all duration-150 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--elevation-2)]"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms`, contentVisibility: "auto" }}
    >
      {/* Header: status badge + kebab */}
      <div className="flex items-center justify-between gap-2 px-5 pt-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[form.status]}`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {STATUS_META[form.status].label}
        </span>

        <div ref={menuRef} className="relative z-10">
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Aksi form"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-faint transition-colors duration-150 hover:bg-overlay hover:text-ink focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          >
            <DotsVertical className="size-5" />
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-30 mt-1 w-44 origin-top-right animate-pop rounded-lg border border-line bg-surface p-1.5 shadow-[var(--elevation-2)]"
            >
              <button
                type="button"
                onClick={() => { onDuplicate(form); setIsMenuOpen(false); }}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-overlay hover:text-ink focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              >
                <Copy className="size-[18px]" />
                Duplikat
              </button>
              <button
                type="button"
                onClick={() => { onDeleteRequest(form); setIsMenuOpen(false); }}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-danger-subtle hover:text-danger-text focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              >
                <Trash className="size-[18px]" />
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body: title (stretched link — whole card clickable) + meta */}
      <div className="flex flex-1 flex-col gap-2 px-5 pb-4 pt-3">
        <Link
          href={`/forms/${form.id}`}
          className="rounded after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-brand focus-visible:after:outline-offset-2"
        >
          <h4 className="line-clamp-2 font-display text-[17px] font-medium leading-snug text-ink transition-colors group-hover:text-brand-text">
            {form.title}
          </h4>
        </Link>
        <div className="mt-auto flex items-center gap-2 text-[13px] text-muted">
          <span>Dibuat {form.createdAt}</span>
          {form.lastResponseAt && (
            <>
              <span className="text-faint">·</span>
              <span className="font-mono text-xs text-faint">{form.lastResponseAt}</span>
            </>
          )}
        </div>
      </div>

      {/* Footer: forged stat band, dipisah rune divider */}
      <div className="divider-rune" />
      <div className="flex items-center justify-between rounded-b-xl bg-subtle px-5 py-3">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">
            {form.responses.toLocaleString("id-ID")}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
            respons
          </span>
        </div>

        {(form.status === "published" || form.status === "closed") && form.completionRate > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-overlay">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${form.completionRate}%` }}
              />
            </div>
            <span className="font-mono text-xs text-muted">{form.completionRate}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
