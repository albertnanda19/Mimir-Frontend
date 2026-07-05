import type { FormStatus, FormSummary } from "@/types/form";

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const TODAY = new Date("2026-07-05T00:00:00");

export const STATUS_META: Record<FormStatus, { label: string }> = {
  draft: { label: "Draft" },
  published: { label: "Terbit" },
  closed: { label: "Ditutup" },
};

export const DUMMY_FORMS: FormSummary[] = [
  { id: "f_konser", title: "Evaluasi Konser Senja 2026", status: "published", responses: 428, completionRate: 82, avgDurationSec: 96, createdAt: "12 Jun 2026", lastResponseAt: "5 menit lalu" },
  { id: "f_hr", title: "Survei Kepuasan Karyawan Q2", status: "published", responses: 176, completionRate: 74, avgDurationSec: 213, createdAt: "2 Jun 2026", lastResponseAt: "1 jam lalu" },
  { id: "f_webinar", title: "Pendaftaran Webinar UX Nusantara", status: "published", responses: 312, completionRate: 91, avgDurationSec: 64, createdAt: "20 Jun 2026", lastResponseAt: "12 menit lalu" },
  { id: "f_nps", title: "Survei NPS Pelanggan Juli", status: "published", responses: 94, completionRate: 68, avgDurationSec: 78, createdAt: "1 Jul 2026", lastResponseAt: "3 jam lalu" },
  { id: "f_beta", title: "Feedback Produk Beta", status: "published", responses: 51, completionRate: 79, avgDurationSec: 142, createdAt: "28 Jun 2026", lastResponseAt: "kemarin" },
  { id: "f_skripsi", title: "Kuesioner Skripsi Pola Makan Mahasiswa", status: "draft", responses: 0, completionRate: 0, avgDurationSec: 0, createdAt: "3 Jul 2026", lastResponseAt: null },
  { id: "f_magang", title: "Form Lamaran Program Magang", status: "draft", responses: 0, completionRate: 0, avgDurationSec: 0, createdAt: "4 Jul 2026", lastResponseAt: null },
  { id: "f_kopi", title: "Riset Pasar Kopi Lokal", status: "draft", responses: 0, completionRate: 0, avgDurationSec: 0, createdAt: "4 Jul 2026", lastResponseAt: null },
  { id: "f_rsvp", title: "RSVP Pernikahan Adit & Sari", status: "closed", responses: 203, completionRate: 96, avgDurationSec: 51, createdAt: "2 Mei 2026", lastResponseAt: "18 Jun 2026" },
  { id: "f_kantin", title: "Polling Menu Kantin Kampus", status: "closed", responses: 587, completionRate: 88, avgDurationSec: 39, createdAt: "10 Apr 2026", lastResponseAt: "30 Mei 2026" },
];

export interface DailyPoint {
  label: string;
  count: number;
}

function buildSeries(days: number): DailyPoint[] {
  const points: DailyPoint[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(TODAY);
    date.setDate(TODAY.getDate() - offset);
    const wave = 34 + Math.round(16 * Math.sin(offset / 2.6)) + Math.round(9 * Math.cos(offset / 5));
    const weekend = date.getDay() === 0 || date.getDay() === 6 ? 12 : 0;
    const trend = Math.round((days - offset) / 4);
    points.push({
      label: `${date.getDate()} ${MONTHS_ID[date.getMonth()]}`,
      count: Math.max(4, wave + weekend + trend),
    });
  }
  return points;
}

export const RESPONSES_SERIES = buildSeries(30);

export interface StatusSlice {
  status: FormStatus;
  label: string;
  count: number;
}

export const STATUS_BREAKDOWN: StatusSlice[] = (Object.keys(STATUS_META) as FormStatus[]).map((status) => ({
  status,
  label: STATUS_META[status].label,
  count: DUMMY_FORMS.filter((form) => form.status === status).length,
}));

export const TOP_FORMS = [...DUMMY_FORMS]
  .filter((form) => form.responses > 0)
  .sort((a, b) => b.responses - a.responses)
  .slice(0, 5);

const totalResponses = DUMMY_FORMS.reduce((sum, form) => sum + form.responses, 0);
const answeredForms = DUMMY_FORMS.filter((form) => form.responses > 0);
const last7 = RESPONSES_SERIES.slice(-7).reduce((sum, point) => sum + point.count, 0);
const prev7 = RESPONSES_SERIES.slice(-14, -7).reduce((sum, point) => sum + point.count, 0);

export const DASHBOARD_STATS = {
  totalForms: DUMMY_FORMS.length,
  totalResponses,
  publishedForms: DUMMY_FORMS.filter((form) => form.status === "published").length,
  avgCompletion: Math.round(answeredForms.reduce((sum, form) => sum + form.completionRate, 0) / answeredForms.length),
  responsesLast7: last7,
  responsesDeltaPct: Math.round(((last7 - prev7) / prev7) * 100),
};
