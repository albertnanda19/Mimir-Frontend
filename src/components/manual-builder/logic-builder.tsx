"use client";

import { GitBranch, Plus, X } from "@mynaui/icons-react";
import type { DraftQuestion, LogicOperator, LogicRule, QuestionLogic } from "@/types/ai-builder";
import { CHOICE_KINDS, OPERATOR_LABELS, SCALE_KINDS, createRule, needsValue, operatorsFor } from "@/lib/logic";
import { SelectField } from "@/components/ui/select-field";

const COMBINATORS = [
  { value: "and", label: "Semua terpenuhi (DAN)" },
  { value: "or", label: "Salah satu (ATAU)" },
] as const;

interface LogicBuilderProps {
  question: DraftQuestion;
  questions: DraftQuestion[];
  onChange: (logic: QuestionLogic | undefined) => void;
}

export function LogicBuilder({ question, questions, onChange }: LogicBuilderProps) {
  const sources = questions.filter((item) => item.id !== question.id);
  const logic = question.logic;
  const rules = logic?.rules ?? [];

  const sourceOptions = sources.map((source) => ({
    value: source.id,
    label: `${questions.indexOf(source) + 1}. ${source.label}`,
  }));

  function commitRules(nextRules: LogicRule[], combinator = logic?.combinator ?? "and") {
    onChange(nextRules.length === 0 ? undefined : { combinator, rules: nextRules });
  }

  function handleAddRule() {
    if (sources.length === 0) return;
    commitRules([...rules, createRule(sources[0])]);
  }

  function handlePatchRule(id: string, patch: Partial<LogicRule>) {
    commitRules(rules.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));
  }

  function handleSourceChange(rule: LogicRule, sourceId: string) {
    const source = sources.find((item) => item.id === sourceId);
    if (!source) return;
    handlePatchRule(rule.id, {
      questionId: sourceId,
      operator: operatorsFor(source.type)[0],
      value: CHOICE_KINDS.includes(source.type) ? (source.options?.[0] ?? "") : "",
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-1.5 text-[13px] font-medium tracking-[-0.01em] text-muted">
        <GitBranch className="size-3.5 text-accent-text" />
        Logika kondisional
      </span>

      {rules.length === 0 ? (
        <>
          <button
            type="button"
            disabled={sources.length === 0}
            onClick={handleAddRule}
            className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed border-line text-[13px] font-medium text-muted transition-all duration-150 hover:border-brand hover:bg-brand-subtle hover:text-brand-text disabled:cursor-default disabled:opacity-45 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-muted"
          >
            <Plus className="size-3.5" />
            Tambah aturan
          </button>
          <p className="text-xs leading-relaxed text-faint">
            {sources.length === 0
              ? "Butuh minimal satu pertanyaan lain sebagai sumber aturan."
              : "Tanpa aturan, pertanyaan ini selalu tampil untuk semua responden."}
          </p>
        </>
      ) : (
        <div className="flex flex-col gap-2 animate-enter">
          {rules.length > 1 && (
            <div className="flex rounded-md border border-line bg-subtle p-0.5">
              {COMBINATORS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => commitRules(rules, value)}
                  className={`flex-1 cursor-pointer rounded-[5px] px-2 py-1.5 text-xs font-medium transition-all duration-150 ${
                    (logic?.combinator ?? "and") === value
                      ? "bg-surface text-ink shadow-[var(--elevation-1)]"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {rules.map((rule, ruleIndex) => {
            const source = sources.find((item) => item.id === rule.questionId);
            return (
              <div
                key={rule.id}
                className="flex flex-col gap-2 rounded-lg border border-line bg-subtle p-2.5 animate-pop"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                    {ruleIndex === 0 ? "Jika" : logic?.combinator === "or" ? "Atau" : "Dan"}
                  </span>
                  <button
                    type="button"
                    onClick={() => commitRules(rules.filter((item) => item.id !== rule.id))}
                    aria-label={`Hapus aturan ${ruleIndex + 1}`}
                    className="flex size-6 cursor-pointer items-center justify-center rounded-md text-faint transition-colors duration-100 hover:bg-danger-subtle hover:text-danger-text"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                <SelectField
                  options={sourceOptions}
                  value={rule.questionId}
                  onChange={(sourceId) => handleSourceChange(rule, sourceId)}
                  ariaLabel="Pertanyaan sumber"
                  searchPlaceholder="Cari pertanyaan…"
                />

                {source && (
                  <>
                    <SelectField
                      options={operatorsFor(source.type).map((operator) => ({
                        value: operator,
                        label: OPERATOR_LABELS[operator],
                      }))}
                      value={rule.operator}
                      onChange={(operator) => handlePatchRule(rule.id, { operator: operator as LogicOperator })}
                      ariaLabel="Operator"
                      searchPlaceholder="Cari operator…"
                    />

                    {needsValue(rule.operator) &&
                      (CHOICE_KINDS.includes(source.type) && (source.options?.length ?? 0) > 0 ? (
                        <SelectField
                          options={(source.options ?? []).map((option) => ({ value: option, label: option }))}
                          value={rule.value}
                          onChange={(value) => handlePatchRule(rule.id, { value })}
                          ariaLabel="Nilai pembanding"
                          searchPlaceholder="Cari opsi…"
                        />
                      ) : (
                        <input
                          type="text"
                          inputMode={SCALE_KINDS.includes(source.type) ? "numeric" : "text"}
                          value={rule.value}
                          onChange={(event) => handlePatchRule(rule.id, { value: event.target.value })}
                          placeholder={SCALE_KINDS.includes(source.type) ? "Mis. 3" : "Nilai pembanding"}
                          aria-label="Nilai pembanding"
                          className={`h-9 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink outline-none transition-all duration-150 placeholder:text-faint hover:border-line-strong focus:border-brand focus:shadow-[0_0_0_3px_var(--brand-subtle)] ${
                            SCALE_KINDS.includes(source.type) ? "font-mono" : ""
                          }`}
                        />
                      ))}
                  </>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddRule}
            className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed border-line text-[13px] font-medium text-muted transition-all duration-150 hover:border-brand hover:bg-brand-subtle hover:text-brand-text"
          >
            <Plus className="size-3.5" />
            Tambah aturan
          </button>
          <p className="text-xs leading-relaxed text-faint">
            Pertanyaan ini hanya tampil jika aturan di atas terpenuhi.
          </p>
        </div>
      )}
    </div>
  );
}
