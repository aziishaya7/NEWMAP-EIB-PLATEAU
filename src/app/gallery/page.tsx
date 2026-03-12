import { Image as ImageIcon } from "lucide-react";

export default function Gallery() {
  const images = Array.from({ length: 9 }).map((_, i) => ({
    id: i + 1,
    title: `Project Site Update ${i + 1}`,
    description: "Community engagement and infrastructure development progress.",
  }));

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Project Gallery</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            A visual journey of our work across Plateau State, featuring project sites and community engagements.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-2xl bg-gray-100 p-6 sm:p-8 flex flex-col justify-end aspect-[4/3]">
              <div className="absolute inset-0 bg-gray-200/50 flex flex-col items-center justify-center transition group-hover:bg-gray-200/80">
                <ImageIcon className="h-12 w-12 text-green-700 opacity-50 transition group-hover:scale-110 group-hover:opacity-100" />
                <span className="mt-2 text-sm text-gray-500 font-medium">Image Placeholder</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent p-6 sm:p-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="text-lg font-semibold text-white">{img.title}</h3>
                <p className="mt-2 text-sm text-gray-300">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
