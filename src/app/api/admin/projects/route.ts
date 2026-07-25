import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { AuthError, requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const statusLabel = String(body.statusLabel ?? "").trim();
    const progress = Number(body.progress ?? 0);
    const published = Boolean(body.published);
    const sortOrder = Number(body.sortOrder ?? 0);

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (Number.isNaN(progress) || progress < 0 || progress > 100) {
      return NextResponse.json({ error: "Progress must be 0–100." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("projects")
      .insert({
        title,
        description,
        status_label: statusLabel,
        progress,
        published,
        sort_order: sortOrder,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, project: data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
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

    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.description !== undefined)
      updates.description = String(body.description).trim();
    if (body.statusLabel !== undefined)
      updates.status_label = String(body.statusLabel).trim();
    if (body.progress !== undefined) {
      const progress = Number(body.progress);
      if (Number.isNaN(progress) || progress < 0 || progress > 100) {
        return NextResponse.json({ error: "Progress must be 0–100." }, { status: 400 });
      }
      updates.progress = progress;
    }
    if (body.published !== undefined) updates.published = Boolean(body.published);
    if (body.sortOrder !== undefined) updates.sort_order = Number(body.sortOrder);

    const admin = createAdminClient();
    const { error } = await admin.from("projects").update(updates).eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
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
    const { error } = await admin.from("projects").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
  }
}
