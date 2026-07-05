"use client";

import { ArrowRight } from "@mynaui/icons-react";
import type { DraftQuestion } from "@/types/ai-builder";
import type { AnswerValue } from "@/lib/respondent";
import { AnswerInput } from "@/components/respondent/answer-input";

interface QuestionScreenProps {
  question: DraftQuestion;
  number: number;
  value: AnswerValue | undefined;
  error: string | null;
  isLast: boolean;
  onChange: (value: AnswerValue) => void;
  onCommit: () => void;
}

export function QuestionScreen({
  question,
  number,
  value,
  error,
  isLast,
  onChange,
  onCommit,
}: QuestionScreenProps) {
  return (
    <div key={question.id} className="flex w-full max-w-2xl flex-col gap-7 animate-enter">
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 font-mono text-sm text-brand">
          {number}
          <ArrowRight className="size-3.5" />
        </span>
        <h1 className="font-display text-2xl font-medium leading-snug tracking-[-0.015em] text-ink sm:text-3xl">
          {question.label}
          {question.isRequired && <span className="ml-1.5 text-danger-text">*</span>}
        </h1>
        {!question.isRequired && <p className="text-sm text-faint">Opsional — boleh dilewati.</p>}
      </div>

      <AnswerInput question={question} value={value} onChange={onChange} onCommit={onCommit} />

      {error && (
        <p className="rounded-md bg-danger-subtle px-3.5 py-2.5 text-sm font-medium text-danger-text animate-pop">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCommit}
          className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-md bg-brand px-6 text-[15px] font-semibold text-white shadow-[var(--elevation-2)] transition-all duration-150 ease-[var(--ease-spring)] hover:bg-brand-hover hover:shadow-[var(--elevation-3)] active:scale-[0.97]"
        >
          {isLast ? "Kirim jawaban" : "Lanjut"}
        </button>
        <span className="hidden text-xs text-faint sm:block">
          atau tekan <span className="font-mono font-semibold text-muted">Enter ↵</span>
        </span>
      </div>
    </div>
  );
}
