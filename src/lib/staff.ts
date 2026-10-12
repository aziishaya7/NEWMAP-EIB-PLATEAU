import { publicStorageUrl } from "@/lib/gallery";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { nodeSupabaseHostResolves } from "@/lib/supabase/node-fetch";
import { createClient } from "@/lib/supabase/server";

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  imagePath: string | null;
  imageUrl: string | null;
  published: boolean;
  sortOrder: number;
};

const STAFF_COLUMNS =
  "id, name, role, email, phone, image_path, published, sort_order";

type StaffRow = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  image_path: string | null;
  published: boolean;
  sort_order: number;
};

export function staffImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("/")) return path;
  return publicStorageUrl(path);
}

function mapStaff(row: StaffRow): StaffMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    email: row.email ?? "",
    phone: row.phone ?? "",
    imagePath: row.image_path,
    imageUrl: staffImageUrl(row.image_path),
    published: row.published,
    sortOrder: row.sort_order,
  };
}

/** Shown when the database is unreachable so the public page is not blank. */
const fallbackStaff: StaffMember[] = [
  ["Amina Yusuf", "State Project Coordinator", "amina.yusuf@newmapeibplateau.example", "+234 803 000 0001", "/staff/staff-1.jpg"],
  ["Chinedu Okonkwo", "Environmental Specialist", "chinedu.okonkwo@newmapeibplateau.example", "+234 803 000 0002", "/staff/staff-2.jpg"],
  ["Grace Pam", "Community Liaison Officer", "grace.pam@newmapeibplateau.example", "+234 803 000 0003", "/staff/staff-3.jpg"],
  ["Ibrahim Danladi", "Civil Engineer", "ibrahim.danladi@newmapeibplateau.example", "+234 803 000 0004", "/staff/staff-4.jpg"],
  ["Sarah Dung", "Monitoring and Evaluation Officer", "sarah.dung@newmapeibplateau.example", "+234 803 000 0005", "/staff/staff-5.jpg"],
  ["Peter Gyang", "Communications Officer", "peter.gyang@newmapeibplateau.example", "+234 803 000 0006", "/staff/staff-6.jpg"],
].map(([name, role, email, phone, image], index) => ({
  id: `fallback-${index + 1}`,
  name,
  role,
  email,
  phone,
  imagePath: image,
  imageUrl: image,
  published: true,
  sortOrder: index + 1,
}));

export async function listPublishedStaff(): Promise<StaffMember[]> {
  if (!(await nodeSupabaseHostResolves(getSupabaseUrl()))) return fallbackStaff;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff_members")
    .select(STAFF_COLUMNS)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Staff fetch error:", error.message);
    return fallbackStaff;
  }
  return (data ?? []).map(mapStaff);
}

export async function listAllStaff(): Promise<StaffMember[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("staff_members")
      .select(STAFF_COLUMNS)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Admin staff fetch error:", error.message);
      return [];
    }
    return (data ?? []).map(mapStaff);
  } catch (error) {
    console.error("Admin staff fetch error:", error);
    return [];
  }
}

export async function countPublishedStaff(): Promise<number> {
  try {
    const admin = createAdminClient();
    const { count, error } = await admin
      .from("staff_members")
      .select("id", { count: "exact", head: true })
      .eq("published", true);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
