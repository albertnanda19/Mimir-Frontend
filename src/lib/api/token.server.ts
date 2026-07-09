import { createClient } from "@/lib/supabase/server";

export async function getAccessToken(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? "";
}
