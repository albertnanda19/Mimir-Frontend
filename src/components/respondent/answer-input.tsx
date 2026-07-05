"use client";

import { Check, CloudUpload, Star } from "@mynaui/icons-react";
import type { DraftQuestion } from "@/types/ai-builder";
import type { AnswerValue } from "@/lib/respondent";

const LETTERS = "ABCDEFGHIJ";

const flushClass =
  "w-full border-b-2 border-line bg-transparent pb-2 font-display text-xl font-medium text-ink outline-none transition-colors duration-150 placeholder:text-faint focus:border-brand sm:text-2xl";

interface AnswerInputProps {
  question: DraftQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  onCommit: () => void;
}

function OptionCard({
  label,
  letter,
  isSelected,
  isMulti,
  onClick,
}: {
  label: string;
  letter: string;
  isSelected: boolean;
  isMulti: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left text-[15px] font-medium transition-all duration-150 active:scale-[0.99] ${
        isSelected
          ? "border-brand bg-brand-subtle text-brand-text shadow-[0_0_0_1px_var(--brand-default)]"
          : "border-line bg-surface text-ink hover:border-brand hover:bg-brand-subtle"
      }`}
    >
      <span
        className={`flex size-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold ${
          isSelected ? "border-brand bg-brand text-white" : "border-line-strong bg-surface text-muted"
        }`}
      >
        {isSelected && isMulti ? <Check className="size-3.5" /> : letter}
      </span>
      {label}
    </button>
  );
}

export function AnswerInput({ question, value, onChange, onCommit }: AnswerInputProps) {
  switch (question.type) {
    case "short_text":
    case "email":
    case "phone":
    case "number":
    case "date": {
      const placeholders = {
        short_text: "Ketik jawabanmu di sini…",
        email: "nama@email.com",
        phone: "08xx xxxx xxxx",
        number: "Ketik angka…",
        date: "HH/BB/TTTT",
      } as const;
      const modes = { email: "email", phone: "tel", number: "decimal", date: "numeric" } as const;
      return (
        <input
          type="text"
          autoFocus
          inputMode={question.type === "short_text" ? undefined : modes[question.type]}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onCommit();
            }
          }}
          placeholder={placeholders[question.type]}
          aria-label={question.label}
          className={flushClass}
        />
      );
    }
    case "paragraph":
      return (
        <textarea
          autoFocus
          rows={3}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onCommit();
            }
          }}
          placeholder="Ketik jawabanmu di sini… (Shift+Enter untuk baris baru)"
          aria-label={question.label}
          className={`${flushClass} resize-none leading-relaxed`}
        />
      );
    case "multiple_choice":
    case "dropdown":
      return (
        <div className="flex w-full max-w-md flex-col gap-2">
          {(question.options ?? []).map((option, index) => (
            <OptionCard
              key={option}
              label={option}
              letter={LETTERS[index] ?? "•"}
              isSelected={value === option}
              isMulti={false}
              onClick={() => {
                onChange(option);
                setTimeout(onCommit, 300);
              }}
            />
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div className="flex w-full max-w-md flex-col gap-2">
          {(question.options ?? []).map((option, index) => {
            const selected = Array.isArray(value) ? value : [];
            const isSelected = selected.includes(option);
            return (
              <OptionCard
                key={option}
                label={option}
                letter={LETTERS[index] ?? "•"}
                isSelected={isSelected}
                isMulti
                onClick={() =>
                  onChange(
                    isSelected ? selected.filter((item) => item !== option) : [...selected, option],
                  )
                }
              />
            );
          })}
        </div>
      );
    case "likert":
      return (
        <div className="flex w-full max-w-md flex-col gap-2.5">
          <div className="flex gap-2">
            {["1", "2", "3", "4", "5"].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => {
                  onChange(step);
                  setTimeout(onCommit, 300);
                }}
                aria-pressed={value === step}
                className={`flex h-13 flex-1 cursor-pointer items-center justify-center rounded-lg border font-mono text-lg transition-all duration-150 active:scale-95 ${
                  value === step
                    ? "border-brand bg-brand text-white shadow-[var(--elevation-2)]"
                    : "border-line bg-surface text-ink hover:border-brand hover:bg-brand-subtle"
                }`}
              >
                {step}
              </button>
            ))}
          </div>
          {question.scaleHint && <p className="font-mono text-xs text-faint">{question.scaleHint}</p>}
        </div>
      );
    case "rating":
      return (
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-1.5">
            {["1", "2", "3", "4", "5"].map((step) => {
              const isLit = Number(value ?? 0) >= Number(step);
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => {
                    onChange(step);
                    setTimeout(onCommit, 300);
                  }}
                  aria-label={`${step} dari 5`}
                  className="cursor-pointer rounded-md p-1 transition-transform duration-150 ease-[var(--ease-spring)] hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`size-9 transition-colors duration-100 ${
                      isLit ? "fill-[var(--accent-default)] text-accent" : "text-faint"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          {question.scaleHint && <p className="font-mono text-xs text-faint">{question.scaleHint}</p>}
        </div>
      );
    case "file_upload": {
      const fileName = typeof value === "string" ? value : "";
      return (
        <label className="flex w-full max-w-md cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface px-6 py-10 text-center transition-all duration-150 hover:border-brand hover:bg-brand-subtle">
          <input
            type="file"
            className="sr-only"
            onChange={(event) => onChange(event.target.files?.[0]?.name ?? "")}
          />
          <CloudUpload className={`size-8 ${fileName ? "text-brand" : "text-faint"}`} />
          {fileName ? (
            <span className="text-sm font-medium text-brand-text">{fileName}</span>
          ) : (
            <>
              <span className="text-sm font-medium text-ink">Klik untuk pilih file</span>
              <span className="text-xs text-faint">Maks. 10MB</span>
            </>
          )}
        </label>
      );
    }
    case "signature":
      return (
        <div className="flex w-full max-w-md flex-col gap-3">
          <input
            type="text"
            autoFocus
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onCommit();
              }
            }}
            placeholder="Ketik nama lengkap sebagai tanda tangan"
            aria-label={question.label}
            className={flushClass}
          />
          <div className="flex h-24 items-center justify-center rounded-xl border border-line bg-subtle">
            {typeof value === "string" && value.trim() ? (
              <span className="font-display text-3xl italic tracking-wide text-ink">{value}</span>
            ) : (
              <span className="text-xs text-faint">Pratinjau tanda tangan muncul di sini</span>
            )}
          </div>
        </div>
      );
  }
}
