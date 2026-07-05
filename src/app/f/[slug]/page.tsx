import type { Metadata } from "next";
import { RespondentView } from "@/components/respondent/respondent-view";

export const metadata: Metadata = {
  title: "Isi form — Mimir",
  description: "Isi form ini dalam beberapa menit saja.",
};

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <RespondentView slug={slug} />;
}
