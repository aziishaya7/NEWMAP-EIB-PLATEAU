"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NewsPost } from "@/lib/news";

const emptyForm = {
  title: "",
  summary: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  published: true,
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

  function startEdit(p: NewsPost) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      summary: p.summary,
      publishedAt: p.publishedAt.slice(0, 10),
      published: p.published,
    });
  }

  function reset() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      publishedAt: new Date().toISOString().slice(0, 10),
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/news", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
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
              rows={3}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
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
            disabled={busy}
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
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">{p.title}</p>
              <p className="mt-0.5 text-sm text-gray-600 line-clamp-2">
                {p.summary}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {p.publishedAt} · {p.published ? "Published" : "Draft"}
              </p>
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
