import type { DraftQuestion } from "@/types/ai-builder";
import type { FormSummary } from "@/types/form";
import { DUMMY_FORMS } from "@/lib/dashboard-data";
import { DEMO_FORM } from "@/lib/respondent";

export interface ResponseRow {
  id: string;
  submittedAtLabel: string;
  submittedAtMs: number;
  durationLabel: string;
  durationSec: number;
  answers: Record<string, string>;
  searchText: string;
}

export interface FormResponses {
  form: FormSummary;
  questions: DraftQuestion[];
  rows: ResponseRow[];
}

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const NOW_MS = new Date("2026-07-05T18:00:00").getTime();

const NAMES = [
  "Andi Pratama", "Sari Wulandari", "Budi Santoso", "Dewi Lestari", "Rizky Hidayat",
  "Putri Maharani", "Agus Setiawan", "Nina Kartika", "Fajar Nugroho", "Maya Anggraini",
  "Dimas Saputra", "Laila Rahma", "Yoga Prasetyo", "Intan Permata", "Hendra Wijaya",
  "Citra Ayu", "Bayu Ramadhan", "Tania Salsabila", "Eko Kurniawan", "Rina Marlina",
];

const FEEDBACK = [
  "Secara keseluruhan sudah bagus, pertahankan!",
  "Antrean masuk cukup panjang, semoga berikutnya lebih cepat.",
  "Sangat berkesan, tidak sabar menunggu edisi berikutnya.",
  "Sound di area belakang kurang terdengar jelas.",
  "Panitianya ramah dan sigap membantu.",
  "Harga makanan di venue terlalu mahal.",
  "Lokasi mudah dijangkau dan area parkir luas.",
  "Tolong tambah spot foto di area masuk.",
];

const DEFAULT_QUESTIONS: DraftQuestion[] = [
  { id: "q_name", type: "short_text", typeLabel: "Teks singkat", label: "Nama lengkap", isRequired: true },
  { id: "q_email", type: "email", typeLabel: "Email", label: "Alamat email", isRequired: true },
  {
    id: "q_rating", type: "rating", typeLabel: "Rating",
    label: "Penilaian keseluruhan", isRequired: true, scaleHint: "Skala 1–5",
  },
  {
    id: "q_aspect", type: "multiple_choice", typeLabel: "Pilihan ganda",
    label: "Aspek paling memuaskan", isRequired: true,
    options: ["Kualitas", "Pelayanan", "Kemudahan", "Harga"],
  },
  { id: "q_feedback", type: "paragraph", typeLabel: "Paragraf", label: "Masukan tambahan", isRequired: false },
];

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function pick<T>(random: () => number, pool: T[]): T {
  return pool[Math.floor(random() * pool.length)];
}

function toEmail(name: string): string {
  return `${name.toLowerCase().replace(/\s+/g, ".")}@mail.com`;
}

function formatSubmitted(ms: number): string {
  const date = new Date(ms);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()} · ${hh}.${mm}`;
}

function formatDuration(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return minutes > 0 ? `${minutes} mnt ${seconds} dtk` : `${seconds} dtk`;
}

function answerFor(random: () => number, question: DraftQuestion, name: string, rating: number): string {
  switch (question.type) {
    case "short_text":
      return question.label.toLowerCase().includes("nama") ? name : pick(random, FEEDBACK);
    case "email":
      return toEmail(name);
    case "phone":
      return `08${String(Math.floor(random() * 9000000000) + 1000000000)}`;
    case "number":
      return String(Math.floor(random() * 10) + 1);
    case "rating":
    case "likert":
      return String(rating);
    case "multiple_choice":
    case "dropdown":
      return pick(random, question.options ?? ["—"]);
    case "checkbox": {
      const options = question.options ?? [];
      const count = Math.max(1, Math.floor(random() * Math.min(2, options.length)) + 1);
      return [...options].sort(() => random() - 0.5).slice(0, count).join(", ");
    }
    case "paragraph":
      return random() < 0.35 ? "" : pick(random, FEEDBACK);
    case "date": {
      const date = new Date(NOW_MS - Math.floor(random() * 60) * 86400000);
      return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
    }
    case "file_upload":
      return random() < 0.4 ? "" : `foto-${Math.floor(random() * 900) + 100}.jpg`;
    case "signature":
      return name;
  }
}

function generateRows(formId: string, questions: DraftQuestion[], total: number): ResponseRow[] {
  const random = seeded(formId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 7));
  const rows: ResponseRow[] = [];
  for (let index = 0; index < total; index += 1) {
    const name = pick(random, NAMES);
    const rating = random() < 0.18 ? Math.ceil(random() * 2) : 3 + Math.floor(random() * 3);
    const submittedAtMs = NOW_MS - Math.floor(random() * 30 * 86400000);
    const durationSec = 25 + Math.floor(random() * 260);
    const answers: Record<string, string> = {};
    for (const question of questions) {
      answers[question.id] = question.logic
        ? rating < 3
          ? pick(random, FEEDBACK)
          : ""
        : answerFor(random, question, name, rating);
    }
    rows.push({
      id: `r_${formId}_${index}`,
      submittedAtLabel: formatSubmitted(submittedAtMs),
      submittedAtMs,
      durationLabel: formatDuration(durationSec),
      durationSec,
      answers,
      searchText: Object.values(answers).join(" ").toLowerCase(),
    });
  }
  return rows.sort((a, b) => b.submittedAtMs - a.submittedAtMs);
}

const cache = new Map<string, FormResponses>();

export function getFormResponses(formId: string): FormResponses {
  const cached = cache.get(formId);
  if (cached) return cached;
  const form =
    DUMMY_FORMS.find((item) => item.id === formId) ??
    ({ ...DUMMY_FORMS[0], id: formId } satisfies FormSummary);
  const questions = formId === "f_konser" ? DEMO_FORM.questions : DEFAULT_QUESTIONS;
  const result: FormResponses = {
    form,
    questions,
    rows: form.responses > 0 ? generateRows(formId, questions, Math.min(form.responses, 140)) : [],
  };
  cache.set(formId, result);
  return result;
}

export function subscribeNoop(): () => void {
  return () => {};
}
