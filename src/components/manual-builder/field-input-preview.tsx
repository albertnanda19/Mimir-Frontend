import { Calendar, ChevronDown, Pen, Star, Upload } from "@mynaui/icons-react";
import type { DraftQuestion } from "@/types/ai-builder";

const boxClass =
  "flex h-10 w-full items-center rounded-md border border-line bg-surface px-3 text-sm text-faint";

export function FieldInputPreview({ question }: { question: DraftQuestion }) {
  switch (question.type) {
    case "short_text":
      return <div className={boxClass}>Jawaban singkat…</div>;
    case "email":
      return <div className={boxClass}>nama@email.com</div>;
    case "phone":
      return <div className={boxClass}>08xx xxxx xxxx</div>;
    case "number":
      return <div className={`${boxClass} max-w-40 justify-end font-mono`}>0</div>;
    case "paragraph":
      return (
        <div className="flex h-20 w-full items-start rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-faint">
          Jawaban panjang…
        </div>
      );
    case "multiple_choice":
      return (
        <div className="flex flex-col gap-2">
          {(question.options ?? []).map((option) => (
            <span key={option} className="flex items-center gap-2.5 text-sm text-muted">
              <span className="size-4 shrink-0 rounded-full border-[1.5px] border-line-strong" />
              {option}
            </span>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div className="flex flex-col gap-2">
          {(question.options ?? []).map((option) => (
            <span key={option} className="flex items-center gap-2.5 text-sm text-muted">
              <span className="size-4 shrink-0 rounded-[4px] border-[1.5px] border-line-strong" />
              {option}
            </span>
          ))}
        </div>
      );
    case "dropdown":
      return (
        <div className={`${boxClass} justify-between`}>
          {question.options?.[0] ?? "Pilih…"}
          <ChevronDown className="size-4" />
        </div>
      );
    case "likert":
      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((step) => (
              <span
                key={step}
                className="flex h-9 flex-1 max-w-14 items-center justify-center rounded-md border border-line bg-surface font-mono text-xs text-muted"
              >
                {step}
              </span>
            ))}
          </div>
          {question.scaleHint && <span className="font-mono text-[11px] text-faint">{question.scaleHint}</span>}
        </div>
      );
    case "rating":
      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <Star key={step} className="size-6 text-faint" />
            ))}
          </div>
          {question.scaleHint && <span className="font-mono text-[11px] text-faint">{question.scaleHint}</span>}
        </div>
      );
    case "date":
      return (
        <div className={`${boxClass} max-w-56 justify-between`}>
          Pilih tanggal
          <Calendar className="size-4" />
        </div>
      );
    case "file_upload":
      return (
        <div className="flex h-20 w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line bg-subtle text-faint">
          <Upload className="size-5" />
          <span className="text-xs">Seret file atau klik untuk unggah</span>
        </div>
      );
    case "signature":
      return (
        <div className="flex h-20 w-full flex-col items-center justify-center gap-1 rounded-md border border-line bg-surface text-faint">
          <Pen className="size-5" />
          <span className="text-xs">Tanda tangan di sini</span>
        </div>
      );
  }
}
