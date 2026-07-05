"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Download, FileText, Table } from "@mynaui/icons-react";
import type { DraftQuestion } from "@/types/ai-builder";
import type { ResponseRow } from "@/lib/responses-data";
import { downloadFile, toCsv, toExcelXml } from "@/lib/export";
import { toSlug } from "@/lib/respondent";

type Format = "csv" | "excel";

const OPTIONS: { format: Format; icon: typeof Table; title: string; body: string }[] = [
  { format: "csv", icon: FileText, title: "CSV (.csv)", body: "Universal — terbaca semua aplikasi data." },
  { format: "excel", icon: Table, title: "Excel (.xls)", body: "Langsung terbuka rapi di Microsoft Excel." },
];

interface ExportMenuProps {
  title: string;
  questions: DraftQuestion[];
  rows: ResponseRow[];
}

export function ExportMenu({ title, questions, rows }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [doneFormat, setDoneFormat] = useState<Format | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointer(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  function handleExport(format: Format) {
    const slug = toSlug(title);
    if (format === "csv") {
      downloadFile(`${slug}-respons.csv`, "text/csv;charset=utf-8", toCsv(questions, rows));
    } else {
      downloadFile(
        `${slug}-respons.xls`,
        "application/vnd.ms-excel",
        toExcelXml(title, questions, rows),
      );
    }
    setDoneFormat(format);
    setTimeout(() => {
      setDoneFormat(null);
      setIsOpen(false);
    }, 1200);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={rows.length === 0}
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-md border border-line bg-surface px-4 text-sm font-medium text-muted transition-all duration-150 hover:border-line-strong hover:text-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Download className="size-4" />
        Ekspor
        <ChevronDown className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-72 origin-top-right animate-pop rounded-lg border border-line bg-surface p-1.5 shadow-[var(--elevation-2)]"
        >
          <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            {rows.length.toLocaleString("id-ID")} respons akan diekspor
          </p>
          {OPTIONS.map(({ format, icon: Icon, title: optionTitle, body }) => {
            const isDone = doneFormat === format;
            return (
              <button
                key={format}
                type="button"
                role="menuitem"
                onClick={() => handleExport(format)}
                className="flex w-full cursor-pointer items-start gap-3 rounded-md p-2.5 text-left transition-colors duration-100 hover:bg-overlay"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-md transition-colors duration-150 ${
                    isDone ? "bg-success-subtle text-success-text" : "bg-brand-subtle text-brand-text"
                  }`}
                >
                  {isDone ? <Check className="size-[18px]" /> : <Icon className="size-[18px]" />}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-ink">
                    {isDone ? "File terunduh" : optionTitle}
                  </span>
                  <span className="text-[13px] leading-snug text-muted">{body}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
