import Image from "next/image";
import Link from "next/link";
import { Calendar, Megaphone } from "lucide-react";
import MediaPlaceholder from "@/components/media/MediaPlaceholder";
import { listPublishedNews } from "@/lib/news";

export default async function News() {
  const newsItems = await listPublishedNews();

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest News & Updates
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Stay informed on our latest activities, announcements, and
            environmental milestones.
          </p>
        </div>

        {newsItems.length === 0 ? (
          <p className="mx-auto mt-16 max-w-lg text-center text-gray-600">
            News updates will appear here once published.
          </p>
        ) : (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {newsItems.map((post) => {
              const dateLabel = new Date(post.publishedAt).toLocaleDateString(
                undefined,
                { year: "numeric", month: "long", day: "numeric" }
              );
              return (
                <article
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <Link
                    href={`/news/${post.id}`}
                    className="relative block aspect-[16/10] bg-gray-100"
                  >
                    {post.coverImageUrl ? (
                      <Image
                        src={post.coverImageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    ) : (
                      <MediaPlaceholder label="NEWMAP news" />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                      <time
                        dateTime={post.publishedAt}
                        className="flex items-center gap-1 text-gray-500"
                      >
                        <Calendar className="h-4 w-4" /> {dateLabel}
                      </time>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-600">
                        <Megaphone className="h-3 w-3" /> Announcement
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900">
                      <Link
                        href={`/news/${post.id}`}
                        className="hover:text-green-700"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-600">
                      {post.summary}
                    </p>
                    <Link
                      href={`/news/${post.id}`}
                      className="mt-4 text-sm font-semibold text-green-700 hover:text-green-800"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
