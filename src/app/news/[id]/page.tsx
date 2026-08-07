import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import MediaPlaceholder from "@/components/media/MediaPlaceholder";
import { getPublishedNewsById } from "@/lib/news";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPublishedNewsById(id);
  if (!post) notFound();

  const dateLabel = new Date(post.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <p className="mb-8">
          <Link
            href="/news"
            className="text-sm font-semibold text-green-700 hover:text-green-800"
          >
            ← Back to news
          </Link>
        </p>

        <header>
          <time
            dateTime={post.publishedAt}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500"
          >
            <Calendar className="h-4 w-4" />
            {dateLabel}
          </time>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>
          {post.summary ? (
            <p className="mt-4 text-lg leading-8 text-gray-600">{post.summary}</p>
          ) : null}
        </header>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          ) : (
            <MediaPlaceholder label="NEWMAP news" />
          )}
        </div>

        <div className="mt-10 whitespace-pre-wrap text-base leading-8 text-gray-800">
          {post.body || post.summary || "No additional content."}
        </div>
      </div>
    </article>
  );
}
