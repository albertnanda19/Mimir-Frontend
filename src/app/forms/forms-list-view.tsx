"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  SearchX,
  FileText,
  DangerTriangle,
  Refresh,
  X,
} from "@mynaui/icons-react";
import { AppNavbar } from "@/components/layout/app-navbar";
import { CreateFormMenu } from "@/components/dashboard/create-form-menu";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/lib/toast";
import { useDebounce } from "@/hooks/use-debounce";
import type { AppUser } from "@/types/auth";
import type { FormStatus, FormSummary } from "@/types/form";
import { getForms } from "./forms-data";
import { FormListItem } from "./form-list-item";

type Phase = "loading" | "success" | "error";

let copyCounter = 0;

const FILTERS: { key: FormStatus | "all"; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "published", label: "Terbit" },
  { key: "draft", label: "Draft" },
  { key: "closed", label: "Ditutup" },
];

export function FormsListView({ user }: { user: AppUser }) {
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [totalForms, setTotalForms] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState<FormStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<FormSummary | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 200);

  const q = debouncedSearch.trim().toLowerCase();
  const statusFilter = filter;

  const visible = useMemo(
    () =>
      forms.filter(
        (f) => (statusFilter === "all" || f.status === statusFilter) && (q === "" || f.title.toLowerCase().includes(q)),
      ),
    [forms, statusFilter, q],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: forms.length };
    for (const f of forms) counts[f.status] = (counts[f.status] ?? 0) + 1;
    return counts;
  }, [forms]);

  useEffect(() => {
    let cancelled = false;
    getForms()
      .then((result) => {
        if (cancelled) return;
        setForms(result.items);
        setTotalForms(result.total);
        setPhase("success");
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setErrorMessage(err.message);
        setPhase("error");
      });
    return () => { cancelled = true; };
  }, []);

  const handleDuplicate = useCallback((form: FormSummary) => {
    const copy: FormSummary = {
      ...form,
      id: `${form.id}_copy_${++copyCounter}`,
      title: `${form.title} (salinan)`,
      status: "draft",
      responses: 0,
      completionRate: 0,
      avgDurationSec: 0,
      lastResponseAt: null,
    };
    setForms((prev) => [copy, ...prev]);
    setTotalForms((prev) => prev + 1);
    toast.success("Formulir digandakan");
  }, []);

  const handleDeleteRequest = useCallback((form: FormSummary) => {
    setDeleteTarget(form);
  }, []);

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setForms((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    setTotalForms((prev) => prev - 1);
    toast.success("Formulir dihapus");
    setDeleteTarget(null);
  }

  // ── View States ──────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div className="min-h-dvh bg-subtle">
        <AppNavbar user={user} />
        <main className="mx-auto flex w-full max-w-[80rem] flex-col gap-8 px-4 py-8 sm:px-8">
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex animate-pulse flex-col gap-3 rounded-xl border border-line bg-surface p-5">
                <div className="flex items-start justify-between">
                  <div className="h-5 w-16 rounded-full bg-overlay" />
                  <div className="size-9 rounded-lg bg-overlay" />
                </div>
                <div className="mt-1 h-6 w-3/4 rounded-md bg-overlay" />
                <div className="mt-2 flex items-center justify-between">
                  <div className="h-7 w-20 rounded-md bg-overlay" />
                  <div className="h-4 w-32 rounded-full bg-overlay" />
                </div>
                <div className="h-4 w-48 rounded-md bg-overlay" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="min-h-dvh bg-subtle">
        <AppNavbar user={user} />
        <main className="mx-auto flex w-full max-w-[80rem] flex-col gap-8 px-4 py-8 sm:px-8">
          <div className="flex flex-col items-center gap-4 rounded-lg border border-line bg-surface py-20 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-danger-subtle text-danger-text">
              <DangerTriangle className="size-7" />
            </span>
            <div className="flex max-w-sm flex-col gap-1">
              <p className="font-display text-lg font-medium text-ink">Gagal memuat form</p>
              <p className="text-sm text-muted">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-brand px-4 text-sm font-medium text-white transition-all hover:bg-brand-hover active:scale-[0.98]"
            >
              <Refresh className="size-4" />
              Coba lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Success View ─────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-subtle">
      <AppNavbar user={user} />

      <main className="mx-auto flex w-full max-w-[80rem] flex-col gap-8 px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-8 animate-enter">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-[2rem] font-semibold tracking-[-0.02em] text-ink">Form saya</h1>
              <p className="text-[15px] text-muted">
                {totalForms} formulir tersimpan
              </p>
            </div>
            <CreateFormMenu />
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari formulir..."
                className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-ink shadow-[var(--elevation-1)] outline-none transition-all duration-150 placeholder:text-faint hover:border-line-strong focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-subtle)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Hapus pencarian"
                  className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-faint hover:bg-overlay hover:text-ink"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="inline-flex items-center gap-1 self-start rounded-full border border-line bg-subtle p-1 sm:self-auto">
              {FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ${
                    filter === key
                      ? "bg-surface text-ink shadow-[var(--elevation-1)]"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                  <span className="ml-1.5 font-mono text-xs text-faint">{statusCounts[key] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content — forged band list */}
          {visible.length === 0 ? (
            forms.length === 0 ? (
              /* Empty total */
              <div className="flex flex-col items-center gap-6 rounded-xl border border-dashed border-line bg-subtle py-20 text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-overlay">
                  <FileText className="size-10 text-faint" />
                </div>
                <div className="flex max-w-sm flex-col gap-2">
                  <h3 className="font-display text-xl font-medium text-ink">Sumur Mimir masih kosong</h3>
                  <p className="text-[15px] leading-relaxed text-muted">
                    Setiap form yang kamu buat akan terukir di sini, seperti rune di batu. Mulailah petualanganmu
                    dengan menekan tombol di atas.
                  </p>
                </div>
              </div>
            ) : (
              /* Empty filter result */
              <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-line bg-subtle py-16 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-overlay text-faint">
                  <SearchX className="size-6" />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-ink">Tidak ada form</p>
                  <p className="text-[13px] text-muted">Coba ubah filter atau kata kunci pencarian.</p>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col gap-3">
              {visible.map((form) => (
                <FormListItem
                  key={form.id}
                  form={form}
                  onDuplicate={handleDuplicate}
                  onDeleteRequest={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete confirmation modal — centralized in parent */}
      {deleteTarget && (
        <Modal title="Hapus formulir" onClose={() => setDeleteTarget(null)}>
          <div className="flex flex-col gap-6">
            <p className="text-[15px] leading-relaxed text-muted">
              Apakah kamu yakin ingin menghapus <strong className="text-ink">{deleteTarget.title}</strong>? Semua
              respons yang terkumpul akan ikut terhapus dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-md border border-line bg-surface text-sm font-medium text-ink transition-all hover:bg-overlay"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-md bg-danger text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-[0.98]"
              >
                Ya, hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
