#!/usr/bin/env node
/**
 * Creates or updates the seeded super-admin account.
 *
 * Config:  supabase/seed-admin.config.js  (email + display name)
 * Secret:  SEED_ADMIN_PASSWORD in .env or .env.local
 * Optional override: SEED_ADMIN_EMAIL / SEED_ADMIN_NAME in env
 *
 * Usage: npm run seed:admin
 */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function parseEnvFile(filePath) {
  const parsed = {};
  if (!fs.existsSync(filePath)) return parsed;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key) parsed[key] = val;
  }
  return parsed;
}

function loadEnv() {
  const dotenvPath = path.join(process.cwd(), ".env");
  const localPath = path.join(process.cwd(), ".env.local");
  const fromDotenv = parseEnvFile(dotenvPath);
  const fromLocal = parseEnvFile(localPath);

  const dotenvPassword = (fromDotenv.SEED_ADMIN_PASSWORD || "").trim();
  const localPassword = (fromLocal.SEED_ADMIN_PASSWORD || "").trim();
  if (dotenvPassword && localPassword && dotenvPassword !== localPassword) {
    console.warn(
      "Warning: SEED_ADMIN_PASSWORD differs between .env and .env.local."
    );
    console.warn(
      "Using .env.local (this is what npm run seed:admin applies). Sign in with that password."
    );
  }

  // Prefer .env.local over .env; process.env wins for CI overrides
  return { ...fromDotenv, ...fromLocal, ...process.env };
}

async function findUserByEmail(admin, email) {
  const target = email.toLowerCase();
  let page = 1;
  const perPage = 200;

  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    const found = users.find((u) => (u.email || "").toLowerCase() === target);
    if (found) return found;
    if (users.length < perPage) return null;
    page += 1;
    if (page > 50) return null;
  }
}

async function main() {
  const env = loadEnv();
  const configPath = path.join(
    process.cwd(),
    "supabase",
    "seed-admin.config.js"
  );
  if (!fs.existsSync(configPath)) {
    console.error("Missing supabase/seed-admin.config.js");
    process.exit(1);
  }

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const config = require(configPath);
  const email = (
    env.SEED_ADMIN_EMAIL ||
    config.email ||
    ""
  ).trim();
  const displayName = (
    env.SEED_ADMIN_NAME ||
    config.displayName ||
    "Super Admin"
  ).trim();
  const password = (env.SEED_ADMIN_PASSWORD || "").trim();

  const url = (env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const serviceKey = (
    env.SUPABASE_SERVICE_ROLE_KEY ||
    env.SUPABASE_SECRET_KEY ||
    ""
  ).trim();

  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
    process.exit(1);
  }
  if (!email) {
    console.error("Set email in supabase/seed-admin.config.js or SEED_ADMIN_EMAIL");
    process.exit(1);
  }
  if (!password || password.length < 6) {
    console.error(
      "Set SEED_ADMIN_PASSWORD in .env.local (min 6 characters), then re-run."
    );
    process.exit(1);
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const existing = await findUserByEmail(admin, email);
  const appMetadata = {
    role: "admin",
    super_admin: true,
  };

  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      app_metadata: {
        ...existing.app_metadata,
        ...appMetadata,
      },
      user_metadata: {
        ...existing.user_metadata,
        display_name: displayName,
      },
    });
    if (error) {
      console.error("Failed to update super admin:", error.message);
      process.exit(1);
    }

    await admin
      .from("profiles")
      .upsert({ id: data.user.id, display_name: displayName });

    console.log(`Updated super admin: ${email} (id=${data.user.id})`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: appMetadata,
      user_metadata: { display_name: displayName },
    });
    if (error) {
      console.error("Failed to create super admin:", error.message);
      process.exit(1);
    }

    await admin
      .from("profiles")
      .upsert({ id: data.user.id, display_name: displayName });

    console.log(`Created super admin: ${email} (id=${data.user.id})`);
  }

  console.log("Sign in at /login with that email and SEED_ADMIN_PASSWORD.");
  console.log(
    "To change the account later: edit supabase/seed-admin.config.js and/or .env.local, then run npm run seed:admin again."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
