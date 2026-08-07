import { createAdminClient } from "@/lib/supabase/admin";
import { GALLERY_BUCKET } from "@/lib/supabase/constants";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  status?: string;
  userId?: string | null;
  projectId?: string | null;
  progressPct: number;
  projectTitle?: string | null;
};

export type GalleryItemAdmin = GalleryItem & {
  status: string;
  userId: string | null;
  uploaderName?: string;
};

export function publicStorageUrl(path: string): string {
  const base = getSupabaseUrl().replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${GALLERY_BUCKET}/${path}`;
}

type GalleryRow = {
  id: string;
  title: string;
  description: string | null;
  image_path: string;
  created_at: string;
  status?: string;
  user_id?: string | null;
  project_id?: string | null;
  progress_pct?: number | null;
  projects?: { title: string } | { title: string }[] | null;
};

function projectTitleFromJoin(
  projects: GalleryRow["projects"]
): string | null {
  if (!projects) return null;
  if (Array.isArray(projects)) return projects[0]?.title ?? null;
  return projects.title ?? null;
}

function mapRow(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    imageUrl: publicStorageUrl(row.image_path),
    date: row.created_at,
    status: row.status,
    userId: row.user_id,
    projectId: row.project_id ?? null,
    progressPct: row.progress_pct ?? 0,
    projectTitle: projectTitleFromJoin(row.projects),
  };
}

const PUBLIC_SELECT =
  "id, title, description, image_path, created_at, status, user_id, project_id, progress_pct, projects(title)";

export async function listApprovedGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select(PUBLIC_SELECT)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    const admin = createAdminClient();
    const retry = await admin
      .from("gallery_items")
      .select(PUBLIC_SELECT)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (retry.error) {
      console.error("Gallery fetch error:", retry.error.message);
      return [];
    }

    return (retry.data ?? []).map(mapRow);
  }

  return (data ?? []).map(mapRow);
}

export async function listApprovedProgressForProject(
  projectId: string
): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select(PUBLIC_SELECT)
    .eq("status", "approved")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Project progress fetch error:", error.message);
    return [];
  }
  return (data ?? []).map(mapRow);
}

export async function listUserGalleryItems(
  userId: string
): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select(PUBLIC_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("User gallery fetch error:", error.message);
    return [];
  }

  return (data ?? []).map(mapRow);
}

export async function listPendingGalleryItems(): Promise<GalleryItemAdmin[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("gallery_items")
    .select(PUBLIC_SELECT)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Pending gallery fetch error:", error.message);
    return [];
  }

  const rows = data ?? [];
  const userIds = [
    ...new Set(rows.map((r) => r.user_id).filter(Boolean) as string[]),
  ];

  let nameById: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);
    nameById = Object.fromEntries(
      (profiles ?? []).map((p) => [p.id, p.display_name])
    );
  }

  return rows.map((row) => ({
    ...mapRow(row),
    status: row.status ?? "pending",
    userId: row.user_id ?? null,
    uploaderName: row.user_id
      ? nameById[row.user_id] ?? "Unknown"
      : "Unknown",
  }));
}

export async function countGalleryByStatus(
  status: string
): Promise<number> {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("gallery_items")
    .select("id", { count: "exact", head: true })
    .eq("status", status);

  if (error) return 0;
  return count ?? 0;
}

/** Latest approved progress image URL per project id. */
export async function latestCoverByProjectIds(
  projectIds: string[]
): Promise<Record<string, string>> {
  if (projectIds.length === 0) return {};
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("gallery_items")
    .select("project_id, image_path, created_at")
    .eq("status", "approved")
    .in("project_id", projectIds)
    .order("created_at", { ascending: false });

  if (error || !data) return {};

  const covers: Record<string, string> = {};
  for (const row of data) {
    if (!row.project_id || covers[row.project_id]) continue;
    covers[row.project_id] = publicStorageUrl(row.image_path);
  }
  return covers;
}
