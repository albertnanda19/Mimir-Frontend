import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FormsListView } from "./forms-list-view";
import { getAppUser } from "@/lib/supabase/user";

export const metadata: Metadata = { title: "Form saya — Mimir" };

export default async function FormsPage() {
  const user = await getAppUser();
  if (!user) redirect("/login");
  return <FormsListView user={user} />;
}
