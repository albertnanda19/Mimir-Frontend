"use client";

import { useState } from "react";
import { Search, FileText } from "@mynaui/icons-react";
import type { FormStatus, FormSummary } from "@/types/form";
import { DUMMY_FORMS } from "@/lib/dashboard-data";
import { FormCard } from "@/components/dashboard/form-card";

type Filter = FormStatus | "all";

const TABS: { value: Filter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draft" },
  { value: "closed", label: "Ditutup" },
];

export function FormsPanel() {
  const [forms, setForms] = useState<FormSummary[]>(DUMMY_FORMS);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const visible = forms.filter(
    (form) =>
      (filter === "all" || form.status === filter) &&
      (normalizedQuery === "" || form.title.toLowerCase().includes(normalizedQuery)),
  );

  function handleDuplicate(id: string) {
    setForms((prev) => {
      const source = prev.find((form) => form.id === id);
      if (!source) return prev;
      const copy: FormSummary = {
        ...source,
        id: `${source.id}_copy_${Date.now()}`,
        title: `${source.title} (salinan)`,
        status: "draft",
        responses: 0,
        completionRate: 0,
        avgDurationSec: 0,
        createdAt: "baru saja",
        lastResponseAt: null,
      };
      return [copy, ...prev];
    });
  }

  function handleDelete(id: string) {
    setForms((prev) => prev.filter((form) => form.id !== id));
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-[var(--elevation-1)]">
          {TABS.map((tab) => {
            const count = tab.value === "all" ? forms.length : forms.filter((form) => form.status === tab.value).length;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
                  filter === tab.value ? "bg-surface text-ink shadow-[var(--elevation-1)]" : "text-muted hover:text-ink"
                }`}
              >
                {tab.label}
                <span className="font-mono text-xs text-faint">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari form…"
            className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-ink shadow-[var(--elevation-1)] outline-none transition-all duration-150 placeholder:text-faint hover:border-line-strong focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-subtle)]"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line bg-subtle py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-overlay text-faint">
            <FileText className="size-6" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-ink">Tidak ada form</p>
            <p className="text-[13px] text-muted">Coba ubah filter atau kata kunci pencarian.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((form) => (
            <FormCard key={form.id} form={form} onDuplicate={handleDuplicate} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
