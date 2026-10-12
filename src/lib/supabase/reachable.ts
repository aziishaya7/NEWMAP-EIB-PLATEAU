const CACHE_MS = 30_000;

let cached: { host: string; ok: boolean; at: number } | null = null;

/**
 * True when the Supabase hostname has DNS records.
 * Uses DNS-over-HTTPS so this can run in edge middleware, where node:dns is unavailable.
 * A missing project host otherwise makes Next's fetch stall for ~25s and log AuthRetryableFetchError.
 */
export async function supabaseHostResolves(supabaseUrl: string): Promise<boolean> {
  let host: string;
  try {
    host = new URL(supabaseUrl).hostname;
  } catch {
    return false;
  }

  if (cached && cached.host === host && Date.now() - cached.at < CACHE_MS) {
    return cached.ok;
  }

  // Assume the host exists if the lookup itself fails, so a blocked resolver
  // does not sign everyone out. Status 3 is NXDOMAIN: the project host is gone.
  let ok = true;
  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(host)}&type=A`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (response.ok) {
      const body = (await response.json()) as { Status?: number };
      if (body.Status === 3) ok = false;
    }
  } catch {
    ok = true;
  }

  cached = { host, ok, at: Date.now() };
  return ok;
}
