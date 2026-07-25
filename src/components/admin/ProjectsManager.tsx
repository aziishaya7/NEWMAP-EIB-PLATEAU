"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/lib/projects";

const emptyForm = {
  title: "",
  description: "",
  statusLabel: "",
  progress: 0,
  published: true,
  sortOrder: 0,
};

export default function ProjectsManager({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function startEdit(p: Project) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      statusLabel: p.statusLabel,
      progress: p.progress,
      published: p.published,
      sortOrder: p.sortOrder,
    });
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/projects", {
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
    if (!confirm("Delete this project?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
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
          {editingId ? "Edit project" : "Add project"}
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
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Status label
            </label>
            <input
              value={form.statusLabel}
              onChange={(e) => setForm({ ...form, statusLabel: e.target.value })}
              placeholder="e.g. 75% Completed"
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Progress (0–100)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) =>
                setForm({ ...form, progress: Number(e.target.value) })
              }
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Sort order
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) })
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
        {initialProjects.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">{p.title}</p>
              <p className="mt-0.5 text-sm text-gray-600 line-clamp-2">
                {p.description}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {p.statusLabel || `${p.progress}%`} ·{" "}
                {p.published ? "Published" : "Draft"} · sort {p.sortOrder}
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
        {initialProjects.length === 0 && (
          <p className="text-sm text-gray-600">No projects yet.</p>
        )}
      </div>
    </div>
  );
}
