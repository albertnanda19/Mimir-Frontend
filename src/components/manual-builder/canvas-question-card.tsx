"use client";

import { ChevronDown, ChevronUp, Copy, GitBranch, Menu, Trash } from "@mynaui/icons-react";
import type { DraftQuestion } from "@/types/ai-builder";
import { TYPE_ICONS } from "@/lib/field-types";
import { FieldInputPreview } from "@/components/manual-builder/field-input-preview";

interface CanvasQuestionCardProps {
  question: DraftQuestion;
  index: number;
  total: number;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMove: (from: number, to: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function CanvasQuestionCard({
  question,
  index,
  total,
  isSelected,
  isDragging,
  onSelect,
  onDragStart,
  onDragEnd,
  onMove,
  onDuplicate,
  onDelete,
}: CanvasQuestionCardProps) {
  const TypeIcon = TYPE_ICONS[question.type];

  function handleDragStart(event: React.DragEvent<HTMLElement>) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", question.id);
    onDragStart();
  }

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      className={`group flex cursor-grab flex-col gap-3 rounded-lg border bg-surface p-4 transition-all duration-200 animate-enter active:cursor-grabbing ${
        isDragging
          ? "scale-[0.99] border-dashed border-brand opacity-40"
          : isSelected
            ? "border-brand shadow-[0_0_0_3px_var(--brand-subtle)]"
            : "border-line hover:border-line-strong hover:shadow-[var(--elevation-1)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-overlay font-mono text-xs text-muted">
          {index + 1}
        </span>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-sm font-medium leading-snug text-ink">
            {question.label}
            {question.isRequired && <span className="ml-1 text-danger-text">*</span>}
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <TypeIcon className="size-3.5 text-faint" />
            {question.typeLabel}
          </span>
        </div>
        <div
          className="flex shrink-0 items-center gap-0.5 transition-opacity duration-150 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
            aria-label="Pindahkan pertanyaan ke atas"
            className="flex size-7 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-100 hover:bg-overlay hover:text-ink disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-faint"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(index, index + 1)}
            aria-label="Pindahkan pertanyaan ke bawah"
            className="flex size-7 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-100 hover:bg-overlay hover:text-ink disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-faint"
          >
            <ChevronDown className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            aria-label="Duplikat pertanyaan"
            className="flex size-7 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-100 hover:bg-overlay hover:text-ink"
          >
            <Copy className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Hapus pertanyaan"
            className="flex size-7 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-100 hover:bg-danger-subtle hover:text-danger-text"
          >
            <Trash className="size-4" />
          </button>
          <span aria-hidden className="flex size-7 items-center justify-center text-faint">
            <Menu className="size-3.5" />
          </span>
        </div>
      </div>

      <div className="pl-9">
        <FieldInputPreview question={question} />
      </div>

      {question.logic && (
        <div className="ml-9 flex items-start gap-2 rounded-md bg-accent-subtle px-3 py-2">
          <GitBranch className="mt-0.5 size-3.5 shrink-0 text-accent-text" />
          <p className="text-xs leading-relaxed text-accent-text">
            <span className="font-semibold">Logika kondisional · </span>
            {question.logic}
          </p>
        </div>
      )}
    </article>
  );
}
