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
    const projectId = String(body.projectId ?? "").trim();
    const progressPct = Number(body.progressPct);

    if (!title || !imagePath) {
      return NextResponse.json(
        { error: "title and imagePath are required." },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: "Select a project for this progress photo." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(progressPct) ||
      progressPct < 0 ||
      progressPct > 100
    ) {
      return NextResponse.json(
        { error: "progressPct must be between 0 and 100." },
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
    const pct = Math.round(progressPct);

    const admin = createAdminClient();

    const { data: project, error: projectError } = await admin
      .from("projects")
      .select("id, progress")
      .eq("id", projectId)
      .maybeSingle();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found." }, { status: 400 });
    }

    const { data, error } = await admin
      .from("gallery_items")
      .insert({
        title,
        description,
        image_path: imagePath,
        status,
        user_id: user.id,
        project_id: projectId,
        progress_pct: pct,
      })
      .select(
        "id, title, description, image_path, created_at, status, project_id, progress_pct"
      )
      .single();

    if (error || !data) {
      console.error("Gallery insert error:", error?.message);
      const hint =
        error?.message?.includes("schema cache") ||
        error?.message?.includes("gallery_items") ||
        error?.message?.includes("project_id") ||
        error?.message?.includes("progress_pct")
          ? " Run supabase/migrations/005_project_progress_media.sql (or npm run db:migrate), then retry."
          : "";
      return NextResponse.json(
        {
          error: `${error?.message ?? "Failed to save gallery item."}${hint}`,
        },
        { status: 500 }
      );
    }

    if (status === "approved") {
      if (pct > (project.progress ?? 0)) {
        await admin
          .from("projects")
          .update({ progress: pct })
          .eq("id", projectId);
      }
      revalidatePath("/gallery");
      revalidatePath("/projects");
      revalidatePath(`/projects/${projectId}`);
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
        projectId: data.project_id,
        progressPct: data.progress_pct,
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
