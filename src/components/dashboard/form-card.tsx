"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DotsVertical, Eye, Copy, Trash, InboxCheck, ChartLine } from "@mynaui/icons-react";
import type { FormStatus, FormSummary } from "@/types/form";
import { STATUS_META } from "@/lib/dashboard-data";

const STATUS_BADGE: Record<FormStatus, string> = {
  published: "bg-success-subtle text-success-text",
  draft: "bg-accent-subtle text-accent-text",
  closed: "bg-overlay text-muted",
};

interface FormCardProps {
  form: FormSummary;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FormCard({ form, onDuplicate, onDelete }: FormCardProps) {
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
    <div className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elevation-1)] transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--elevation-2)]">
      <div className="flex items-start justify-between gap-2 p-5 pb-0">
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
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-150 hover:bg-overlay hover:text-ink"
          >
            <DotsVertical className="size-[18px]" />
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
                onClick={() => {
                  onDuplicate(form.id);
                  setIsMenuOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-overlay hover:text-ink"
              >
                <Copy className="size-[18px]" />
                Duplikat
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(form.id);
                  setIsMenuOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-danger-subtle hover:text-danger-text"
              >
                <Trash className="size-[18px]" />
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>

      <Link href={`/forms/${form.id}`} className="mt-3 px-5">
        <h4 className="line-clamp-2 font-display text-[17px] font-medium leading-snug text-ink transition-colors group-hover:text-brand-text">
          {form.title}
        </h4>
      </Link>

      <div className="mt-4 flex items-center gap-4 px-5 pb-5 text-[13px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <InboxCheck className="size-4 text-faint" />
          {form.responses.toLocaleString("id-ID")} respons
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ChartLine className="size-4 text-faint" />
          {form.completionRate}% selesai
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-line-subtle bg-subtle px-5 py-3 text-xs text-faint">
        <span>Dibuat {form.createdAt}</span>
        <span>{form.lastResponseAt ? `Respons ${form.lastResponseAt}` : "Belum ada respons"}</span>
      </div>
    </div>
  );
}
