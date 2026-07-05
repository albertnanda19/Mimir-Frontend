"use client";

import { useState } from "react";
import {
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronDownCircle,
  ChevronUp,
  GitBranch,
  Hash,
  List,
  ListNumber,
  Mail,
  Menu,
  Pen,
  Star,
  Telephone,
  TextAlignLeft,
  TextJustify,
  Upload,
} from "@mynaui/icons-react";
import type { DraftQuestion, DraftQuestionType } from "@/types/ai-builder";

const TYPE_ICONS: Record<DraftQuestionType, typeof List> = {
  short_text: TextAlignLeft,
  paragraph: TextJustify,
  email: Mail,
  phone: Telephone,
  number: Hash,
  multiple_choice: List,
  checkbox: CheckSquare,
  dropdown: ChevronDownCircle,
  likert: ListNumber,
  rating: Star,
  date: Calendar,
  file_upload: Upload,
  signature: Pen,
};

interface QuestionPreviewCardProps {
  question: DraftQuestion;
  index: number;
  total: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMove: (from: number, to: number) => void;
}

export function QuestionPreviewCard({
  question,
  index,
  total,
  isDragging,
  onDragStart,
  onDragEnd,
  onMove,
}: QuestionPreviewCardProps) {
  const [animationDelay] = useState(() => `${Math.min(index * 60, 420)}ms`);
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
      style={{ animationDelay }}
      className={`group flex cursor-grab flex-col gap-3 rounded-lg border border-line bg-subtle p-4 transition-all duration-200 animate-enter active:cursor-grabbing hover:border-line-strong hover:bg-surface hover:shadow-[var(--elevation-1)] ${
        isDragging ? "scale-[0.99] border-dashed border-brand opacity-40" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-overlay font-mono text-xs text-muted">
          {index + 1}
        </span>
        <p className="flex-1 text-sm font-medium leading-snug text-ink">{question.label}</p>
        <div className="flex shrink-0 items-center gap-0.5 transition-opacity duration-150 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
            aria-label="Pindahkan pertanyaan ke atas"
            className="flex size-6 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-100 hover:bg-overlay hover:text-ink disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-faint"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(index, index + 1)}
            aria-label="Pindahkan pertanyaan ke bawah"
            className="flex size-6 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-100 hover:bg-overlay hover:text-ink disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-faint"
          >
            <ChevronDown className="size-4" />
          </button>
          <span aria-hidden className="flex size-6 items-center justify-center text-faint">
            <Menu className="size-3.5" />
          </span>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            question.isRequired ? "bg-brand-subtle text-brand-text" : "bg-overlay text-muted"
          }`}
        >
          {question.isRequired ? "Wajib" : "Opsional"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pl-9">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <TypeIcon className="size-3.5 text-faint" />
          {question.typeLabel}
        </span>
        {question.scaleHint && <span className="font-mono text-[11px] text-faint">{question.scaleHint}</span>}
      </div>

      {question.options && (
        <div className="flex flex-wrap gap-1.5 pl-9">
          {question.options.map((option) => (
            <span
              key={option}
              className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs text-muted"
            >
              {option}
            </span>
          ))}
        </div>
      )}

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
