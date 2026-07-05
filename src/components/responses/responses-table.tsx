"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Search, SearchX } from "@mynaui/icons-react";
import type { DraftQuestion } from "@/types/ai-builder";
import type { ResponseRow } from "@/lib/responses-data";
import { SelectField } from "@/components/ui/select-field";
import { ResponseDetailModal } from "@/components/responses/response-detail-modal";

const PAGE_SIZES = [
  { value: "10", label: "10 baris" },
  { value: "25", label: "25 baris" },
  { value: "50", label: "50 baris" },
];

type SortKey = "time" | "duration" | string;

interface ResponsesTableProps {
  questions: DraftQuestion[];
  rows: ResponseRow[];
}

function SortableHeader({
  label,
  sortId,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  sortId: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  const isActive = sortKey === sortId;
  return (
    <button
      type="button"
      onClick={() => onSort(sortId)}
      className={`group inline-flex max-w-52 cursor-pointer items-center gap-1 text-left transition-colors duration-100 hover:text-ink ${
        isActive ? "text-ink" : ""
      }`}
    >
      <span className="truncate">{label}</span>
      <span className="shrink-0">
        {isActive ? (
          sortDir === "asc" ? (
            <ChevronUp className="size-3.5 text-brand" />
          ) : (
            <ChevronDown className="size-3.5 text-brand" />
          )
        ) : (
          <ChevronDown className="size-3.5 opacity-0 transition-opacity group-hover:opacity-40" />
        )}
      </span>
    </button>
  );
}

export function ResponsesTable({ questions, rows }: ResponsesTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detail, setDetail] = useState<{ row: ResponseRow; number: number } | null>(null);

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? rows.filter((row) =>
        Object.values(row.answers).some((answer) => answer.toLowerCase().includes(normalized)),
      )
    : rows;

  const sorted = [...filtered].sort((a, b) => {
    const direction = sortDir === "asc" ? 1 : -1;
    if (sortKey === "time") return (a.submittedAtMs - b.submittedAtMs) * direction;
    if (sortKey === "duration") return (a.durationSec - b.durationSec) * direction;
    return (a.answers[sortKey] ?? "").localeCompare(b.answers[sortKey] ?? "", "id") * direction;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "time" || key === "duration" ? "desc" : "asc");
    }
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari di semua jawaban…"
            aria-label="Cari respons"
            className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-ink outline-none transition-all duration-150 placeholder:text-faint hover:border-line-strong focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-subtle)]"
          />
        </div>
        <SelectField
          options={PAGE_SIZES}
          value={String(pageSize)}
          onChange={(value) => {
            setPageSize(Number(value));
            setPage(1);
          }}
          ariaLabel="Jumlah baris per halaman"
          align="right"
          size="sm"
          className="self-end sm:self-auto"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elevation-1)]">
        {pageRows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <SearchX className="size-6 text-faint" />
            <p className="text-sm text-muted">Tidak ada respons yang cocok dengan “{query.trim()}”.</p>
          </div>
        ) : (
          <div className="max-h-[62dvh] overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-subtle text-left">
                <tr className="border-b border-line">
                  <th className="whitespace-nowrap px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
                    #
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-muted">
                    <SortableHeader label="Waktu masuk" sortId="time" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-muted">
                    <SortableHeader label="Durasi" sortId="duration" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  {questions.map((question) => (
                    <th key={question.id} className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-muted">
                      <SortableHeader label={question.label} sortId={question.id} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, rowIndex) => {
                  const number = (safePage - 1) * pageSize + rowIndex + 1;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setDetail({ row, number })}
                      className="cursor-pointer border-b border-line-subtle transition-colors duration-100 last:border-b-0 hover:bg-overlay"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-faint">{number}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">
                        {row.submittedAtLabel}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">
                        {row.durationLabel}
                      </td>
                      {questions.map((question) => {
                        const answer = row.answers[question.id];
                        return (
                          <td key={question.id} className="max-w-56 truncate px-4 py-3 text-ink">
                            {answer || <span className="text-faint">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-muted">
          Menampilkan{" "}
          <span className="font-mono text-ink">
            {sorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, sorted.length)}
          </span>{" "}
          dari <span className="font-mono text-ink">{sorted.length}</span> respons
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage(safePage - 1)}
            aria-label="Halaman sebelumnya"
            className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-line bg-surface text-muted transition-all duration-150 hover:border-line-strong hover:text-ink active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-20 text-center font-mono text-[13px] text-muted">
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage(safePage + 1)}
            aria-label="Halaman berikutnya"
            className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-line bg-surface text-muted transition-all duration-150 hover:border-line-strong hover:text-ink active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {detail && (
        <ResponseDetailModal
          row={detail.row}
          number={detail.number}
          questions={questions}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}
