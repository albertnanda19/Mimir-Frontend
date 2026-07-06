import { createClient } from "@/lib/supabase/server";
import type { AppUser } from "@/types/auth";

export async function getAppUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;
  const meta = (claims.user_metadata ?? {}) as {
    name?: string;
    full_name?: string;
    avatar_url?: string;
  };
  const email = claims.email as string;
  return {
    id: claims.sub,
    name: meta.name ?? meta.full_name ?? email,
    email,
    role: claims.user_role === "superadmin" ? "superadmin" : "user",
    avatarUrl: meta.avatar_url,
  };
}
