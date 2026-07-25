import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { AuthError, isAdmin, requireUser } from "@/lib/auth";
import { publicStorageUrl } from "@/lib/gallery";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const imagePath = String(body.imagePath ?? "").trim();

    if (!title || !imagePath) {
      return NextResponse.json(
        { error: "title and imagePath are required." },
        { status: 400 }
      );
    }

    if (
      imagePath.includes("..") ||
      imagePath.startsWith("/") ||
      !imagePath.startsWith(`${user.id}/`)
    ) {
      return NextResponse.json({ error: "Invalid image path." }, { status: 400 });
    }

    const status = isAdmin(user) ? "approved" : "pending";

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("gallery_items")
      .insert({
        title,
        description,
        image_path: imagePath,
        status,
        user_id: user.id,
      })
      .select("id, title, description, image_path, created_at, status")
      .single();

    if (error || !data) {
      console.error("Gallery insert error:", error?.message);
      const hint =
        error?.message?.includes("schema cache") ||
        error?.message?.includes("gallery_items") ||
        error?.message?.includes("user_id")
          ? " Run supabase/migrations/002_auth_cms.sql in the Supabase SQL Editor, then retry."
          : "";
      return NextResponse.json(
        {
          error: `${error?.message ?? "Failed to save gallery item."}${hint}`,
        },
        { status: 500 }
      );
    }

    if (status === "approved") {
      revalidatePath("/gallery");
    }
    revalidatePath("/profile");
    revalidatePath("/admin");
    revalidatePath("/admin/uploads");

    return NextResponse.json({
      success: true,
      status: data.status,
      item: {
        id: data.id,
        title: data.title,
        description: data.description,
        imageUrl: publicStorageUrl(data.image_path),
        date: data.created_at,
        status: data.status,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/uploads", error);
    return NextResponse.json(
      { error: "Failed to save upload metadata." },
      { status: 500 }
    );
  }
}
