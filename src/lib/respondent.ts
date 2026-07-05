import type { DraftQuestion, FormDraft, QuestionLogic } from "@/types/ai-builder";
import { loadArchivedDrafts, loadDraft } from "@/lib/draft-store";

export type AnswerValue = string | string[];
export type AnswerMap = Record<string, AnswerValue>;

export function toSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 48) || "form-baru"
  );
}

function isAnswered(value: AnswerValue | undefined): boolean {
  return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
}

export function isQuestionVisible(question: DraftQuestion, answers: AnswerMap): boolean {
  const logic: QuestionLogic | undefined = question.logic;
  if (!logic || !Array.isArray(logic.rules) || logic.rules.length === 0) return true;
  const results = logic.rules.map((rule) => {
    const raw = answers[rule.questionId];
    switch (rule.operator) {
      case "filled":
        return isAnswered(raw);
      case "selected":
        return Array.isArray(raw) ? raw.includes(rule.value) : raw === rule.value;
      case "not_selected":
        return Array.isArray(raw) ? !raw.includes(rule.value) : raw !== rule.value;
      case "eq":
        return typeof raw === "string" && raw.trim() === rule.value.trim();
      case "gt":
      case "gte":
      case "lt":
      case "lte": {
        if (typeof raw !== "string" || raw.trim() === "") return false;
        const left = Number(raw);
        const right = Number(rule.value);
        if (Number.isNaN(left) || Number.isNaN(right)) return false;
        if (rule.operator === "gt") return left > right;
        if (rule.operator === "gte") return left >= right;
        if (rule.operator === "lt") return left < right;
        return left <= right;
      }
    }
  });
  return logic.combinator === "or" ? results.some(Boolean) : results.every(Boolean);
}

export const DEMO_FORM: FormDraft = {
  title: "Evaluasi Konser Senja 2026",
  description: "Terima kasih sudah hadir! Bantu kami jadi lebih baik lewat beberapa pertanyaan singkat.",
  questions: [
    { id: "p_name", type: "short_text", typeLabel: "Teks singkat", label: "Siapa namamu?", isRequired: true },
    { id: "p_email", type: "email", typeLabel: "Email", label: "Alamat email untuk info konser berikutnya", isRequired: false },
    {
      id: "p_overall",
      type: "rating",
      typeLabel: "Rating",
      label: "Bagaimana penilaianmu terhadap konser ini secara keseluruhan?",
      isRequired: true,
      scaleHint: "1 = Sangat buruk · 5 = Sangat luar biasa",
    },
    {
      id: "p_reason",
      type: "paragraph",
      typeLabel: "Paragraf",
      label: "Maaf mendengarnya — apa yang membuat pengalamanmu kurang menyenangkan?",
      isRequired: false,
      logic: { combinator: "and", rules: [{ id: "pr_1", questionId: "p_overall", operator: "lt", value: "3" }] },
    },
    {
      id: "p_sound",
      type: "likert",
      typeLabel: "Skala Likert",
      label: "Seberapa puas kamu dengan kualitas sound system?",
      isRequired: true,
      scaleHint: "Sangat tidak puas → Sangat puas",
    },
    {
      id: "p_artist",
      type: "multiple_choice",
      typeLabel: "Pilihan ganda",
      label: "Penampil mana yang paling berkesan untukmu?",
      isRequired: true,
      options: ["Penampil utama", "Band pembuka", "Penampil kolaborasi", "Semuanya berkesan"],
    },
    {
      id: "p_source",
      type: "checkbox",
      typeLabel: "Kotak centang",
      label: "Dari mana kamu tahu tentang konser ini?",
      isRequired: false,
      options: ["Instagram", "TikTok", "Rekomendasi teman", "Poster / baliho"],
    },
    {
      id: "p_next",
      type: "dropdown",
      typeLabel: "Dropdown",
      label: "Kota mana yang ingin kamu jadikan tuan rumah konser berikutnya?",
      isRequired: false,
      options: ["Jakarta", "Bandung", "Yogyakarta", "Surabaya", "Makassar"],
    },
    { id: "p_date", type: "date", typeLabel: "Tanggal", label: "Kapan kamu menghadiri konser ini?", isRequired: false },
    {
      id: "p_suggest",
      type: "paragraph",
      typeLabel: "Paragraf",
      label: "Ada saran untuk konser berikutnya?",
      isRequired: false,
    },
  ],
};

function resolvePublicForm(slug: string): FormDraft {
  const archived = loadArchivedDrafts().find((item) => toSlug(item.draft.title) === slug);
  if (archived && archived.draft.questions.length > 0) return archived.draft;
  const session = loadDraft();
  if (session && session.questions.length > 0 && toSlug(session.title) === slug) return session;
  return DEMO_FORM;
}

const publicFormCache = new Map<string, FormDraft>();

export function getPublicForm(slug: string): FormDraft {
  let form = publicFormCache.get(slug);
  if (!form) {
    form = resolvePublicForm(slug);
    publicFormCache.set(slug, form);
  }
  return form;
}

export function subscribeNoop(): () => void {
  return () => {};
}
