/**
 * @deprecated Local filesystem uploads replaced by Supabase Storage + /api/uploads.
 * Kept only so any leftover imports fail loudly if reintroduced.
 */
export async function uploadProjectImage() {
  return {
    error:
      "Local uploads are disabled. Use the /upload page (Supabase Storage + API).",
  };
}
