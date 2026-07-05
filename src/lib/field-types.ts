import {
  Calendar,
  CheckSquare,
  ChevronDownCircle,
  Hash,
  List,
  ListNumber,
  Mail,
  Pen,
  Star,
  Telephone,
  TextAlignLeft,
  TextJustify,
  Upload,
} from "@mynaui/icons-react";
import type { DraftQuestion, DraftQuestionType, FormDraft } from "@/types/ai-builder";

export const TYPE_LABELS: Record<DraftQuestionType, string> = {
  short_text: "Teks singkat",
  paragraph: "Paragraf",
  email: "Email",
  phone: "Telepon",
  number: "Angka",
  multiple_choice: "Pilihan ganda",
  checkbox: "Kotak centang",
  dropdown: "Dropdown",
  likert: "Skala Likert",
  rating: "Rating",
  date: "Tanggal",
  file_upload: "Unggah file",
  signature: "Tanda tangan",
};

export const TYPE_ICONS: Record<DraftQuestionType, typeof List> = {
  short_text: TextAlignLeft,
  paragraph: TextJustify,
  email: Mail,
  phone: Telephone,
  number: Hash,
  multiple_choice: List,
  checkbox: CheckSquare,
  dropdown: ChevronDownCircle,
  likert: ListNumber,
  rating: Star,
  date: Calendar,
  file_upload: Upload,
  signature: Pen,
};

export const FIELD_GROUPS: { label: string; types: DraftQuestionType[] }[] = [
  { label: "Teks", types: ["short_text", "paragraph", "email", "phone", "number"] },
  { label: "Pilihan", types: ["multiple_choice", "checkbox", "dropdown", "likert", "rating"] },
  { label: "Lainnya", types: ["date", "file_upload", "signature"] },
];

export const CHOICE_TYPES: DraftQuestionType[] = ["multiple_choice", "checkbox", "dropdown"];

const DEFAULT_SCALE_HINTS: Partial<Record<DraftQuestionType, string>> = {
  likert: "Skala 1–5 · Sangat tidak setuju → Sangat setuju",
  rating: "Skala 1–5",
};

export function createQuestion(type: DraftQuestionType): DraftQuestion {
  return {
    id: `q_${crypto.randomUUID().slice(0, 8)}`,
    type,
    typeLabel: TYPE_LABELS[type],
    label: "Pertanyaan baru",
    isRequired: false,
    ...(CHOICE_TYPES.includes(type) ? { options: ["Opsi 1", "Opsi 2"] } : {}),
    ...(DEFAULT_SCALE_HINTS[type] ? { scaleHint: DEFAULT_SCALE_HINTS[type] } : {}),
  };
}

export function retypeQuestion(question: DraftQuestion, type: DraftQuestionType): DraftQuestion {
  return {
    ...question,
    type,
    typeLabel: TYPE_LABELS[type],
    options: CHOICE_TYPES.includes(type) ? (question.options ?? ["Opsi 1", "Opsi 2"]) : undefined,
    scaleHint: DEFAULT_SCALE_HINTS[type] ? (question.scaleHint ?? DEFAULT_SCALE_HINTS[type]) : undefined,
  };
}

export const EMPTY_DRAFT: FormDraft = {
  title: "Form tanpa judul",
  description: "",
  questions: [],
};
