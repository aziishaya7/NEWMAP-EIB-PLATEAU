import MediaPlaceholder from "@/components/media/MediaPlaceholder";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { listApprovedGalleryItems } from "@/lib/gallery";

export default async function Gallery() {
  const uploadedImages = await listApprovedGalleryItems();

  return (
    <div className="bg-white py-24 sm:py-32 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Project Gallery
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Progress photos from interventions across Plateau State. Open any
            image for a closer look, or follow the project link for the full
            timeline.
          </p>
        </div>

        {uploadedImages.length === 0 ? (
          <div className="mx-auto mt-16 max-w-lg">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-gray-200">
              <MediaPlaceholder label="Progress photos coming soon" />
            </div>
            <p className="mt-6 text-center text-gray-600">
              Approved field uploads will appear here once published.
            </p>
          </div>
        ) : (
          <GalleryGrid items={uploadedImages} />
        )}
      </div>
    </div>
  );
}
