import type {
  BuilderReply,
  DraftQuestion,
  DraftQuestionType,
  FormDraft,
} from "@/types/ai-builder";

const TYPE_LABELS: Record<DraftQuestionType, string> = {
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
      "Siap! Aku menyusun draft “Evaluasi Konser Musik” berisi 9 pertanyaan yang mencakup penilaian keseluruhan, sound system, tiket, penampil, sampai unggah foto momen favorit. Aku juga memasang satu logika kondisional — jika penilaian keseluruhan di bawah 3, responden diminta menjelaskan alasannya. Cek panel pratinjau — kamu bisa menyeret kartu pertanyaan untuk mengubah urutannya.",
    note: "Skala Likert 1–5 kupakai untuk aspek spesifik seperti sound system karena lebih konsisten dimaknai responden dibanding skala 1–10.",
    draft: {
      title: "Evaluasi Konser Musik",
      description: "Bantu kami memahami pengalamanmu selama konser berlangsung.",
      questions: [
        question("q_date", "date", "Tanggal konser yang kamu hadiri"),
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
        question("q_photo", "file_upload", "Unggah foto momen favoritmu di konser", { isRequired: false }),
        question("q_suggest", "paragraph", "Apa saranmu untuk konser berikutnya?", { isRequired: false }),
      ],
    },
  },
  {
    keywords: ["karyawan", "kepuasan kerja", "pegawai", "hr ", "internal", "kantor"],
    reply:
      "Draft “Survei Kepuasan Karyawan” sudah siap — 7 pertanyaan dengan format eNPS standar industri. Ada satu logika kondisional: karyawan yang memberi skor rekomendasi 6 atau kurang akan diminta menyebutkan hal yang paling perlu diperbaiki. Silakan review di panel pratinjau — seret kartu pertanyaan jika ingin mengubah urutannya.",
    note: "Survei internal sebaiknya anonim — aku sengaja tidak menambahkan pertanyaan nama atau email agar jawaban lebih jujur.",
    draft: {
      title: "Survei Kepuasan Karyawan",
      description: "Survei anonim untuk memahami pengalaman kerja tim. Jawabanmu tidak dikaitkan dengan identitas.",
      questions: [
        question("q_dept", "dropdown", "Di departemen mana kamu bekerja?", {
          options: ["Operasional", "Pemasaran", "Teknologi", "Keuangan", "SDM"],
        }),
        question("q_tenure", "number", "Sudah berapa tahun kamu bekerja di perusahaan ini?"),
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
      "Form “Pendaftaran Webinar” sudah kususun — 8 pertanyaan ringkas supaya calon peserta cepat selesai mendaftar. Aku menambahkan logika kondisional: kolom nama organisasi hanya muncul untuk pendaftar yang mewakili organisasi. Review strukturnya di panel pratinjau — urutan pertanyaan bisa kamu seret sesuka hati.",
    note: "Form pendaftaran sebaiknya di bawah 10 pertanyaan — makin pendek, makin tinggi completion rate-nya.",
    draft: {
      title: "Pendaftaran Webinar",
      description: "Isi data berikut untuk mengamankan kursimu. Tautan webinar dikirim lewat email.",
      questions: [
        question("q_name", "short_text", "Nama lengkap"),
        question("q_email", "email", "Alamat email aktif"),
        question("q_phone", "phone", "Nomor WhatsApp aktif", { isRequired: false }),
        question("q_session", "dropdown", "Pilih sesi yang ingin kamu ikuti", {
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
  {
    keywords: ["magang", "lamaran", "rekrut", "lowongan", "internship"],
    reply:
      "Draft “Form Lamaran Program Magang” sudah jadi — 9 pertanyaan dari data diri, unggah CV, sampai tanda tangan digital sebagai pernyataan kebenaran data. Ada satu logika kondisional: kolom tautan portofolio hanya muncul untuk pelamar posisi Product Design. Silakan review dan seret kartu untuk mengatur urutannya.",
    note: "Pertanyaan unggah berkas dan tanda tangan kutaruh di akhir — pelamar lebih rela mengunggah dokumen setelah mengisi sebagian besar form.",
    draft: {
      title: "Form Lamaran Program Magang",
      description: "Lengkapi data berikut untuk melamar program magang. Pastikan CV dalam format PDF.",
      questions: [
        question("q_name", "short_text", "Nama lengkap"),
        question("q_email", "email", "Alamat email aktif"),
        question("q_phone", "phone", "Nomor WhatsApp aktif"),
        question("q_position", "dropdown", "Posisi magang yang dilamar", {
          options: ["Frontend Engineer", "Backend Engineer", "Product Design", "Data Analyst"],
        }),
        question("q_portfolio", "short_text", "Tautan portofolio", {
          isRequired: false,
          logic: "Tampil hanya jika posisi yang dilamar adalah Product Design",
        }),
        question("q_start", "date", "Kapan kamu bisa mulai magang?"),
        question("q_motivation", "paragraph", "Ceritakan motivasimu melamar posisi ini"),
        question("q_cv", "file_upload", "Unggah CV terbaru (PDF)"),
        question("q_sign", "signature", "Tanda tangan sebagai pernyataan kebenaran data"),
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
      question("q_email", "email", "Alamat email", { isRequired: false }),
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
  "Form lamaran magang dengan unggah CV dan tanda tangan digital",
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
      "Aku sudah menyusun draft awal berdasarkan instruksimu — 6 pertanyaan dengan satu logika kondisional sebagai fondasi. Lanjutkan percakapan ini untuk menambah pertanyaan, seret kartu di pratinjau untuk mengatur urutan, atau buka Manual Builder untuk menyuntingnya langsung.",
    note: "Mulai dari struktur ringkas lalu tambah pertanyaan seperlunya — form pendek menjaga completion rate tetap tinggi.",
    draft: genericDraft(prompt),
  };
}
