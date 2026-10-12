import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { AuthError, requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { GALLERY_BUCKET } from "@/lib/supabase/constants";

function revalidateStaff() {
  revalidatePath("/staff");
  revalidatePath("/admin/staff");
  revalidatePath("/admin");
}

function cleanImagePath(value: unknown): string | null | { error: string } {
  if (value === null || value === undefined || value === "") return null;
  const path = String(value).trim();
  if (path.includes("..")) return { error: "Invalid portrait path." };
  const localPortrait = path.startsWith("/staff/") && !path.slice(7).includes("/");
  const uploaded = path.startsWith("staff/") && !path.startsWith("/");
  if (!localPortrait && !uploaded) {
    return { error: "Invalid portrait path." };
  }
  return path;
}

function parseMember(
  body: Record<string, unknown>,
  partial: boolean
): { error: string } | { updates: Record<string, unknown> } {
  const updates: Record<string, unknown> = {};

  if (!partial || body.name !== undefined) {
    const name = String(body.name ?? "").trim();
    if (!name || name.length > 120) {
      return { error: "Name is required (120 characters max)." };
    }
    updates.name = name;
  }
  if (!partial || body.role !== undefined) {
    const role = String(body.role ?? "").trim();
    if (!role || role.length > 120) {
      return { error: "Role is required (120 characters max)." };
    }
    updates.role = role;
  }
  if (!partial || body.email !== undefined) {
    const email = String(body.email ?? "").trim();
    if (email.length > 200) return { error: "Email is too long." };
    updates.email = email;
  }
  if (!partial || body.phone !== undefined) {
    const phone = String(body.phone ?? "").trim();
    if (phone.length > 40) return { error: "Phone is too long." };
    updates.phone = phone;
  }
  if (!partial || body.sortOrder !== undefined) {
    const sortOrder = Number(body.sortOrder ?? 0);
    if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 9999) {
      return { error: "Sort order must be a whole number from 0 to 9999." };
    }
    updates.sort_order = sortOrder;
  }
  if (!partial || body.published !== undefined) {
    updates.published = Boolean(body.published);
  }
  if (!partial || body.imagePath !== undefined) {
    const imagePath = cleanImagePath(body.imagePath);
    if (imagePath && typeof imagePath === "object" && "error" in imagePath) {
      return imagePath;
    }
    updates.image_path = imagePath;
  }

  return { updates };
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = parseMember(body, false);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("staff_members")
      .insert(parsed.updates)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateStaff();
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to add staff member." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const id = String(body.id ?? "");
    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    const parsed = parseMember(body, true);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("staff_members")
      .update(parsed.updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateStaff();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to update staff member." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: existing } = await admin
      .from("staff_members")
      .select("image_path")
      .eq("id", id)
      .maybeSingle();

    const { error } = await admin.from("staff_members").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const imagePath = existing?.image_path as string | undefined;
    if (imagePath?.startsWith("staff/") && !imagePath.includes("..")) {
      await admin.storage.from(GALLERY_BUCKET).remove([imagePath]);
    }

    revalidateStaff();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to delete staff member." }, { status: 500 });
  }
}
