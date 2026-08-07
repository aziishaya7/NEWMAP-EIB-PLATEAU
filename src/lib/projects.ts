import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type Project = {
  id: string;
  title: string;
  description: string;
  statusLabel: string;
  progress: number;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function mapProject(row: {
  id: string;
  title: string;
  description: string;
  status_label: string;
  progress: number;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    statusLabel: row.status_label ?? "",
    progress: row.progress ?? 0,
    published: row.published,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPublishedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Projects fetch error:", error.message);
    return [];
  }
  return (data ?? []).map(mapProject);
}

export async function getPublishedProjectById(
  id: string
): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Project by id error:", error.message);
    return null;
  }
  return data ? mapProject(data) : null;
}

export async function listAllProjects(): Promise<Project[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin projects fetch error:", error.message);
    return [];
  }
  return (data ?? []).map(mapProject);
}

export async function countPublishedProjects(): Promise<number> {
  const admin = createAdminClient();
  const { count } = await admin
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("published", true);
  return count ?? 0;
}
