import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env";
import { nodeSupabaseFetch } from "./node-fetch";

/** Service-role client for trusted server routes only. Bypasses RLS. */
export function createAdminClient() {
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    global: { fetch: nodeSupabaseFetch },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
