#!/usr/bin/env node
/**
 * Applies supabase/migrations/001_gallery.sql
 *
 * Requires DATABASE_URL in .env / .env.local
 * (Supabase → Project Settings → Database → URI)
 *
 * Direct `db.<ref>.supabase.co` hosts are often IPv6-only. If that fails,
 * this script retries via the Supabase connection pooler (IPv4).
 */
const fs = require("fs");
const path = require("path");
const dns = require("dns").promises;
const { Client } = require("pg");

function loadEnv() {
  const env = {};
  for (const file of [".env", ".env.local"]) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
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
      if (val) env[key] = val;
    }
  }
  return env;
}

function projectRefFromEnv(env, databaseUrl) {
  try {
    const api = env.NEXT_PUBLIC_SUPABASE_URL;
    if (api) {
      const host = new URL(api).hostname; // <ref>.supabase.co
      const ref = host.split(".")[0];
      if (ref) return ref;
    }
  } catch {
    // ignore
  }
  const match = databaseUrl.match(/@db\.([a-z0-9]+)\.supabase\.co/i);
  return match?.[1] || null;
}

function buildCandidates(databaseUrl, env) {
  const u = new URL(databaseUrl);
  const password = decodeURIComponent(u.password);
  const database = (u.pathname || "/postgres").replace(/^\//, "") || "postgres";
  const ref = projectRefFromEnv(env, databaseUrl);
  const candidates = [];

  candidates.push({
    label: "DATABASE_URL",
    config: {
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    },
  });

  if (ref) {
    const regions = [
      "eu-west-1",
      "eu-central-1",
      "us-east-1",
      "eu-west-2",
      "ap-southeast-1",
    ];
    for (const region of regions) {
      candidates.push({
        label: `pooler-${region}-6543`,
        config: {
          host: `aws-0-${region}.pooler.supabase.com`,
          port: 6543,
          user: `postgres.${ref}`,
          password,
          database,
          ssl: { rejectUnauthorized: false },
        },
      });
    }
  }

  return candidates;
}

async function main() {
  const env = loadEnv();
  const databaseUrl = env.DATABASE_URL || env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    console.error(
      "Missing DATABASE_URL.\n" +
        "1. Supabase Dashboard → Project Settings → Database\n" +
        "2. Copy the Connection string (URI), replace [YOUR-PASSWORD]\n" +
        "3. Add to .env.local:\n" +
        "   DATABASE_URL=postgresql://..."
    );
    process.exit(1);
  }

  const sqlPath = path.join(
    __dirname,
    "..",
    "supabase",
    "migrations",
    "001_gallery.sql"
  );
  const sql = fs.readFileSync(sqlPath, "utf8");
  const candidates = buildCandidates(databaseUrl, env);
  let lastError = null;

  for (const candidate of candidates) {
    const client = new Client(candidate.config);
    try {
      await client.connect();
      await client.query(sql);
      const check = await client.query(
        `select to_regclass('public.gallery_items') as table_name`
      );
      console.log(
        `Migration applied via ${candidate.label}. gallery_items =`,
        check.rows[0]?.table_name || "MISSING"
      );
      await client.end();
      return;
    } catch (error) {
      lastError = error;
      const code = error.code || "";
      console.warn(`Retry needed (${candidate.label}): ${code || error.message}`);
      try {
        await client.end();
      } catch {
        // ignore
      }
    }
  }

  // Optional IPv6 direct attempt for diagnostics
  try {
    const host = new URL(databaseUrl).hostname;
    const aaaa = await dns.resolve6(host);
    if (aaaa[0]) {
      console.warn(
        `Direct host has IPv6 (${aaaa[0]}) but this machine could not use it. Pooler fallback also failed.`
      );
    }
  } catch {
    // ignore
  }

  console.error("Migration failed:", lastError?.message || "unknown error");
  process.exit(1);
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
