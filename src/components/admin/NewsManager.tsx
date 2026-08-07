"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NewsPost } from "@/lib/news";
import { createClient } from "@/lib/supabase/client";
import { GALLERY_BUCKET } from "@/lib/supabase/constants";

const emptyForm = {
  title: "",
  summary: "",
  body: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  published: true,
  coverImagePath: null as string | null,
  coverImageUrl: null as string | null,
};

export default function NewsManager({
  initialPosts,
}: {
  initialPosts: NewsPost[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);

  function startEdit(p: NewsPost) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      summary: p.summary,
      body: p.body,
      publishedAt: p.publishedAt.slice(0, 10),
      published: p.published,
      coverImagePath: p.coverImagePath,
      coverImageUrl: p.coverImageUrl,
    });
  }

  function reset() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      publishedAt: new Date().toISOString().slice(0, 10),
    });
  }

  async function uploadCover(file: File) {
    setUploadingCover(true);
    setError("");
    try {
      if (file.size > 5 * 1024 * 1024) {
        setError("Cover image must be 5MB or smaller.");
        return;
      }
      const signRes = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "image/jpeg",
          purpose: "news",
        }),
      });
      const signJson = await signRes.json();
      if (!signRes.ok) {
        setError(signJson.error || "Could not prepare cover upload.");
        return;
      }
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(GALLERY_BUCKET)
        .uploadToSignedUrl(signJson.path, signJson.token, file, {
          contentType: file.type || "image/jpeg",
        });
      if (uploadError) {
        setError(uploadError.message || "Cover upload failed.");
        return;
      }
      const { data } = supabase.storage
        .from(GALLERY_BUCKET)
        .getPublicUrl(signJson.path);
      setForm((f) => ({
        ...f,
        coverImagePath: signJson.path,
        coverImageUrl: data.publicUrl,
      }));
    } catch {
      setError("Cover upload failed.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        summary: form.summary,
        body: form.body,
        publishedAt: form.publishedAt,
        published: form.published,
        coverImagePath: form.coverImagePath,
      };
      const res = await fetch("/api/admin/news", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Save failed.");
        return;
      }
      reset();
      router.refresh();
    } catch {
      setError("Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this news post?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Delete failed.");
        return;
      }
      if (editingId === id) reset();
      router.refresh();
    } catch {
      setError("Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form
        onSubmit={save}
        className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
      >
        <h3 className="font-semibold text-gray-900">
          {editingId ? "Edit news post" : "Add news post"}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">
              Summary
            </label>
            <textarea
              rows={2}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">
              Full article
            </label>
            <textarea
              rows={8}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Full news content…"
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">
              Cover image (optional)
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 sm:w-48">
                {form.coverImageUrl ? (
                  <Image
                    src={form.coverImageUrl}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-500">
                    No cover
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  {uploadingCover ? "Uploading…" : "Choose image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="sr-only"
                    disabled={uploadingCover || busy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadCover(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                {form.coverImagePath && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        coverImagePath: null,
                        coverImageUrl: null,
                      })
                    }
                    className="rounded-md px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Published date
            </label>
            <input
              type="date"
              value={form.publishedAt}
              onChange={(e) =>
                setForm({ ...form, publishedAt: e.target.value })
              }
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-900">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
                className="rounded border-gray-300 text-green-700 focus:ring-green-700"
              />
              Published
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy || uploadingCover}
            className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
          >
            {busy ? "Saving…" : editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {initialPosts.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 gap-3">
              {p.coverImageUrl && (
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={p.coverImageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{p.title}</p>
                <p className="mt-0.5 text-sm text-gray-600 line-clamp-2">
                  {p.summary}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {p.publishedAt} · {p.published ? "Published" : "Draft"}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => startEdit(p)}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => remove(p.id)}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {initialPosts.length === 0 && (
          <p className="text-sm text-gray-600">No news posts yet.</p>
        )}
      </div>
    </div>
  );
}
