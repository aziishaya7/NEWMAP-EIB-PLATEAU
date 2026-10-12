"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { StaffMember } from "@/lib/staff";
import { createClient } from "@/lib/supabase/client";
import { GALLERY_BUCKET } from "@/lib/supabase/constants";

const emptyForm = {
  name: "",
  role: "",
  email: "",
  phone: "",
  imagePath: null as string | null,
  imageUrl: null as string | null,
  published: true,
  sortOrder: 0,
};

export default function StaffManager({
  initialStaff,
}: {
  initialStaff: StaffMember[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function startEdit(person: StaffMember) {
    setEditingId(person.id);
    setForm({
      name: person.name,
      role: person.role,
      email: person.email,
      phone: person.phone,
      imagePath: person.imagePath,
      imageUrl: person.imageUrl,
      published: person.published,
      sortOrder: person.sortOrder,
    });
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function uploadPortrait(file: File) {
    setUploading(true);
    setError("");
    try {
      if (file.size > 5 * 1024 * 1024) {
        setError("Portrait must be 5MB or smaller.");
        return;
      }
      const signRes = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "image/jpeg",
          purpose: "staff",
        }),
      });
      const signJson = await signRes.json();
      if (!signRes.ok) {
        setError(signJson.error || "Could not prepare portrait upload.");
        return;
      }
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(GALLERY_BUCKET)
        .uploadToSignedUrl(signJson.path, signJson.token, file, {
          contentType: file.type || "image/jpeg",
        });
      if (uploadError) {
        setError(uploadError.message || "Portrait upload failed.");
        return;
      }
      const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(signJson.path);
      setForm((current) => ({
        ...current,
        imagePath: signJson.path,
        imageUrl: data.publicUrl,
      }));
    } catch {
      setError("Portrait upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const adding = !editingId;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        name: form.name,
        role: form.role,
        email: form.email,
        phone: form.phone,
        imagePath: form.imagePath,
        published: form.published,
        sortOrder: form.sortOrder,
      };
      const res = await fetch("/api/admin/staff", {
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
      if (adding) setNotice("Staff member added.");
      router.refresh();
    } catch {
      setError("Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this staff member from the website?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/staff?id=${encodeURIComponent(id)}`, {
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
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
          role="status"
        >
          {notice}
        </div>
      )}

      <form
        onSubmit={save}
        className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
      >
        <h3 className="font-semibold text-gray-900">
          {editingId ? "Edit staff member" : "Add staff member"}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-900">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">Role</label>
            <input
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Display order
            </label>
            <input
              type="number"
              min={0}
              max={9999}
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-900">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Show on the public staff page
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-900">Portrait</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadPortrait(file);
              }}
              className="mt-1 block w-full text-sm text-gray-600"
            />
            {form.imageUrl && (
              <div className="relative mt-3 h-32 w-24 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={form.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy || uploading}
            className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
          >
            {busy ? "Saving…" : editingId ? "Save changes" : "Add staff member"}
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

      <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm">
        {initialStaff.length === 0 && (
          <li className="px-5 py-8 text-sm text-gray-600">
            No staff members yet. Add the first person above.
          </li>
        )}
        {initialStaff.map((person) => (
          <li key={person.id} className="flex items-center gap-4 px-5 py-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-100">
              {person.imageUrl && (
                <Image
                  src={person.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-gray-900">{person.name}</p>
              <p className="truncate text-sm text-gray-600">{person.role}</p>
              <p className="text-xs text-gray-500">
                {person.published ? "Visible" : "Hidden"} · order {person.sortOrder}
              </p>
            </div>
            <button
              type="button"
              onClick={() => startEdit(person)}
              className="text-sm font-semibold text-green-700 hover:underline"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => remove(person.id)}
              disabled={busy}
              className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-50"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
