"use client";

import Image from "next/image";
import Link from "next/link";
import MediaPlaceholder from "@/components/media/MediaPlaceholder";

export function ProgressPctBadge({
  pct,
  className = "",
}: {
  pct: number;
  className?: string;
}) {
  return (
    <span
      className={`absolute right-2 top-2 z-10 rounded-md bg-green-700 px-2 py-1 text-xs font-bold text-white shadow-sm ring-1 ring-black/10 ${className}`}
    >
      {pct}%
    </span>
  );
}

export type ProgressMediaCardProps = {
  imageUrl: string | null;
  title: string;
  description?: string;
  progressPct?: number;
  projectTitle?: string | null;
  projectHref?: string | null;
  onOpen?: () => void;
};

/** Image card with always-visible captions (mobile-safe) and optional % badge. */
export default function ProgressMediaCard({
  imageUrl,
  title,
  description,
  progressPct,
  projectTitle,
  projectHref,
  onOpen,
}: ProgressMediaCardProps) {
  return (
    <figure className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
      <div className="relative aspect-[4/3] bg-gray-100">
        {typeof progressPct === "number" && (
          <ProgressPctBadge pct={progressPct} />
        )}
        {imageUrl ? (
          <button
            type="button"
            onClick={onOpen}
            className="absolute inset-0 block cursor-zoom-in"
            aria-label={`View ${title} larger`}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </button>
        ) : (
          <MediaPlaceholder label="Awaiting photo" />
        )}
      </div>
      <figcaption className="flex flex-1 flex-col gap-1 p-4">
        {projectTitle && (
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
            {projectHref ? (
              <Link href={projectHref} className="hover:underline">
                {projectTitle}
              </Link>
            ) : (
              projectTitle
            )}
          </p>
        )}
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description ? (
          <p className="line-clamp-2 text-sm text-gray-600">{description}</p>
        ) : null}
      </figcaption>
    </figure>
  );
}
