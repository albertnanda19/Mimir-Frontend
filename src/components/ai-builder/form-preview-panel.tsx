"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, GitBranch, Layout } from "@mynaui/icons-react";
import type { FormDraft } from "@/types/ai-builder";
import { QuestionPreviewCard } from "@/components/ai-builder/question-preview-card";

interface FormPreviewPanelProps {
  draft: FormDraft | null;
  isGenerating: boolean;
  onReorder: (from: number, to: number) => void;
}

function DropIndicator({ position }: { position: "top" | "bottom" }) {
  return (
    <span
      className={`pointer-events-none absolute left-1 right-1 z-10 h-[3px] rounded-full bg-brand animate-pop ${
        position === "top" ? "-top-[7px]" : "-bottom-[7px]"
      }`}
    />
  );
}

export function FormPreviewPanel({ draft, isGenerating, onReorder }: FormPreviewPanelProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overSlot, setOverSlot] = useState<number | null>(null);
  const logicCount = draft?.questions.filter((question) => question.logic).length ?? 0;
  const total = draft?.questions.length ?? 0;

  function resetDrag() {
    setDragIndex(null);
    setOverSlot(null);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>, index: number) {
    if (dragIndex === null) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const rect = event.currentTarget.getBoundingClientRect();
    setOverSlot(index + (event.clientY > rect.top + rect.height / 2 ? 1 : 0));
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (dragIndex !== null && overSlot !== null) {
      const to = overSlot > dragIndex ? overSlot - 1 : overSlot;
      if (to !== dragIndex) onReorder(dragIndex, to);
    }
    resetDrag();
  }

  return (
    <section
      aria-label="Pratinjau struktur form"
      className="flex min-h-[24rem] flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elevation-1)] lg:min-h-0"
    >
      <header className="flex items-center justify-between gap-3 border-b border-line-subtle px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Layout className="size-[18px] text-faint" />
          <h2 className="font-display text-[15px] font-medium tracking-[-0.01em] text-ink">
            Struktur form
          </h2>
        </div>
        {draft && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-overlay px-2.5 py-0.5 text-xs font-medium text-muted">
              {total} pertanyaan
            </span>
            {logicCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-medium text-accent-text">
                <GitBranch className="size-3" />
                {logicCount} logika
              </span>
            )}
          </div>
        )}
      </header>

      <div className="scrollbar-slim flex-1 overflow-y-auto p-5">
        {!draft && isGenerating ? (
          <div className="flex flex-col gap-3">
            <div className="h-16 animate-pulse rounded-lg bg-overlay" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-lg bg-overlay" />
            ))}
          </div>
        ) : !draft ? (
          <div className="flex h-full min-h-[18rem] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-line p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-overlay text-faint">
              <Layout className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-ink">Struktur form akan muncul di sini</p>
              <p className="max-w-xs text-[13px] leading-relaxed text-muted">
                Kirim instruksi di panel percakapan, Mimir langsung menyusun pertanyaan beserta logikanya.
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col gap-3 transition-opacity duration-200 ${isGenerating ? "opacity-50" : ""}`}
          >
            <div className="rounded-lg bg-brand-subtle p-4 animate-enter">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-text">
                Draft form
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold tracking-[-0.015em] text-ink">
                {draft.title}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{draft.description}</p>
            </div>
            {draft.questions.map((question, index) => (
              <div
                key={question.id}
                className="relative"
                onDragOver={(event) => handleDragOver(event, index)}
                onDrop={handleDrop}
              >
                {dragIndex !== null && overSlot === index && <DropIndicator position="top" />}
                <QuestionPreviewCard
                  question={question}
                  index={index}
                  total={total}
                  isDragging={dragIndex === index}
                  onDragStart={() => setDragIndex(index)}
                  onDragEnd={resetDrag}
                  onMove={onReorder}
                />
                {dragIndex !== null && index === total - 1 && overSlot === total && (
                  <DropIndicator position="bottom" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {draft && (
        <footer className="flex items-center justify-between gap-3 border-t border-line-subtle bg-subtle px-5 py-3.5">
          <p className="hidden text-xs leading-snug text-muted sm:block">
            Seret kartu atau pakai tombol panah untuk mengatur urutan pertanyaan.
          </p>
          <Link
            href="/forms/new?mode=manual"
            className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-md bg-brand px-4 text-sm font-medium text-white shadow-[var(--elevation-1)] transition-all duration-150 hover:bg-brand-hover hover:shadow-[var(--elevation-2)] active:scale-[0.98]"
          >
            Review di Manual Builder
            <ArrowRight className="size-4" />
          </Link>
        </footer>
      )}
    </section>
  );
}
