import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { AuthError, isSuperAdmin, requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSuperAdminEmail } from "@/lib/super-admin";

function roleOf(user: {
  app_metadata?: Record<string, unknown>;
  email?: string;
}): "admin" | "user" {
  if (
    user.app_metadata?.role === "admin" ||
    user.app_metadata?.super_admin === true ||
    isSuperAdminEmail(user.email)
  ) {
    return "admin";
  }
  return "user";
}

function isProtectedSuperAdmin(user: {
  app_metadata?: Record<string, unknown>;
  email?: string;
}): boolean {
  return (
    user.app_metadata?.super_admin === true || isSuperAdminEmail(user.email)
  );
}

export async function GET() {
  try {
    const current = await requireAdmin();
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const profileIds = data.users.map((u) => u.id);
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, display_name")
      .in("id", profileIds);

    const nameById = Object.fromEntries(
      (profiles ?? []).map((p) => [p.id, p.display_name])
    );

    const users = data.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      displayName: nameById[u.id] || u.email?.split("@")[0] || "User",
      role: roleOf(u),
      isSuperAdmin: isProtectedSuperAdmin(u),
      createdAt: u.created_at,
      isSelf: u.id === current.id,
    }));

    return NextResponse.json({
      users,
      canCreateAdmins: isSuperAdmin(current),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to list users." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const current = await requireAdmin();
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const displayName = String(body.displayName ?? "").trim();
    const role = String(body.role ?? "user");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }
    if (!["admin", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    if (role === "admin" && !isSuperAdmin(current)) {
      return NextResponse.json(
        { error: "Only the super admin can create other admins." },
        { status: 403 }
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role },
      user_metadata: displayName ? { display_name: displayName } : undefined,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Failed to create user." },
        { status: 500 }
      );
    }

    if (displayName) {
      await admin
        .from("profiles")
        .upsert({ id: data.user.id, display_name: displayName });
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      user: { id: data.user.id, email: data.user.email, role },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const current = await requireAdmin();
    const body = await request.json();
    const userId = String(body.userId ?? "");
    const role = String(body.role ?? "");

    if (!userId || !["admin", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid userId or role." }, { status: 400 });
    }

    if (userId === current.id && role !== "admin") {
      return NextResponse.json(
        { error: "You cannot remove your own admin role." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data: existing, error: getError } =
      await admin.auth.admin.getUserById(userId);

    if (getError || !existing.user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (isProtectedSuperAdmin(existing.user) && role !== "admin") {
      return NextResponse.json(
        { error: "The seeded super admin cannot be demoted." },
        { status: 400 }
      );
    }

    if (role === "admin" && !isSuperAdmin(current) && !isProtectedSuperAdmin(existing.user)) {
      // Regular admins may not promote others — only super admin can.
      // Allow if already admin? promoting user→admin requires super admin.
      return NextResponse.json(
        { error: "Only the super admin can promote users to admin." },
        { status: 403 }
      );
    }

    const nextMeta: Record<string, unknown> = {
      ...existing.user.app_metadata,
      role,
    };
    // Never strip super_admin flag via role demotion path (already blocked above)
    if (isProtectedSuperAdmin(existing.user)) {
      nextMeta.super_admin = true;
      nextMeta.role = "admin";
    }

    const { error } = await admin.auth.admin.updateUserById(userId, {
      app_metadata: nextMeta,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/admin/users");
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}
