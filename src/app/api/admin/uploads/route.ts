import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { AuthError, requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const id = String(body.id ?? "");
    const status = String(body.status ?? "");

    if (!id || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid id or status." }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data: item, error: fetchError } = await admin
      .from("gallery_items")
      .select("id, project_id, progress_pct")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !item) {
      return NextResponse.json(
        { error: fetchError?.message || "Upload not found." },
        { status: 404 }
      );
    }

    const { error } = await admin
      .from("gallery_items")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (status === "approved" && item.project_id) {
      const pct = item.progress_pct ?? 0;
      const { data: project } = await admin
        .from("projects")
        .select("progress")
        .eq("id", item.project_id)
        .maybeSingle();

      if (project && pct > (project.progress ?? 0)) {
        await admin
          .from("projects")
          .update({ progress: pct })
          .eq("id", item.project_id);
      }
      revalidatePath(`/projects/${item.project_id}`);
      revalidatePath("/projects");
    }

    revalidatePath("/gallery");
    revalidatePath("/admin");
    revalidatePath("/admin/uploads");
    revalidatePath("/profile");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to update upload." }, { status: 500 });
  }
}
