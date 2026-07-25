import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { AuthError, requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const summary = String(body.summary ?? "").trim();
    const publishedAt = String(body.publishedAt ?? "").trim();
    const published = Boolean(body.published);

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("news_posts")
      .insert({
        title,
        summary,
        published_at: publishedAt || new Date().toISOString().slice(0, 10),
        published,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/news");
    revalidatePath("/admin/news");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, post: data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to create news post." }, { status: 500 });
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
    if (body.summary !== undefined) updates.summary = String(body.summary).trim();
    if (body.publishedAt !== undefined)
      updates.published_at = String(body.publishedAt).trim();
    if (body.published !== undefined) updates.published = Boolean(body.published);

    const admin = createAdminClient();
    const { error } = await admin.from("news_posts").update(updates).eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/news");
    revalidatePath("/admin/news");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to update news post." }, { status: 500 });
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
    const { error } = await admin.from("news_posts").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/news");
    revalidatePath("/admin/news");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to delete news post." }, { status: 500 });
  }
}
