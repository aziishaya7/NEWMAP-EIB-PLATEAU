"use client";

import { useState } from "react";
import ImageLightbox, {
  type LightboxItem,
} from "@/components/media/ImageLightbox";
import ProgressMediaCard from "@/components/media/ProgressMediaCard";
import type { GalleryItem } from "@/lib/gallery";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxItems: LightboxItem[] = items.map((img) => ({
    src: img.imageUrl,
    alt: img.title,
    caption: [
      img.projectTitle,
      img.title,
      img.progressPct != null ? `${img.progressPct}%` : null,
    ]
      .filter(Boolean)
      .join(" · "),
  }));

  return (
    <>
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {items.map((img, i) => (
          <ProgressMediaCard
            key={img.id}
            imageUrl={img.imageUrl}
            title={img.title}
            description={img.description}
            progressPct={img.progressPct}
            projectTitle={img.projectTitle}
            projectHref={
              img.projectId ? `/projects/${img.projectId}` : null
            }
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
