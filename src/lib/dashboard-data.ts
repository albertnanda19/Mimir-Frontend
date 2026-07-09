import type { FormStatus, FormSummary } from "@/types/form";

export const STATUS_META: Record<FormStatus, { label: string }> = {
  draft: { label: "Draft" },
  published: { label: "Terbit" },
  closed: { label: "Ditutup" },
  archived: { label: "Arsip" },
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
