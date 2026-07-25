import type { User } from "@supabase/supabase-js";

/** Optional override from env — keep in sync with supabase/seed-admin.config.js when set. */
export function getSeedAdminEmail(): string | null {
  const fromEnv = process.env.SEED_ADMIN_EMAIL?.trim();
  return fromEnv ? fromEnv.toLowerCase() : null;
}

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  const seed = getSeedAdminEmail();
  if (!seed || !email) return false;
  return email.trim().toLowerCase() === seed;
}

/** Seeded bootstrap account — marked via app_metadata.super_admin by `npm run seed:admin`. */
export function isSuperAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.app_metadata?.super_admin === true) return true;
  return isSuperAdminEmail(user.email);
}
