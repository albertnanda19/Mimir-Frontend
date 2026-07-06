import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResponsesView } from "@/components/responses/responses-view";
import { getAppUser } from "@/lib/supabase/user";

export const metadata: Metadata = { title: "Respons form — Mimir" };

export default async function FormResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAppUser();
  if (!user) redirect("/login");
  const { id } = await params;
  return <ResponsesView formId={id} user={user} />;
}
