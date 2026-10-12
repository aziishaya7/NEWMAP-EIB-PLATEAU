import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";
import { nodeSupabaseFetch, nodeSupabaseHostResolves } from "./node-fetch";

export async function createClient() {
  const cookieStore = await cookies();
  const url = getSupabaseUrl();
  const online = await nodeSupabaseHostResolves(url);

  return createServerClient(url, getSupabaseAnonKey(), {
    global: { fetch: nodeSupabaseFetch },
    cookies: {
      getAll() {
        // Skip the saved session when the project host does not resolve.
        // Otherwise the auth client tries to refresh it and logs AuthRetryableFetchError.
        return online ? cookieStore.getAll() : [];
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore when middleware refreshes sessions.
        }
      },
    },
  });
}
