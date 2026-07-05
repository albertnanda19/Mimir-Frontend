import type {
  BuilderReply,
  DraftQuestion,
  DraftQuestionType,
  FormDraft,
} from "@/types/ai-builder";

const TYPE_LABELS: Record<DraftQuestionType, string> = {
  short_text: "Teks singkat",
  paragraph: "Paragraf",
  multiple_choice: "Pilihan ganda",
  checkbox: "Kotak centang",
  likert: "Skala Likert",
  rating: "Rating",
  date: "Tanggal",
  file_upload: "Unggah file",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function question(
  id: string,
  type: DraftQuestionType,
  label: string,
  extras: Partial<Omit<DraftQuestion, "id" | "type" | "typeLabel" | "label">> = {},
): DraftQuestion {
  return { id, type, typeLabel: TYPE_LABELS[type], label, isRequired: true, ...extras };
}

interface Scenario {
  keywords: string[];
  reply: string;
  note?: string;
  draft: FormDraft;
}

const SCENARIOS: Scenario[] = [
  {
    keywords: ["konser", "musik", "festival", "pentas", "panggung"],
    reply:
      "Siap! Aku menyusun draft “Evaluasi Konser Musik” berisi 7 pertanyaan yang mencakup penilaian keseluruhan, sound system, tiket, dan penampil. Aku juga memasang satu logika kondisional — jika penilaian keseluruhan di bawah 3, responden diminta menjelaskan alasannya. Cek panel pratinjau, lalu lanjutkan ke Manual Builder untuk menyempurnakannya.",
    note: "Skala Likert 1–5 kupakai untuk aspek spesifik seperti sound system karena lebih konsisten dimaknai responden dibanding skala 1–10.",
    draft: {
      title: "Evaluasi Konser Musik",
      description: "Bantu kami memahami pengalamanmu selama konser berlangsung.",
      questions: [
        question("q_overall", "rating", "Bagaimana penilaianmu terhadap konser ini secara keseluruhan?", {
          scaleHint: "Skala 1–5 · 1 = Sangat buruk · 5 = Sangat luar biasa",
        }),
        question("q_reason", "paragraph", "Apa yang membuat pengalamanmu kurang menyenangkan?", {
          isRequired: false,
          logic: "Tampil hanya jika penilaian keseluruhan kurang dari 3",
        }),
        question("q_sound", "likert", "Seberapa puas kamu dengan kualitas sound system?", {
          scaleHint: "Skala 1–5 · Sangat tidak puas → Sangat puas",
        }),
        question("q_ticket", "likert", "Seberapa lancar proses pembelian tiket dan antrean masuk?", {
          scaleHint: "Skala 1–5 · Sangat tidak lancar → Sangat lancar",
        }),
        question("q_artist", "multiple_choice", "Penampil mana yang paling berkesan untukmu?", {
          options: ["Penampil utama", "Band pembuka", "Penampil kolaborasi", "Semuanya berkesan"],
        }),
        question("q_source", "checkbox", "Dari mana kamu tahu tentang konser ini?", {
          isRequired: false,
          options: ["Instagram", "TikTok", "Rekomendasi teman", "Poster / baliho"],
        }),
        question("q_suggest", "paragraph", "Apa saranmu untuk konser berikutnya?", { isRequired: false }),
      ],
    },
  },
  {
    keywords: ["karyawan", "kepuasan kerja", "pegawai", "hr ", "internal", "kantor"],
    reply:
      "Draft “Survei Kepuasan Karyawan” sudah siap — 6 pertanyaan dengan format eNPS standar industri. Ada satu logika kondisional: karyawan yang memberi skor rekomendasi 6 atau kurang akan diminta menyebutkan hal yang paling perlu diperbaiki. Silakan review di panel pratinjau.",
    note: "Survei internal sebaiknya anonim — aku sengaja tidak menambahkan pertanyaan nama atau email agar jawaban lebih jujur.",
    draft: {
      title: "Survei Kepuasan Karyawan",
      description: "Survei anonim untuk memahami pengalaman kerja tim. Jawabanmu tidak dikaitkan dengan identitas.",
      questions: [
        question("q_dept", "multiple_choice", "Di departemen mana kamu bekerja?", {
          options: ["Operasional", "Pemasaran", "Teknologi", "Keuangan", "SDM"],
        }),
        question("q_valued", "likert", "Aku merasa dihargai atas kontribusiku di perusahaan ini.", {
          scaleHint: "Skala 1–5 · Sangat tidak setuju → Sangat setuju",
        }),
        question("q_balance", "likert", "Aku bisa menjaga keseimbangan antara pekerjaan dan kehidupan pribadi.", {
          scaleHint: "Skala 1–5 · Sangat tidak setuju → Sangat setuju",
        }),
        question("q_enps", "rating", "Seberapa besar kemungkinan kamu merekomendasikan perusahaan ini sebagai tempat kerja?", {
          scaleHint: "Skala 0–10 (eNPS)",
        }),
        question("q_improve", "paragraph", "Apa satu hal yang paling perlu diperbaiki?", {
          isRequired: false,
          logic: "Tampil hanya jika skor rekomendasi 6 atau kurang",
        }),
        question("q_aspect", "checkbox", "Aspek mana yang paling memengaruhi kepuasanmu?", {
          isRequired: false,
          options: ["Kompensasi", "Jenjang karier", "Lingkungan tim", "Fleksibilitas kerja"],
        }),
      ],
    },
  },
  {
    keywords: ["webinar", "pendaftaran", "daftar", "workshop", "seminar", "acara"],
    reply:
      "Form “Pendaftaran Webinar” sudah kususun — 7 pertanyaan ringkas supaya calon peserta cepat selesai mendaftar. Aku menambahkan logika kondisional: kolom nama organisasi hanya muncul untuk pendaftar yang mewakili organisasi. Review strukturnya di panel pratinjau.",
    note: "Form pendaftaran sebaiknya di bawah 10 pertanyaan — makin pendek, makin tinggi completion rate-nya.",
    draft: {
      title: "Pendaftaran Webinar",
      description: "Isi data berikut untuk mengamankan kursimu. Tautan webinar dikirim lewat email.",
      questions: [
        question("q_name", "short_text", "Nama lengkap"),
        question("q_email", "short_text", "Alamat email aktif"),
        question("q_session", "multiple_choice", "Pilih sesi yang ingin kamu ikuti", {
          options: ["Sesi pagi · 09.00 WIB", "Sesi siang · 13.00 WIB", "Sesi malam · 19.00 WIB"],
        }),
        question("q_topics", "checkbox", "Topik apa yang paling ingin kamu dengar?", {
          isRequired: false,
          options: ["Studi kasus", "Live demo", "Tanya jawab", "Tren industri"],
        }),
        question("q_as", "multiple_choice", "Kamu mendaftar sebagai?", {
          options: ["Individu", "Perwakilan organisasi"],
        }),
        question("q_org", "short_text", "Nama organisasi / instansi", {
          isRequired: false,
          logic: "Tampil hanya jika mendaftar sebagai perwakilan organisasi",
        }),
        question("q_record", "multiple_choice", "Ingin menerima rekaman webinar?", {
          options: ["Ya, kirimkan", "Tidak perlu"],
        }),
      ],
    },
  },
];

function toTitle(prompt: string): string {
  const cleaned = prompt
    .replace(/^(tolong\s+)?(buatkan|buatlah|bikinkan|buat|bikin)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
  const capped = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return capped.length > 64 ? `${capped.slice(0, 64).trimEnd()}…` : capped;
}

function genericDraft(prompt: string): FormDraft {
  return {
    title: toTitle(prompt) || "Form baru",
    description: "Draft awal hasil generasi Mimir — sesuaikan pertanyaannya sesuai kebutuhanmu.",
    questions: [
      question("q_name", "short_text", "Nama lengkap"),
      question("q_overall", "rating", "Bagaimana penilaianmu secara keseluruhan?", {
        scaleHint: "Skala 1–5 · 1 = Sangat buruk · 5 = Sangat baik",
      }),
      question("q_reason", "paragraph", "Ceritakan alasan di balik penilaianmu", {
        isRequired: false,
        logic: "Tampil hanya jika penilaian keseluruhan kurang dari 3",
      }),
      question("q_aspects", "checkbox", "Aspek apa saja yang ingin kamu soroti?", {
        isRequired: false,
        options: ["Kualitas", "Pelayanan", "Kemudahan", "Lainnya"],
      }),
      question("q_feedback", "paragraph", "Masukan tambahan", { isRequired: false }),
    ],
  };
}

export const SUGGESTION_PROMPTS = [
  "Buatkan kuesioner evaluasi konser musik, tanyakan soal sound system, tiket, dan artis",
  "Survei kepuasan karyawan dengan skala Likert, kalau skornya rendah tanyakan alasannya",
  "Form pendaftaran webinar dengan pilihan sesi dan topik yang diminati",
];

export async function generateBuilderReply(
  prompt: string,
  existing: FormDraft | null,
): Promise<BuilderReply> {
  await wait(1400 + Math.random() * 700);
  const lower = ` ${prompt.toLowerCase()} `;
  const scenario = SCENARIOS.find((item) => item.keywords.some((keyword) => lower.includes(keyword)));
  if (scenario) {
    return { reply: scenario.reply, note: scenario.note, draft: scenario.draft };
  }
  if (existing) {
    const added = question(`q_${Date.now()}`, "paragraph", toTitle(prompt), { isRequired: false });
    return {
      reply: `Baik, aku menambahkan satu pertanyaan baru di akhir form: “${added.label}”. Kamu tetap bisa mengubah urutan, tipe, atau menghapusnya nanti di Manual Builder.`,
      draft: { ...existing, questions: [...existing.questions, added] },
    };
  }
  return {
    reply:
      "Aku sudah menyusun draft awal berdasarkan instruksimu — 5 pertanyaan dengan satu logika kondisional sebagai fondasi. Lanjutkan percakapan ini untuk menambah pertanyaan, atau buka Manual Builder untuk menyuntingnya langsung.",
    note: "Mulai dari struktur ringkas lalu tambah pertanyaan seperlunya — form pendek menjaga completion rate tetap tinggi.",
    draft: genericDraft(prompt),
  };
}
