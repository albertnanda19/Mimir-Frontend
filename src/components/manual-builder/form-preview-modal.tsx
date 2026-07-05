"use client";

import { GitBranch } from "@mynaui/icons-react";
import type { FormDraft } from "@/types/ai-builder";
import { formatLogic } from "@/lib/logic";
import { Modal } from "@/components/ui/modal";
import { FieldInputPreview } from "@/components/manual-builder/field-input-preview";

interface FormPreviewModalProps {
  draft: FormDraft;
  onClose: () => void;
}

export function FormPreviewModal({ draft, onClose }: FormPreviewModalProps) {
  return (
    <Modal title="Pratinjau form" onClose={onClose} maxWidthClass="max-w-2xl">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <div className="flex flex-col gap-1.5 border-b border-line-subtle pb-5">
          <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{draft.title}</h3>
          {draft.description && <p className="text-sm leading-relaxed text-muted">{draft.description}</p>}
        </div>

        {draft.questions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">Belum ada pertanyaan untuk dipratinjau.</p>
        ) : (
          draft.questions.map((question, index) => {
            const logicText = formatLogic(question.logic, draft.questions);
            return (
            <div
              key={question.id}
              style={{ animationDelay: `${Math.min(index * 50, 350)}ms` }}
              className="flex flex-col gap-2.5 animate-enter"
            >
              <p className="text-sm font-medium leading-snug text-ink">
                <span className="mr-1.5 font-mono text-xs text-faint">{index + 1}.</span>
                {question.label}
                {question.isRequired && <span className="ml-1 text-danger-text">*</span>}
              </p>
              <FieldInputPreview question={question} />
              {logicText && (
                <p className="flex items-center gap-1.5 text-xs text-accent-text">
                  <GitBranch className="size-3.5" />
                  {logicText}
                </p>
              )}
            </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}
