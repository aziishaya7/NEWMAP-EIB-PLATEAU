import Link from "next/link";
import { countGalleryByStatus } from "@/lib/gallery";
import { countPublishedNews } from "@/lib/news";
import { countPublishedProjects } from "@/lib/projects";
import { createAdminClient } from "@/lib/supabase/admin";

async function countUsers(): Promise<number> {
  try {
    const admin = createAdminClient();
    const { count, error } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true });
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function AdminOverviewPage() {
  const [pending, users, projects, news] = await Promise.all([
    countGalleryByStatus("pending"),
    countUsers(),
    countPublishedProjects(),
    countPublishedNews(),
  ]);

  const cards = [
    {
      label: "Pending uploads",
      value: pending,
      href: "/admin/uploads",
      hint: "Awaiting review",
    },
    {
      label: "Users",
      value: users,
      href: "/admin/users",
      hint: "Registered accounts",
    },
    {
      label: "Published projects",
      value: projects,
      href: "/admin/projects",
      hint: "Live on site",
    },
    {
      label: "Published news",
      value: news,
      href: "/admin/news",
      hint: "Live on site",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-1 text-xs text-gray-500">{card.hint}</p>
          </Link>
        ))}
      </div>

      {pending > 0 && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">
            {pending} upload{pending === 1 ? "" : "s"} waiting for review
          </p>
          <Link
            href="/admin/uploads"
            className="mt-2 inline-block text-sm font-semibold text-green-800 hover:underline"
          >
            Review now →
          </Link>
        </div>
      )}
    </div>
  );
}
