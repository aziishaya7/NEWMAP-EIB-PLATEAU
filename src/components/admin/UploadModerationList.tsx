"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GalleryItemAdmin } from "@/lib/gallery";

export default function UploadModerationList({
  items,
}: {
  items: GalleryItemAdmin[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function setStatus(id: string, status: "approved" | "rejected") {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch("/api/admin/uploads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Update failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center text-sm text-gray-600">
        No pending uploads. You&apos;re all caught up.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:flex"
        >
          <div className="relative aspect-[4/3] bg-gray-100 md:aspect-auto md:w-56 md:shrink-0">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 224px"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              {item.description && (
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              )}
              <p className="mt-3 text-xs text-gray-500">
                By {item.uploaderName} ·{" "}
                {new Date(item.date).toLocaleString()}
                {item.projectTitle ? ` · ${item.projectTitle}` : ""}
                {typeof item.progressPct === "number"
                  ? ` · ${item.progressPct}%`
                  : ""}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busyId === item.id}
                onClick={() => setStatus(item.id, "approved")}
                className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={busyId === item.id}
                onClick={() => setStatus(item.id, "rejected")}
                className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
