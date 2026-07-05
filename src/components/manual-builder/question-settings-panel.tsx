"use client";

import { Cog, Plus, X } from "@mynaui/icons-react";
import type { DraftQuestion, DraftQuestionType, QuestionLogic } from "@/types/ai-builder";
import { CHOICE_TYPES, FIELD_GROUPS, TYPE_LABELS } from "@/lib/field-types";
import { SelectField } from "@/components/ui/select-field";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { LogicBuilder } from "@/components/manual-builder/logic-builder";

const TYPE_OPTIONS = FIELD_GROUPS.flatMap((group) =>
  group.types.map((type) => ({ value: type, label: TYPE_LABELS[type] })),
);

const SCALE_TYPES: DraftQuestionType[] = ["likert", "rating"];

interface QuestionSettingsPanelProps {
  question: DraftQuestion | null;
  questions: DraftQuestion[];
  onUpdate: (patch: Partial<DraftQuestion>) => void;
  onRetype: (type: DraftQuestionType) => void;
}

export function QuestionSettingsPanel({
  question,
  questions,
  onUpdate,
  onRetype,
}: QuestionSettingsPanelProps) {
  return (
    <aside
      aria-label="Pengaturan pertanyaan"
      className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elevation-1)] lg:h-full"
    >
      <header className="flex items-center gap-2.5 border-b border-line-subtle px-4 py-3">
        <Cog className="size-[18px] text-faint" />
        <h2 className="font-display text-[15px] font-medium tracking-[-0.01em] text-ink">Pengaturan</h2>
      </header>

      {!question ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-overlay text-faint">
            <Cog className="size-5" />
          </span>
          <p className="max-w-[13rem] text-[13px] leading-relaxed text-muted">
            Pilih pertanyaan di kanvas untuk mengatur label, tipe, dan logikanya.
          </p>
        </div>
      ) : (
        <div key={question.id} className="scrollbar-slim flex flex-1 flex-col gap-5 overflow-y-auto p-4 animate-enter">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium tracking-[-0.01em] text-muted">Pertanyaan</span>
            <textarea
              rows={2}
              value={question.label}
              onChange={(event) => onUpdate({ label: event.target.value })}
              className="scrollbar-slim w-full resize-none rounded-md border border-line bg-surface px-3 py-2.5 text-sm leading-snug text-ink outline-none transition-all duration-150 placeholder:text-faint hover:border-line-strong focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-subtle)]"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium tracking-[-0.01em] text-muted">Tipe pertanyaan</span>
            <SelectField
              options={TYPE_OPTIONS}
              value={question.type}
              onChange={(value) => onRetype(value as DraftQuestionType)}
              ariaLabel="Tipe pertanyaan"
              searchPlaceholder="Cari tipe…"
            />
          </div>

          <ToggleSwitch
            label="Wajib diisi"
            checked={question.isRequired}
            onChange={(isRequired) => onUpdate({ isRequired })}
          />

          {CHOICE_TYPES.includes(question.type) && (
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-medium tracking-[-0.01em] text-muted">Opsi jawaban</span>
              {(question.options ?? []).map((option, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={option}
                    onChange={(event) => {
                      const options = [...(question.options ?? [])];
                      options[index] = event.target.value;
                      onUpdate({ options });
                    }}
                    aria-label={`Opsi ${index + 1}`}
                    className="h-9 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink outline-none transition-all duration-150 hover:border-line-strong focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-subtle)]"
                  />
                  <button
                    type="button"
                    disabled={(question.options ?? []).length <= 1}
                    onClick={() =>
                      onUpdate({ options: (question.options ?? []).filter((_, i) => i !== index) })
                    }
                    aria-label={`Hapus opsi ${index + 1}`}
                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-100 hover:bg-danger-subtle hover:text-danger-text disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-faint"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  onUpdate({ options: [...(question.options ?? []), `Opsi ${(question.options ?? []).length + 1}`] })
                }
                className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed border-line text-[13px] font-medium text-muted transition-all duration-150 hover:border-brand hover:bg-brand-subtle hover:text-brand-text"
              >
                <Plus className="size-3.5" />
                Tambah opsi
              </button>
            </div>
          )}

          {SCALE_TYPES.includes(question.type) && (
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium tracking-[-0.01em] text-muted">Keterangan skala</span>
              <input
                type="text"
                value={question.scaleHint ?? ""}
                onChange={(event) => onUpdate({ scaleHint: event.target.value })}
                placeholder="Mis. Skala 1–5 · Buruk → Sangat baik"
                className="h-9 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink outline-none transition-all duration-150 placeholder:text-faint hover:border-line-strong focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-subtle)]"
              />
            </label>
          )}

          <LogicBuilder
            question={question}
            questions={questions}
            onChange={(logic: QuestionLogic | undefined) => onUpdate({ logic })}
          />
        </div>
      )}
    </aside>
  );
}
