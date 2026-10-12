import { lookup } from "node:dns/promises";

const CACHE_MS = 30_000;
const FETCH_TIMEOUT_MS = 5000;

let cached: { host: string; ok: boolean; at: number } | null = null;

async function hostResolves(host: string): Promise<boolean> {
  if (cached && cached.host === host && Date.now() - cached.at < CACHE_MS) {
    return cached.ok;
  }
  try {
    await lookup(host);
    cached = { host, ok: true, at: Date.now() };
    return true;
  } catch {
    cached = { host, ok: false, at: Date.now() };
    return false;
  }
}

export async function nodeSupabaseHostResolves(supabaseUrl: string): Promise<boolean> {
  try {
    return await hostResolves(new URL(supabaseUrl).hostname);
  } catch {
    return false;
  }
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

/** Node fetch for Supabase. A missing project hostname fails immediately. */
export function nodeSupabaseFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const timeout = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout;

  return (async () => {
    try {
      const host = new URL(requestUrl(input)).hostname;
      if (host.endsWith(".supabase.co") && !(await hostResolves(host))) {
        // AbortError skips PostgREST's 1s/2s/4s retry backoff on a dead host.
        const error = new TypeError("fetch failed");
        error.name = "AbortError";
        throw error;
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === "fetch failed") throw error;
    }
    return fetch(input, { ...init, signal });
  })();
}
