import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { listApprovedGalleryItems } from "@/lib/gallery";

export default async function Gallery() {
  const uploadedImages = await listApprovedGalleryItems();

  const placeholderImages =
    uploadedImages.length === 0
      ? Array.from({ length: 3 }).map((_, i) => ({
          id: `placeholder-${i}`,
          title: `Sample Project Site ${i + 1}`,
          description:
            "Community engagement and infrastructure development progress.",
          imageUrl: null as string | null,
        }))
      : [];

  const allImages = [
    ...uploadedImages.map((img) => ({ ...img, imageUrl: img.imageUrl as string | null })),
    ...placeholderImages,
  ];

  return (
    <div className="bg-white py-24 sm:py-32 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Project Gallery
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            A visual journey of our work across Plateau State. Upload progress
            reports to see them dynamically appear here.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {allImages.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-2xl bg-gray-100 flex flex-col justify-end aspect-[4/3] shadow-sm ring-1 ring-gray-200"
            >
              {img.imageUrl ? (
                <Image
                  src={img.imageUrl}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200/50 flex flex-col items-center justify-center transition group-hover:bg-gray-200/80">
                  <ImageIcon className="h-12 w-12 text-green-700 opacity-50 transition group-hover:scale-110 group-hover:opacity-100" />
                  <span className="mt-2 text-sm text-gray-500 font-medium">
                    Image Placeholder
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent p-6 sm:p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="text-lg font-semibold text-white">{img.title}</h3>
                <p className="mt-2 text-sm text-gray-300 line-clamp-2">
                  {img.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
