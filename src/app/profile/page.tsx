import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileView } from "@/components/profile/profile-view";
import { getAppUser } from "@/lib/supabase/user";

export const metadata: Metadata = { title: "Profil — Mimir" };

export default async function ProfilePage() {
  const user = await getAppUser();
  if (!user) redirect("/login");
  return <ProfileView user={user} />;
}
