import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { listPublishedStaff } from "@/lib/staff";

export const metadata = {
  title: "Meet Our Staff | NEWMAP-EIB Plateau State",
  description:
    "Meet the NEWMAP-EIB Plateau State project office team.",
};

export default async function StaffPage() {
  const staff = await listPublishedStaff();

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-semibold leading-7 text-green-700">
            Our people
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet Our Staff
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            The Plateau State project office team working on erosion control,
            flood management, and community resilience.
          </p>
        </div>

        {staff.length === 0 ? (
          <p className="mx-auto mt-16 max-w-xl text-center text-gray-600">
            Staff profiles will appear here once they are published.
          </p>
        ) : (
        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {staff.map((person) => (
            <li
              key={person.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm"
            >
              <div className="relative aspect-[4/5] w-full bg-gray-200">
                {person.imageUrl && (
                <Image
                  src={person.imageUrl}
                  alt={`Portrait of ${person.name}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                )}
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {person.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-green-700">
                  {person.role}
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="flex items-center gap-2 hover:text-green-700 hover:underline"
                  >
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {person.email}
                  </a>
                  )}
                  {person.phone && (
                  <a
                    href={`tel:${person.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 hover:text-green-700 hover:underline"
                  >
                    <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {person.phone}
                  </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
}
