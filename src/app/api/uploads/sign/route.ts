import { NextResponse } from "next/server";
import { AuthError, isAdmin, requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { GALLERY_BUCKET } from "@/lib/supabase/constants";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const MAX_BYTES = 5 * 1024 * 1024;

function extensionFor(mime: string, filename: string): string {
  const fromName = filename.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "gif", "webp"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  switch (mime) {
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

function errorMessage(error: unknown): string {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  if (error instanceof Error) {
    const cause =
      error.cause instanceof Error
        ? error.cause.message
        : error.cause
          ? String(error.cause)
          : "";
    return cause ? `${error.message} (${cause})` : error.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

async function createSignedUploadUrlNative(objectPath: string) {
  const url = getSupabaseUrl().replace(/\/$/, "");
  const key = getSupabaseServiceRoleKey();
  const endpoint = `${url}/storage/v1/object/upload/sign/${GALLERY_BUCKET}/${objectPath}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        `Storage sign failed with HTTP ${response.status}`
    );
  }

  const token = payload?.token as string | undefined;
  if (!token) {
    throw new Error("Storage did not return an upload token.");
  }

  return {
    path: objectPath,
    token,
    signedUrl: `${url}/storage/v1/object/upload/sign/${GALLERY_BUCKET}/${objectPath}?token=${encodeURIComponent(token)}`,
  };
}

async function createSignedUploadUrlWithRetry(objectPath: string) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await createSignedUploadUrlNative(objectPath);
    } catch (error) {
      lastError = error;
      const message = errorMessage(error).toLowerCase();
      const retryable =
        message.includes("fetch failed") ||
        message.includes("network") ||
        message.includes("timeout") ||
        message.includes("econnreset") ||
        message.includes("enotfound");

      if (!retryable || attempt === 3) break;
      await new Promise((r) => setTimeout(r, attempt * 400));
    }
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.storage
      .from(GALLERY_BUCKET)
      .createSignedUploadUrl(objectPath);

    if (error || !data) {
      throw new Error(error?.message || "Could not create upload URL.");
    }

    return {
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
    };
  } catch (error) {
    throw new Error(
      `${errorMessage(lastError)} | fallback: ${errorMessage(error)}`
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const filename = String(body.filename ?? "");
    const contentType = String(body.contentType ?? "");
    const purpose = String(body.purpose ?? "progress");

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename and contentType are required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, GIF, or WebP images are allowed." },
        { status: 400 }
      );
    }

    if (purpose === "news" && !isAdmin(user)) {
      return NextResponse.json(
        { error: "Admin access required for news covers." },
        { status: 403 }
      );
    }

    const safeBase = filename
      .replace(/\.[^.]+$/, "")
      .replace(/[^\w.-]+/g, "_")
      .slice(0, 80);
    const ext = extensionFor(contentType, filename);
    const path =
      purpose === "news"
        ? `news/${Date.now()}-${safeBase || "cover"}.${ext}`
        : `${user.id}/${Date.now()}-${safeBase || "upload"}.${ext}`;

    const data = await createSignedUploadUrlWithRetry(path);

    return NextResponse.json({
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
      maxBytes: MAX_BYTES,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/uploads/sign", error);
    return NextResponse.json(
      {
        error:
          errorMessage(error) ||
          "Failed to prepare upload. Check SUPABASE_SERVICE_ROLE_KEY and restart npm run dev.",
      },
      { status: 500 }
    );
  }
}
