import {
  Calendar,
  CheckSquare,
  GitBranch,
  List,
  ListNumber,
  Star,
  TextAlignLeft,
  TextJustify,
  Upload,
} from "@mynaui/icons-react";
import type { DraftQuestion, DraftQuestionType } from "@/types/ai-builder";

const TYPE_ICONS: Record<DraftQuestionType, typeof List> = {
  short_text: TextAlignLeft,
  paragraph: TextJustify,
  multiple_choice: List,
  checkbox: CheckSquare,
  likert: ListNumber,
  rating: Star,
  date: Calendar,
  file_upload: Upload,
};

interface QuestionPreviewCardProps {
  question: DraftQuestion;
  index: number;
}

export function QuestionPreviewCard({ question, index }: QuestionPreviewCardProps) {
  const TypeIcon = TYPE_ICONS[question.type];

  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className="flex flex-col gap-3 rounded-lg border border-line bg-subtle p-4 transition-all duration-200 animate-enter hover:border-line-strong hover:bg-surface hover:shadow-[var(--elevation-1)]"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-overlay font-mono text-xs text-muted">
          {index + 1}
        </span>
        <p className="flex-1 text-sm font-medium leading-snug text-ink">{question.label}</p>
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
