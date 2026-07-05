"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  ArrowUpRight,
  ChartLine,
  Clock4,
  InboxCheck,
  Sparkles,
  Table,
  Zap,
} from "@mynaui/icons-react";
import type { FormStatus } from "@/types/form";
import { AppNavbar } from "@/components/layout/app-navbar";
import { getSession, getSessionSnapshot, subscribeSession } from "@/lib/auth-dummy";
import { getFormResponses, subscribeNoop } from "@/lib/responses-data";
import { STATUS_META } from "@/lib/dashboard-data";
import { toSlug } from "@/lib/respondent";
import { ResponsesTable } from "@/components/responses/responses-table";

const STATUS_BADGE: Record<FormStatus, string> = {
  published: "bg-success-subtle text-success-text",
  draft: "bg-accent-subtle text-accent-text",
  closed: "bg-overlay text-muted",
};

const MimirChat = dynamic(
  () => import("@/components/tanya-mimir/mimir-chat").then((mod) => mod.MimirChat),
  {
    ssr: false,
    loading: () => <div className="h-[72dvh] animate-pulse rounded-xl border border-line bg-surface" />,
  },
);

const TABS = [
  { id: "table", label: "Tabel klasik", icon: Table },
  { id: "mimir", label: "Tanya Mimir", icon: Sparkles },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ResponsesView({ formId }: { formId: string }) {
  const router = useRouter();
  const user = useSyncExternalStore(subscribeSession, getSessionSnapshot, () => null);
  const data = useSyncExternalStore(subscribeNoop, () => getFormResponses(formId), () => null);
  const [tab, setTab] = useState<TabId>("table");

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
    }
  }, [router]);

  if (!user || !data) {
    return (
      <div className="min-h-dvh bg-subtle">
        <AppNavbar user={user} />
        <main className="mx-auto flex w-full max-w-[80rem] flex-col gap-6 px-4 py-8 sm:px-8">
          <div className="h-9 w-72 animate-pulse rounded-md bg-overlay" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-lg bg-overlay" />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-xl bg-overlay" />
        </main>
      </div>
    );
  }

  const { form, questions, rows } = data;
  const stats = [
    { icon: InboxCheck, label: "Total respons", value: form.responses.toLocaleString("id-ID") },
    { icon: ChartLine, label: "Tingkat penyelesaian", value: `${form.completionRate}%` },
    {
      icon: Clock4,
      label: "Rata-rata durasi",
      value: form.avgDurationSec > 0 ? `${Math.floor(form.avgDurationSec / 60)} mnt ${form.avgDurationSec % 60} dtk` : "—",
    },
    { icon: Zap, label: "Respons terakhir", value: form.lastResponseAt ?? "Belum ada" },
  ];

  return (
    <div className="min-h-dvh bg-subtle">
      <AppNavbar user={user} />

      <main className="mx-auto flex w-full max-w-[80rem] flex-col gap-6 px-4 py-8 sm:px-8 animate-enter">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Link
              href="/dashboard"
              aria-label="Kembali ke dashboard"
              className="mt-0.5 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line bg-surface text-muted transition-all duration-150 hover:border-line-strong hover:text-ink active:scale-95"
            >
              <ArrowLeft className="size-[18px]" />
            </Link>
            <div className="flex flex-col gap-1.5">
              <h1 className="font-display text-2xl font-semibold leading-tight tracking-[-0.02em] text-ink">
                {form.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[form.status]}`}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {STATUS_META[form.status].label}
                </span>
                <span>Dibuat {form.createdAt}</span>
              </div>
            </div>
          </div>
          <Link
            href={`/f/${toSlug(form.title)}`}
            target="_blank"
            className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-md border border-line bg-surface px-4 text-sm font-medium text-muted transition-all duration-150 hover:border-brand hover:text-brand-text active:scale-[0.98] sm:self-auto"
          >
            Buka form
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }, index) => (
            <div
              key={label}
              style={{ animationDelay: `${index * 60}ms` }}
              className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 shadow-[var(--elevation-1)] animate-enter"
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <Icon className="size-3.5 text-faint" />
                {label}
              </span>
              <span className="font-display text-xl font-semibold tracking-[-0.01em] text-ink">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-end border-b border-line">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2.5 text-sm transition-colors duration-150 ${
                  isActive
                    ? "border-brand font-medium text-brand"
                    : "border-transparent text-muted hover:border-line-strong hover:text-ink"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            );
          })}
        </div>

        {tab === "table" ? (
          rows.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-line bg-surface px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-overlay text-faint">
                <InboxCheck className="size-6" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-ink">Belum ada respons masuk</p>
                <p className="max-w-sm text-[13px] leading-relaxed text-muted">
                  Bagikan tautan formmu — setiap respons yang masuk langsung muncul di tabel ini.
                </p>
              </div>
            </div>
          ) : (
            <ResponsesTable questions={questions} rows={rows} />
          )
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-line bg-surface px-6 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent-subtle text-accent-text">
              <Sparkles className="size-6" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-ink">Belum ada data untuk dianalisis</p>
              <p className="max-w-sm text-[13px] leading-relaxed text-muted">
                Begitu respons pertama masuk, kamu bisa langsung mengobrol dengan datanya di sini.
              </p>
            </div>
          </div>
        ) : (
          <MimirChat data={data} />
        )}
      </main>
    </div>
  );
}
