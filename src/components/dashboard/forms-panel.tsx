"use client";

import { useEffect, useRef, useState } from "react";
import { Search, FileText, SearchX, ChevronLeft, ChevronRight } from "@mynaui/icons-react";
import type { FormStatus, FormSummary } from "@/types/form";
import type { FormsPage, Result } from "@/types/dashboard";
import { deleteForm, duplicateForm, fetchForms } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/api/token.client";
import { apiErrorMessage } from "@/lib/api-client";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "@/lib/toast";
import { FormCard } from "@/components/dashboard/form-card";
import { CreateFormMenu } from "@/components/dashboard/create-form-menu";
import { ChartErrorState } from "@/components/dashboard/chart-error-state";
import { Modal } from "@/components/ui/modal";

type Filter = FormStatus | "all";
type Phase = "loading" | "success" | "error";

const PAGE_SIZE = 12;

const TABS: { value: Filter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draft" },
  { value: "closed", label: "Ditutup" },
  { value: "archived", label: "Arsip" },
];

interface FormsPanelProps {
  initial: Result<FormsPage>;
  refreshKey: number;
  onMutate: () => void;
}

export function FormsPanel({ initial, refreshKey, onMutate }: FormsPanelProps) {
  const [data, setData] = useState(initial.ok ? initial.data : null);
  const [phase, setPhase] = useState<Phase>(initial.ok ? "success" : "error");
  const [errorMessage, setErrorMessage] = useState(initial.ok ? "" : initial.message);
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<FormSummary | null>(null);
  const skipFirstRun = useRef(true);

  const debouncedSearch = useDebounce(query, 200);

  async function load(target: { filter: Filter; search: string; page: number }) {
    setPhase("loading");
    try {
      const token = await getAccessToken();
      setData(
        await fetchForms(token, {
          page: target.page,
          pageSize: PAGE_SIZE,
          search: target.search,
          status: target.filter,
        }),
      );
      setPhase("success");
    } catch (err) {
      setErrorMessage(apiErrorMessage(err));
      setPhase("error");
    }
  }

  useEffect(() => {
    if (skipFirstRun.current) {
      skipFirstRun.current = false;
      return;
    }
    load({ filter, search: debouncedSearch, page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, debouncedSearch, page, refreshKey]);

  async function handleDuplicate(id: string) {
    try {
      const token = await getAccessToken();
      await duplicateForm(token, id);
      toast.success("Formulir digandakan");
      onMutate();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      const token = await getAccessToken();
      await deleteForm(token, target.id);
      toast.success("Formulir dihapus");
      if (data && data.forms.length === 1 && page > 1) setPage(page - 1);
      onMutate();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const isTrulyEmpty = data !== null && data.statusCounts.all === 0 && debouncedSearch.trim() === "";

  if (phase === "error" && data === null) {
    return (
      <ChartErrorState
        message={errorMessage}
        onRetry={() => load({ filter, search: debouncedSearch, page })}
        className="py-16"
      />
    );
  }

  if (isTrulyEmpty) {
    return (
      <div className="flex animate-enter flex-col items-center gap-6 rounded-xl border border-dashed border-line bg-subtle py-20 text-center">
        <div className="flex size-20 animate-pop items-center justify-center rounded-full bg-overlay">
          <FileText className="size-10 text-faint" />
        </div>
        <div className="flex max-w-sm flex-col gap-2">
          <h3 className="font-display text-xl font-medium text-ink">Sumur Mimir masih kosong</h3>
          <p className="text-[15px] leading-relaxed text-muted">
            Setiap form yang kamu buat akan terukir di sini, seperti rune di batu. Mulailah petualanganmu dengan
            membuat form pertama.
          </p>
        </div>
        <CreateFormMenu />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 shadow-[var(--elevation-1)]">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setFilter(tab.value);
                setPage(1);
              }}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 ${
                filter === tab.value ? "bg-surface text-ink shadow-[var(--elevation-1)]" : "text-muted hover:text-ink"
              }`}
            >
              {tab.label}
              <span className="font-mono text-xs text-faint">{data?.statusCounts[tab.value] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari form…"
            className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-ink shadow-[var(--elevation-1)] outline-none transition-all duration-150 placeholder:text-faint hover:border-line-strong focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-subtle)]"
          />
        </div>
      </div>

      {phase === "loading" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[180px] animate-pulse rounded-xl border border-line bg-surface" />
          ))}
        </div>
      ) : phase === "error" ? (
        <ChartErrorState
          message={errorMessage}
          onRetry={() => load({ filter, search: debouncedSearch, page })}
          className="py-16"
        />
      ) : data && data.forms.length === 0 ? (
        <div className="flex animate-enter flex-col items-center gap-3 rounded-lg border border-dashed border-line bg-subtle py-16 text-center">
          <span className="flex size-12 animate-pop items-center justify-center rounded-full bg-overlay text-faint">
            <SearchX className="size-6" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-ink">Tidak ada form</p>
            <p className="text-[13px] text-muted">Coba ubah filter atau kata kunci pencarian.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data?.forms.map((form) => (
              <FormCard key={form.id} form={form} onDuplicate={handleDuplicate} onDelete={() => setDeleteTarget(form)} />
            ))}
          </div>

          {data && data.total > PAGE_SIZE && (
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-muted">
                Halaman <span className="font-mono text-ink">{data.page}</span> dari{" "}
                <span className="font-mono text-ink">{totalPages}</span> ·{" "}
                <span className="font-mono text-ink">{data.total}</span> form
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  aria-label="Halaman sebelumnya"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:bg-overlay hover:text-ink disabled:pointer-events-none disabled:opacity-45"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  aria-label="Halaman berikutnya"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-line bg-surface text-muted transition-colors hover:bg-overlay hover:text-ink disabled:pointer-events-none disabled:opacity-45"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

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
                className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-md bg-danger text-sm font-medium text-white transition-all hover:bg-[var(--fenrir-600)] active:scale-[0.98]"
              >
                Ya, hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
