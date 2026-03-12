import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import fs from "fs/promises";
import path from "path";

interface UploadedImage {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

export default async function Gallery() {
  let uploadedImages: UploadedImage[] = [];
  try {
    const metadataPath = path.join(process.cwd(), "public", "uploads", "data.json");
    const dataStr = await fs.readFile(metadataPath, "utf-8");
    uploadedImages = JSON.parse(dataStr);
  } catch (e) {
    // File might not exist yet if nothing was uploaded
  }

  const placeholderImages = Array.from({ length: 3 }).map((_, i) => ({
    id: `placeholder-${i}`,
    title: `Sample Project Site ${i + 1}`,
    description: "Community engagement and infrastructure development progress.",
    imageUrl: null,
  }));

  const allImages = [...uploadedImages, ...placeholderImages];

  return (
    <div className="bg-white py-24 sm:py-32 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Project Gallery</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            A visual journey of our work across Plateau State. Upload progress reports to see them dynamically appear here.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {allImages.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-2xl bg-gray-100 flex flex-col justify-end aspect-[4/3] shadow-sm ring-1 ring-gray-200">
              {img.imageUrl ? (
                <Image
                  src={img.imageUrl}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized={true} // Needed since we serve from /public/uploads
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200/50 flex flex-col items-center justify-center transition group-hover:bg-gray-200/80">
                  <ImageIcon className="h-12 w-12 text-green-700 opacity-50 transition group-hover:scale-110 group-hover:opacity-100" />
                  <span className="mt-2 text-sm text-gray-500 font-medium">Image Placeholder</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent p-6 sm:p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="text-lg font-semibold text-white">{img.title}</h3>
                <p className="mt-2 text-sm text-gray-300 line-clamp-2">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
