import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/super-admin";

export function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.app_metadata?.role === "admin" || isSuperAdmin(user);
}

/** Safe path from a `next` query/form value, or null if missing/unsafe. */
export function sanitizeNextPath(next: string | null | undefined): string | null {
  const candidate = (next ?? "").trim();
  if (!candidate.startsWith("/") || candidate.startsWith("//")) return null;
  return candidate;
}

/**
 * Where to send a user after sign-in.
 * Admins land on the dashboard unless they were heading somewhere else
 * (e.g. a deep link), excluding the generic /profile default.
 */
export function resolvePostAuthPath(
  user: User | null | undefined,
  next?: string | null
): string {
  const safeNext = sanitizeNextPath(next);
  if (isAdmin(user)) {
    if (safeNext && safeNext !== "/profile") return safeNext;
    return "/admin";
  }
  return safeNext ?? "/profile";
}

export { isSuperAdmin } from "@/lib/super-admin";

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    throw new AuthError("Authentication required.", 401);
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (!isAdmin(user)) {
    throw new AuthError("Admin access required.", 403);
  }
  return user;
}

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}
