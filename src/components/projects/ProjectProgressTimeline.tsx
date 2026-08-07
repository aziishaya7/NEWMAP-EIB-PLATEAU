"use client";

import { useState } from "react";
import ImageLightbox, {
  type LightboxItem,
} from "@/components/media/ImageLightbox";
import ProgressMediaCard from "@/components/media/ProgressMediaCard";
import type { GalleryItem } from "@/lib/gallery";

export default function ProjectProgressTimeline({
  items,
}: {
  items: GalleryItem[];
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <p className="mt-10 text-center text-gray-600">
        No progress photos published for this project yet.
      </p>
    );
  }

  const lightboxItems: LightboxItem[] = items.map((img) => ({
    src: img.imageUrl,
    alt: img.title,
    caption: `${img.title} · ${img.progressPct}%`,
  }));

  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((img, i) => (
          <ProgressMediaCard
            key={img.id}
            imageUrl={img.imageUrl}
            title={img.title}
            description={img.description}
            progressPct={img.progressPct}
            onOpen={() => setLightboxIndex(i)}
          />
        ))}
      </div>
      <ImageLightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
