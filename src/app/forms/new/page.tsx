import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BuilderView } from "@/components/ai-builder/builder-view";
import { getAppUser } from "@/lib/supabase/user";

export const metadata: Metadata = { title: "Buat Mimir baru — Mimir" };

export default async function NewFormPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const user = await getAppUser();
  if (!user) redirect("/login");
  const { mode } = await searchParams;
  return <BuilderView mode={mode === "manual" ? "manual" : "ai"} user={user} />;
}
