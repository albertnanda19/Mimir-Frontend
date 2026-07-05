"use client";

import { useState } from "react";
import { Layout, Plus } from "@mynaui/icons-react";
import type { DraftQuestionType, FormDraft } from "@/types/ai-builder";
import { formatLogic } from "@/lib/logic";
import { CanvasQuestionCard } from "@/components/manual-builder/canvas-question-card";

interface BuilderCanvasProps {
  draft: FormDraft;
  selectedId: string | null;
  draggedPaletteType: DraftQuestionType | null;
  onSelect: (id: string | null) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onReorder: (from: number, to: number) => void;
  onInsert: (type: DraftQuestionType, at: number) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
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

export function BuilderCanvas({
  draft,
  selectedId,
  draggedPaletteType,
  onSelect,
  onTitleChange,
  onDescriptionChange,
  onReorder,
  onInsert,
  onDuplicate,
  onDelete,
  onAddClick,
}: BuilderCanvasProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overSlot, setOverSlot] = useState<number | null>(null);
  const total = draft.questions.length;
  const isDragActive = dragIndex !== null || draggedPaletteType !== null;

  function resetDrag() {
    setDragIndex(null);
    setOverSlot(null);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>, index: number) {
    if (!isDragActive) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = draggedPaletteType ? "copy" : "move";
    const rect = event.currentTarget.getBoundingClientRect();
    setOverSlot(index + (event.clientY > rect.top + rect.height / 2 ? 1 : 0));
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (overSlot !== null) {
      if (draggedPaletteType) {
        onInsert(draggedPaletteType, overSlot);
      } else if (dragIndex !== null) {
        const to = overSlot > dragIndex ? overSlot - 1 : overSlot;
        if (to !== dragIndex) onReorder(dragIndex, to);
      }
    }
    resetDrag();
  }

  function handleEmptyDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (draggedPaletteType) onInsert(draggedPaletteType, total);
    resetDrag();
  }

  return (
    <section
      aria-label="Kanvas form"
      className="flex min-h-[24rem] flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elevation-1)] lg:h-full lg:min-h-0"
    >
      <div className="scrollbar-slim flex-1 overflow-y-auto p-5">
        <div className="mb-4 flex flex-col gap-1 rounded-lg bg-brand-subtle p-4 animate-enter">
          <input
            type="text"
            value={draft.title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Judul form"
            aria-label="Judul form"
            className="w-full bg-transparent font-display text-lg font-semibold tracking-[-0.015em] text-ink outline-none placeholder:text-faint border-b-[1.5px] border-transparent transition-colors duration-150 focus:border-brand"
          />
          <input
            type="text"
            value={draft.description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Deskripsi singkat untuk responden (opsional)"
            aria-label="Deskripsi form"
            className="w-full bg-transparent text-[13px] leading-relaxed text-muted outline-none placeholder:text-faint border-b-[1.5px] border-transparent transition-colors duration-150 focus:border-brand"
          />
        </div>

        {total === 0 ? (
          <div
            onDragOver={(event) => {
              if (!draggedPaletteType) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = "copy";
            }}
            onDrop={handleEmptyDrop}
            className={`flex min-h-[16rem] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center transition-colors duration-150 ${
              draggedPaletteType ? "border-brand bg-brand-subtle" : "border-line"
            }`}
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-overlay text-faint">
              <Layout className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-ink">Kanvas masih kosong</p>
              <p className="max-w-xs text-[13px] leading-relaxed text-muted">
                Seret komponen dari panel kiri ke sini, atau klik komponen untuk menambahkannya.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {draft.questions.map((question, index) => (
              <div
                key={question.id}
                className="relative"
                onDragOver={(event) => handleDragOver(event, index)}
                onDrop={handleDrop}
              >
                {isDragActive && overSlot === index && <DropIndicator position="top" />}
                <CanvasQuestionCard
                  question={question}
                  logicText={formatLogic(question.logic, draft.questions)}
                  index={index}
                  total={total}
                  isSelected={selectedId === question.id}
                  isDragging={dragIndex === index}
                  onSelect={() => onSelect(question.id)}
                  onDragStart={() => setDragIndex(index)}
                  onDragEnd={resetDrag}
                  onMove={onReorder}
                  onDuplicate={() => onDuplicate(question.id)}
                  onDelete={() => onDelete(question.id)}
                />
                {isDragActive && index === total - 1 && overSlot === total && (
                  <DropIndicator position="bottom" />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={onAddClick}
              className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-line text-sm font-medium text-muted transition-all duration-150 hover:border-brand hover:bg-brand-subtle hover:text-brand-text"
            >
              <Plus className="size-4" />
              Tambah pertanyaan
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
