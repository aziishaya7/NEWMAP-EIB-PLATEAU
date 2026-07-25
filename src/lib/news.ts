import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type NewsPost = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

function mapNews(row: {
  id: string;
  title: string;
  summary: string;
  published_at: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}): NewsPost {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary ?? "",
    publishedAt: row.published_at,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPublishedNews(): Promise<NewsPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("News fetch error:", error.message);
    return [];
  }
  return (data ?? []).map(mapNews);
}

export async function listAllNews(): Promise<NewsPost[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("news_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Admin news fetch error:", error.message);
    return [];
  }
  return (data ?? []).map(mapNews);
}

export async function countPublishedNews(): Promise<number> {
  const admin = createAdminClient();
  const { count } = await admin
    .from("news_posts")
    .select("id", { count: "exact", head: true })
    .eq("published", true);
  return count ?? 0;
}
