"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle, ChevronDown, ChevronUp, Clock4, FileText, GitBranch } from "@mynaui/icons-react";
import type { AnswerMap, AnswerValue } from "@/lib/respondent";
import { getPublicForm, isQuestionVisible, subscribeNoop } from "@/lib/respondent";
import { QuestionScreen } from "@/components/respondent/question-screen";

type Stage = "welcome" | "questions" | "done";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function RespondentView({ slug }: { slug: string }) {
  const form = useSyncExternalStore(subscribeNoop, () => getPublicForm(slug), () => null);
  const [stage, setStage] = useState<Stage>("welcome");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visible = form ? form.questions.filter((question) => isQuestionVisible(question, answers)) : [];
  const current = visible[Math.min(index, Math.max(visible.length - 1, 0))];
  const progress = stage === "done" ? 100 : stage === "welcome" ? 0 : Math.round((index / Math.max(visible.length, 1)) * 100);
  const estimatedMinutes = form ? Math.max(1, Math.ceil((form.questions.length * 15) / 60)) : 1;

  function handleAnswer(value: AnswerValue) {
    setError(null);
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  async function handleCommit() {
    if (isSubmitting || !current) return;
    const value = answers[current.id];
    const isEmpty = Array.isArray(value) ? value.length === 0 : !value?.trim();
    if (current.isRequired && isEmpty) {
      setError("Pertanyaan ini wajib diisi sebelum lanjut.");
      return;
    }
    setError(null);
    if (index < visible.length - 1) {
      setIndex(index + 1);
    } else {
      setIsSubmitting(true);
      await wait(900);
      setIsSubmitting(false);
      setStage("done");
    }
  }

  function handleBack() {
    setError(null);
    if (index > 0) setIndex(index - 1);
  }

  useEffect(() => {
    if (stage === "done") return;
    function handleKey(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.shiftKey) return;
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "BUTTON", "A"].includes(target.tagName)) return;
      event.preventDefault();
      if (stage === "welcome") {
        setStage("questions");
      } else {
        handleCommit();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  });

  if (!form) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-base">
        <div className="flex w-full max-w-xl flex-col gap-4 px-6">
          <div className="h-8 w-3/4 animate-pulse rounded-md bg-overlay" />
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-overlay" />
          <div className="mt-4 h-12 w-40 animate-pulse rounded-md bg-overlay" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-base">
      <div className="fixed inset-x-0 top-0 z-40 h-1 bg-overlay">
        <div
          className="h-full rounded-r-full bg-brand transition-[width] duration-500 ease-[var(--ease-enter)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        {stage === "welcome" && (
          <div className="flex w-full max-w-2xl flex-col items-start gap-6 animate-enter">
            <span className="flex size-12 items-center justify-center rounded-xl bg-brand text-white shadow-[var(--elevation-2)]">
              <GitBranch className="size-6" />
            </span>
            <div className="flex flex-col gap-2.5">
              <h1 className="font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
                {form.title}
              </h1>
              {form.description && (
                <p className="max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">{form.description}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-faint">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="size-4" />
                {form.questions.length} pertanyaan
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock4 className="size-4" />± {estimatedMinutes} menit
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStage("questions")}
                className="inline-flex h-13 cursor-pointer items-center rounded-md bg-brand px-7 text-base font-semibold text-white shadow-[var(--elevation-2)] transition-all duration-150 ease-[var(--ease-spring)] hover:bg-brand-hover hover:shadow-[var(--elevation-3)] active:scale-[0.97]"
              >
                Mulai
              </button>
              <span className="hidden text-xs text-faint sm:block">
                tekan <span className="font-mono font-semibold text-muted">Enter ↵</span>
              </span>
            </div>
          </div>
        )}

        {stage === "questions" && current && (
          <div
            className={`flex w-full max-w-2xl justify-start transition-opacity duration-300 ${
              isSubmitting ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <QuestionScreen
              key={current.id}
              question={current}
              number={index + 1}
              value={answers[current.id]}
              error={error}
              isLast={index === visible.length - 1}
              onChange={handleAnswer}
              onCommit={handleCommit}
            />
          </div>
        )}

        {stage === "done" && (
          <div className="flex w-full max-w-xl flex-col items-center gap-5 text-center animate-enter">
            <span className="flex size-16 items-center justify-center rounded-full bg-success-subtle text-success-text animate-pop">
              <CheckCircle className="size-9" />
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
                Jawabanmu sudah terkirim
              </h1>
              <p className="text-[15px] leading-relaxed text-muted">
                Terima kasih sudah meluangkan waktu. Kamu boleh menutup halaman ini.
              </p>
            </div>
            <Link
              href="/login"
              className="mt-2 inline-flex h-11 cursor-pointer items-center rounded-md border border-line bg-surface px-5 text-sm font-medium text-muted transition-all duration-150 hover:border-brand hover:text-brand-text"
            >
              Buat form-mu sendiri dengan Mimir
            </Link>
          </div>
        )}
      </main>

      <footer className="flex items-center justify-between px-6 pb-5 sm:px-10">
        <span className="inline-flex items-center gap-1.5 text-xs text-faint">
          <GitBranch className="size-3.5" />
          Ditenagai <span className="font-display font-medium text-muted">Mimir</span>
        </span>

        {stage === "questions" && (
          <div className="flex items-center gap-2">
            <span className="mr-1 font-mono text-xs text-faint">
              {index + 1} / {visible.length}
            </span>
            <button
              type="button"
              onClick={handleBack}
              disabled={index === 0}
              aria-label="Pertanyaan sebelumnya"
              className="flex size-9 cursor-pointer items-center justify-center rounded-md bg-brand text-white shadow-[var(--elevation-1)] transition-all duration-150 hover:bg-brand-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronUp className="size-5" />
            </button>
            <button
              type="button"
              onClick={handleCommit}
              aria-label="Pertanyaan berikutnya"
              className="flex size-9 cursor-pointer items-center justify-center rounded-md bg-brand text-white shadow-[var(--elevation-1)] transition-all duration-150 hover:bg-brand-hover active:scale-95"
            >
              <ChevronDown className="size-5" />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
