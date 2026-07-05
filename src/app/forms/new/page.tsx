import type { Metadata } from "next";
import { BuilderView } from "@/components/ai-builder/builder-view";

export const metadata: Metadata = { title: "Buat Mimir baru — Mimir" };

export default async function NewFormPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return <BuilderView mode={mode === "manual" ? "manual" : "ai"} />;
}
