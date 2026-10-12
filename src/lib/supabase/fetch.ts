const FETCH_TIMEOUT_MS = 5000;

/** Edge-safe fetch used by middleware. Node server code uses nodeSupabaseFetch. */
export function supabaseFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const timeout = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const signal = init?.signal
    ? AbortSignal.any([init.signal, timeout])
    : timeout;

  return fetch(input, { ...init, signal });
}
