"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Grid, Sparkles } from "@mynaui/icons-react";
import { AppNavbar } from "@/components/layout/app-navbar";
import { BuilderStepper } from "@/components/ai-builder/builder-stepper";
import { AiBuilderWorkspace } from "@/components/ai-builder/ai-builder-workspace";
import { ManualBuilderWorkspace } from "@/components/manual-builder/manual-builder-workspace";
import { getSession, getSessionSnapshot, subscribeSession } from "@/lib/auth-dummy";

export function BuilderView({ mode }: { mode: "ai" | "manual" }) {
  const router = useRouter();
  const user = useSyncExternalStore(subscribeSession, getSessionSnapshot, () => null);

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col bg-subtle lg:h-dvh">
      <AppNavbar user={user} />

      <main
        className={`mx-auto flex w-full flex-1 flex-col px-4 pb-4 pt-5 sm:px-6 lg:min-h-0 ${
          mode === "manual" ? "max-w-none" : "max-w-[90rem]"
        }`}
      >
        {!user ? (
          <div className="flex flex-1 flex-col gap-4">
            <div className="h-9 w-64 animate-pulse rounded-md bg-overlay" />
            <div className="grid flex-1 gap-4 lg:grid-cols-2">
              <div className="h-[60dvh] animate-pulse rounded-xl bg-overlay lg:h-auto" />
              <div className="hidden animate-pulse rounded-xl bg-overlay lg:block" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 pb-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  aria-label="Kembali ke dashboard"
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line bg-surface text-muted transition-all duration-150 hover:border-line-strong hover:text-ink active:scale-95"
                >
                  <ArrowLeft className="size-[18px]" />
                </Link>
                <div className="flex flex-col">
                  <h1 className="font-display text-lg font-semibold tracking-[-0.015em] text-ink">
                    Buat Mimir baru
                  </h1>
                  <p className="hidden text-[13px] text-muted sm:block">
                    {mode === "manual"
                      ? "Rakit form dari nol dengan manual builder."
                      : "Jelaskan kebutuhanmu — Mimir menyusun struktur formnya."}
                  </p>
                </div>
              </div>
              <div className="hidden flex-1 justify-center lg:flex">
                <BuilderStepper current={mode === "manual" ? 2 : 1} />
              </div>
              {mode === "manual" ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-subtle px-3 py-1 text-xs font-medium text-brand-text">
                  <Grid className="size-3.5" />
                  Manual Builder
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent-text">
                  <Sparkles className="size-3.5" />
                  AI Chat Builder
                </span>
              )}
            </div>

            {mode === "manual" ? <ManualBuilderWorkspace /> : <AiBuilderWorkspace />}
          </>
        )}
      </main>
    </div>
  );
}
