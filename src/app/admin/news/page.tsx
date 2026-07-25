import NewsManager from "@/components/admin/NewsManager";
import { listAllNews } from "@/lib/news";

export default async function AdminNewsPage() {
  const posts = await listAllNews();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">News</h2>
        <p className="mt-1 text-sm text-gray-600">
          Publish announcements shown on the public News page.
        </p>
      </div>
      <NewsManager initialPosts={posts} />
    </div>
  );
}
