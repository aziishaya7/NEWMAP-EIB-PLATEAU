import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UploadCloud } from "lucide-react";
import DisplayNameForm from "@/components/profile/DisplayNameForm";
import { getSessionUser } from "@/lib/auth";
import { listUserGalleryItems } from "@/lib/gallery";
import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-green-50 text-green-800 ring-green-200",
  rejected: "bg-red-50 text-red-800 ring-red-200",
};

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/profile");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name || user.email?.split("@")[0] || "User";
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const uploads = await listUserGalleryItems(user.id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
        <aside className="mb-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:mb-0 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
            Your profile
          </p>
          <div className="mt-4">
            <DisplayNameForm initialName={displayName} />
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="mt-0.5 font-medium text-gray-900 break-all">
                {user.email}
              </dd>
            </div>
            {memberSince && (
              <div>
                <dt className="text-gray-500">Member since</dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {memberSince}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-gray-500">Uploads</dt>
              <dd className="mt-0.5 font-medium text-gray-900">
                {uploads.length}
              </dd>
            </div>
          </dl>
          <Link
            href="/upload"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            <UploadCloud className="h-4 w-4" /> Upload progress
          </Link>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                My uploads
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Track submissions and their review status.
              </p>
            </div>
          </div>

          {uploads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
              <UploadCloud className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-4 text-base font-medium text-gray-900">
                No uploads yet
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Share field progress photos to build the public gallery.
              </p>
              <Link
                href="/upload"
                className="mt-6 inline-flex rounded-md bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
              >
                Upload your first image
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {uploads.map((item) => {
                const status = item.status ?? "approved";
                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status] ?? statusStyles.pending}`}
                        >
                          {status}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {item.description}
                        </p>
                      )}
                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm font-semibold text-green-700 hover:text-green-800"
                      >
                        Open image
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
