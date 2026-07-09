import { createClient } from "@/lib/supabase/client";

export async function getAccessToken(): Promise<string> {
  const { data } = await createClient().auth.getSession();
  return data.session?.access_token ?? "";
}
