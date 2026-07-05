"use client";

import { useState } from "react";
import { Eye, Send } from "@mynaui/icons-react";
import type { DraftQuestion, DraftQuestionType, FormDraft } from "@/types/ai-builder";
import { createQuestion, retypeQuestion, EMPTY_DRAFT } from "@/lib/field-types";
import { loadDraft, saveDraft } from "@/lib/draft-store";
import { useBuilderChat } from "@/hooks/use-builder-chat";
import { ChatPanel } from "@/components/ai-builder/chat-panel";
import { FieldPalette } from "@/components/manual-builder/field-palette";
import { BuilderCanvas } from "@/components/manual-builder/builder-canvas";
import { QuestionSettingsPanel } from "@/components/manual-builder/question-settings-panel";
import { FormPreviewModal } from "@/components/manual-builder/form-preview-modal";
import { PublishDialog } from "@/components/manual-builder/publish-dialog";

export function ManualBuilderWorkspace() {
  const [draft, setDraft] = useState<FormDraft>(() => loadDraft() ?? EMPTY_DRAFT);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedPaletteType, setDraggedPaletteType] = useState<DraftQuestionType | null>(null);
  const [openDialog, setOpenDialog] = useState<"preview" | "publish" | null>(null);

  const selected = draft.questions.find((question) => question.id === selectedId) ?? null;

  function commit(next: FormDraft) {
    setDraft(next);
    saveDraft(next);
  }

  const chat = useBuilderChat(draft.questions.length > 0 ? draft : null, (next) => {
    commit(next);
    setSelectedId(null);
  });

  function handleInsert(type: DraftQuestionType, at: number) {
    const question = createQuestion(type);
    const questions = [...draft.questions];
    questions.splice(at, 0, question);
    commit({ ...draft, questions });
    setSelectedId(question.id);
  }

  function handleReorder(from: number, to: number) {
    if (from === to || to < 0 || to >= draft.questions.length) return;
    const questions = [...draft.questions];
    const [moved] = questions.splice(from, 1);
    questions.splice(to, 0, moved);
    commit({ ...draft, questions });
  }

  function handleDuplicate(id: string) {
    const index = draft.questions.findIndex((question) => question.id === id);
    if (index === -1) return;
    const source = draft.questions[index];
    const copy: DraftQuestion = {
      ...source,
      id: `q_${crypto.randomUUID().slice(0, 8)}`,
      options: source.options ? [...source.options] : undefined,
      logic: source.logic
        ? {
            ...source.logic,
            rules: source.logic.rules.map((rule) => ({
              ...rule,
              id: `r_${crypto.randomUUID().slice(0, 8)}`,
            })),
          }
        : undefined,
    };
    const questions = [...draft.questions];
    questions.splice(index + 1, 0, copy);
    commit({ ...draft, questions });
    setSelectedId(copy.id);
  }

  function handleDelete(id: string) {
    const questions = draft.questions
      .filter((question) => question.id !== id)
      .map((question) => {
        if (!question.logic) return question;
        const rules = question.logic.rules.filter((rule) => rule.questionId !== id);
        if (rules.length === question.logic.rules.length) return question;
        return { ...question, logic: rules.length > 0 ? { ...question.logic, rules } : undefined };
      });
    commit({ ...draft, questions });
    if (selectedId === id) setSelectedId(null);
  }

  function handleUpdate(patch: Partial<DraftQuestion>) {
    if (!selectedId) return;
    commit({
      ...draft,
      questions: draft.questions.map((question) =>
        question.id === selectedId ? { ...question, ...patch } : question,
      ),
    });
  }

  function handleRetype(type: DraftQuestionType) {
    if (!selectedId) return;
    commit({
      ...draft,
      questions: draft.questions.map((question) =>
        question.id === selectedId ? retypeQuestion(question, type) : question,
      ),
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-4 animate-enter lg:min-h-0">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpenDialog("preview")}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-medium text-muted transition-all duration-150 hover:border-line-strong hover:text-ink active:scale-[0.98]"
        >
          <Eye className="size-4" />
          Pratinjau
        </button>
        <button
          type="button"
          disabled={draft.questions.length === 0}
          onClick={() => setOpenDialog("publish")}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-brand px-4 text-sm font-medium text-white shadow-[var(--elevation-1)] transition-all duration-150 hover:bg-brand-hover hover:shadow-[var(--elevation-2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Send className="size-4" />
          Publikasikan
        </button>
      </div>

      <div className="grid flex-1 gap-4 lg:min-h-0 lg:grid-cols-[280px_220px_minmax(0,1fr)_260px] xl:grid-cols-[340px_240px_minmax(0,1fr)_300px]">
        <ChatPanel
          messages={chat.messages}
          isThinking={chat.isThinking}
          isBusy={chat.isBusy}
          onSend={chat.send}
        />
        <FieldPalette
          onAdd={(type) => handleInsert(type, draft.questions.length)}
          onDragStart={setDraggedPaletteType}
          onDragEnd={() => setDraggedPaletteType(null)}
        />
        <BuilderCanvas
          draft={draft}
          selectedId={selectedId}
          draggedPaletteType={draggedPaletteType}
          onSelect={setSelectedId}
          onTitleChange={(title) => commit({ ...draft, title })}
          onDescriptionChange={(description) => commit({ ...draft, description })}
          onReorder={handleReorder}
          onInsert={handleInsert}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onAddClick={() => handleInsert("short_text", draft.questions.length)}
        />
        <QuestionSettingsPanel
          question={selected}
          questions={draft.questions}
          onUpdate={handleUpdate}
          onRetype={handleRetype}
        />
      </div>

      {openDialog === "preview" && <FormPreviewModal draft={draft} onClose={() => setOpenDialog(null)} />}
      {openDialog === "publish" && <PublishDialog draft={draft} onClose={() => setOpenDialog(null)} />}
    </div>
  );
}
