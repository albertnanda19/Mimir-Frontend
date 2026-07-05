import type { Metadata } from "next";
import { ResponsesView } from "@/components/responses/responses-view";

export const metadata: Metadata = { title: "Respons form — Mimir" };

export default async function FormResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResponsesView formId={id} />;
}
