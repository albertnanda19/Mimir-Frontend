"use client";

import { Clock4, Send } from "@mynaui/icons-react";
import type { DraftQuestion } from "@/types/ai-builder";
import type { ResponseRow } from "@/lib/responses-data";
import { Modal } from "@/components/ui/modal";
import { TYPE_ICONS } from "@/lib/field-types";

interface ResponseDetailModalProps {
  row: ResponseRow;
  number: number;
  questions: DraftQuestion[];
  onClose: () => void;
}

export function ResponseDetailModal({ row, number, questions, onClose }: ResponseDetailModalProps) {
  return (
    <Modal title={`Respons #${number}`} onClose={onClose} maxWidthClass="max-w-lg">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 rounded-lg bg-subtle px-4 py-3 text-[13px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Send className="size-3.5 text-faint" />
            {row.submittedAtLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock4 className="size-3.5 text-faint" />
            Durasi {row.durationLabel}
          </span>
        </div>

        {questions.map((question, index) => {
          const TypeIcon = TYPE_ICONS[question.type];
          const answer = row.answers[question.id];
          return (
            <div
              key={question.id}
              style={{ animationDelay: `${Math.min(index * 40, 280)}ms` }}
              className="flex flex-col gap-1.5 animate-enter"
            >
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
                <TypeIcon className="size-3.5 shrink-0 text-faint" />
                {question.label}
              </span>
              {answer ? (
                <p className="rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-ink">
                  {answer}
                </p>
              ) : (
                <p className="rounded-md border border-dashed border-line px-3.5 py-2.5 text-sm text-faint">
                  Tidak dijawab
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
