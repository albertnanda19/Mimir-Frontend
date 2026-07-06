import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getAppUser } from "@/lib/supabase/user";

export const metadata: Metadata = { title: "Dashboard — Mimir" };

export default async function DashboardPage() {
  const user = await getAppUser();
  if (!user) redirect("/login");
  return <DashboardView user={user} />;
}
