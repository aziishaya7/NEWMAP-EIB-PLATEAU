import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { AuthError, requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const registrationOpen = Boolean(body.registrationOpen);

    const admin = createAdminClient();
    const { error } = await admin
      .from("app_settings")
      .update({ registration_open: registrationOpen })
      .eq("id", 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/register");
    revalidatePath("/admin/settings");

    return NextResponse.json({ success: true, registrationOpen });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
