import type { DraftQuestion } from "@/types/ai-builder";
import type { FormResponses, ResponseRow } from "@/lib/responses-data";
import type {
  AnalysisChart,
  AnalysisCluster,
  AnalysisStat,
  CleanupProposal,
} from "@/types/tanya-mimir";

export interface AnalysisReply {
  reply: string;
  chart?: AnalysisChart;
  clusters?: AnalysisCluster[];
  stats?: AnalysisStat[];
  cleanup?: CleanupProposal;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function findQuestion(
  questions: DraftQuestion[],
  types: DraftQuestion["type"][],
): DraftQuestion | undefined {
  return questions.find((question) => types.includes(question.type));
}

function groupBy(rows: ResponseRow[], questionId: string): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const row of rows) {
    const answer = row.answers[questionId];
    if (!answer) continue;
    const bucket = groups.get(answer);
    if (bucket) {
      bucket.push(row.id);
    } else {
      groups.set(answer, [row.id]);
    }
  }
  return groups;
}

function ratingChart(question: DraftQuestion, rows: ResponseRow[]): AnalysisChart {
  const groups = groupBy(rows, question.id);
  return {
    kind: "bar",
    title: `Distribusi jawaban — ${question.label}`,
    points: ["1", "2", "3", "4", "5"].map((step) => {
      const rowIds = groups.get(step) ?? [];
      return { label: `Skor ${step}`, value: rowIds.length, rowIds };
    }),
  };
}

function choiceChart(question: DraftQuestion, rows: ResponseRow[]): AnalysisChart {
  const options = question.options ?? [];
  return {
    kind: "pie",
    title: `Sebaran pilihan — ${question.label}`,
    points: options.map((option) => {
      const rowIds = rows
        .filter((row) => (row.answers[question.id] ?? "").split(", ").includes(option))
        .map((row) => row.id);
      return { label: option, value: rowIds.length, rowIds };
    }),
  };
}

function trendChart(rows: ResponseRow[]): AnalysisChart {
  const byDay = new Map<string, string[]>();
  const sorted = [...rows].sort((a, b) => a.submittedAtMs - b.submittedAtMs);
  for (const row of sorted) {
    const date = new Date(row.submittedAtMs);
    const key = `${date.getDate()} ${MONTHS_ID[date.getMonth()]}`;
    const bucket = byDay.get(key);
    if (bucket) {
      bucket.push(row.id);
    } else {
      byDay.set(key, [row.id]);
    }
  }
  return {
    kind: "line",
    title: "Respons masuk per hari (30 hari terakhir)",
    points: [...byDay.entries()].map(([label, rowIds]) => ({ label, value: rowIds.length, rowIds })),
  };
}

const CLUSTER_RULES: { name: string; keywords: string[] }[] = [
  { name: "Antrean & akses masuk", keywords: ["antre", "masuk", "parkir", "lokasi"] },
  { name: "Kualitas audio", keywords: ["sound", "audio", "terdengar"] },
  { name: "Harga & konsumsi", keywords: ["harga", "mahal", "makanan"] },
  { name: "Apresiasi & panitia", keywords: ["bagus", "berkesan", "ramah", "pertahankan", "keren"] },
  { name: "Saran fasilitas", keywords: ["spot foto", "tambah", "tolong"] },
];

function clusterFeedback(questions: DraftQuestion[], rows: ResponseRow[]): AnalysisCluster[] {
  const paragraphIds = questions
    .filter((question) => question.type === "paragraph")
    .map((question) => question.id);
  const entries: { rowId: string; text: string }[] = [];
  for (const row of rows) {
    for (const id of paragraphIds) {
      const answer = row.answers[id];
      if (answer) entries.push({ rowId: row.id, text: answer });
    }
  }
  const matchedRowIds = new Set<string>();
  const clusters = CLUSTER_RULES.map(({ name, keywords }) => {
    const matched = entries.filter(({ text }) =>
      keywords.some((keyword) => text.toLowerCase().includes(keyword)),
    );
    matched.forEach(({ rowId }) => matchedRowIds.add(rowId));
    return {
      name,
      count: matched.length,
      samples: [...new Set(matched.map(({ text }) => text))].slice(0, 2),
      rowIds: [...new Set(matched.map(({ rowId }) => rowId))],
    };
  }).filter((cluster) => cluster.count > 0);
  const rest = entries.filter(({ rowId }) => !matchedRowIds.has(rowId));
  if (rest.length > 0) {
    clusters.push({
      name: "Lainnya",
      count: rest.length,
      samples: [],
      rowIds: [...new Set(rest.map(({ rowId }) => rowId))],
    });
  }
  return clusters.sort((a, b) => b.count - a.count);
}

function summaryStats(data: FormResponses): AnalysisStat[] {
  const { form, questions, rows } = data;
  const scaleQuestion = findQuestion(questions, ["rating", "likert"]);
  const stats: AnalysisStat[] = [
    { label: "Total respons", value: rows.length.toLocaleString("id-ID") },
    { label: "Tingkat penyelesaian", value: `${form.completionRate}%` },
  ];
  if (scaleQuestion) {
    const values = rows
      .map((row) => Number(row.answers[scaleQuestion.id]))
      .filter((value) => !Number.isNaN(value) && value > 0);
    const average = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
    const lowShare = Math.round((values.filter((value) => value < 3).length / Math.max(values.length, 1)) * 100);
    stats.push(
      { label: "Rata-rata skor", value: average.toFixed(2).replace(".", ",") },
      { label: "Skor di bawah 3", value: `${lowShare}%` },
    );
  }
  return stats;
}

export const ANALYSIS_PROMPTS = [
  "Buatkan grafik distribusi rating",
  "Tunjukkan tren respons per hari",
  "Kelompokkan masukan teks jadi beberapa kategori",
  "Ringkas hasil form ini",
  "Cari respons yang terindikasi spam",
];

export async function analyzeData(prompt: string, data: FormResponses): Promise<AnalysisReply> {
  await wait(1200 + Math.random() * 600);
  const lower = prompt.toLowerCase();
  const { questions, rows } = data;
  const scaleQuestion = findQuestion(questions, ["rating", "likert"]);
  const choiceQuestion = findQuestion(questions, ["multiple_choice", "dropdown", "checkbox"]);

  if (/(spam|bersih|bot|duplikat|hapus)/.test(lower)) {
    const suspects = rows.filter((row) => row.durationSec < 40);
    return {
      reply: `Aku memeriksa durasi pengisian seluruh respons. Ada ${suspects.length} respons yang diselesaikan kurang dari 40 detik — terlalu cepat untuk form sepanjang ini, jadi kuat dugaan asal isi atau bot. Aku sudah siapkan usulan pembersihannya di bawah; data baru benar-benar dihapus setelah kamu konfirmasi.`,
      cleanup: {
        description: "Hapus respons dengan durasi pengisian di bawah 40 detik",
        count: suspects.length,
        rowIds: suspects.map((row) => row.id),
      },
    };
  }

  if (/(kelompok|kategori|cluster|tema|masukan|keluhan)/.test(lower)) {
    const clusters = clusterFeedback(questions, rows);
    const top = clusters[0];
    return {
      reply: `Aku membaca semua jawaban teks bebas dan mengelompokkannya menjadi ${clusters.length} kategori. Yang paling banyak dibicarakan: “${top?.name}” (${top?.count} respons). Perlu kuambilkan contoh kutipan lengkap dari salah satu kategori?`,
      clusters,
    };
  }

  if (/(tren|per hari|waktu|harian|kapan)/.test(lower)) {
    return {
      reply:
        "Ini tren respons yang masuk per hari dalam 30 hari terakhir. Terlihat polanya naik di akhir pekan — waktu terbaik untuk membagikan ulang tautan formmu.",
      chart: trendChart(rows),
    };
  }

  if (/(pie|pilihan|sebaran|proporsi)/.test(lower) && choiceQuestion) {
    return {
      reply: `Berikut sebaran jawaban untuk “${choiceQuestion.label}”. Arahkan kursor ke tiap potongan untuk melihat jumlah pastinya.`,
      chart: choiceChart(choiceQuestion, rows),
    };
  }

  if (/(grafik|chart|distribusi|rating|skor|bar)/.test(lower) && scaleQuestion) {
    const groups = groupBy(rows, scaleQuestion.id);
    const low = (groups.get("1")?.length ?? 0) + (groups.get("2")?.length ?? 0);
    return {
      reply: `Ini distribusi skor untuk “${scaleQuestion.label}”. Mayoritas responden memberi skor 3 ke atas; ${low} respons memberi skor rendah — coba minta aku mengelompokkan alasan mereka.`,
      chart: ratingChart(scaleQuestion, rows),
    };
  }

  if (/(ringkas|rangkum|summary|kesimpulan|insight|hasil)/.test(lower)) {
    return {
      reply:
        "Ini ringkasan cepat form-mu. Angka penyelesaian sehat dan skor rata-rata cukup baik — sisi yang paling perlu perhatian ada di kelompok skor rendah. Minta aku membuat grafik atau mengelompokkan masukan untuk menggali lebih dalam.",
      stats: summaryStats(data),
    };
  }

  if (scaleQuestion) {
    return {
      reply: `Aku belum yakin persis maksudmu, jadi kubuatkan gambaran paling berguna dulu: distribusi skor “${scaleQuestion.label}”. Kamu juga bisa minta tren harian, sebaran pilihan, pengelompokan masukan teks, atau deteksi spam.`,
      chart: ratingChart(scaleQuestion, rows),
    };
  }

  return {
    reply:
      "Aku bisa bantu membuat grafik, meringkas hasil, mengelompokkan jawaban teks, atau mencari respons mencurigakan. Coba pilih salah satu saran di bawah untuk memulai.",
    stats: summaryStats(data),
  };
}
