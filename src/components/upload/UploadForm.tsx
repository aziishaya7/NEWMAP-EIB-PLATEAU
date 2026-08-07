"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { GALLERY_BUCKET } from "@/lib/supabase/constants";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import type { Project } from "@/lib/projects";

const MAX_BYTES = 5 * 1024 * 1024;

export default function UploadForm({ projects }: { projects: Project[] }) {
  const [loading, setLoading] = useState(false);
  const [successStatus, setSuccessStatus] = useState<"pending" | "approved" | null>(
    null
  );
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [progressPct, setProgressPct] = useState(
    String(projects[0]?.progress ?? 0)
  );

  const projectById = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])),
    [projects]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFileName(file?.name ?? "");
  };

  function onProjectChange(id: string) {
    setProjectId(id);
    const p = projectById[id];
    if (p) setProgressPct(String(p.progress));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccessStatus(null);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const file = selectedFile;
    const pct = Number(progressPct);

    try {
      if (!title || !file) {
        setError("File and title are required.");
        return;
      }
      if (!projectId) {
        setError("Select a project.");
        return;
      }
      if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
        setError("Progress must be between 0 and 100.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("Image must be 5MB or smaller.");
        return;
      }

      const signRes = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "image/jpeg",
        }),
      });
      const signJson = await signRes.json();
      if (!signRes.ok) {
        setError(signJson.error || "Could not prepare upload.");
        return;
      }

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(GALLERY_BUCKET)
        .uploadToSignedUrl(signJson.path, signJson.token, file, {
          contentType: file.type || "image/jpeg",
        });

      if (uploadError) {
        setError(uploadError.message || "Upload to storage failed.");
        return;
      }

      const metaRes = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          imagePath: signJson.path,
          projectId,
          progressPct: Math.round(pct),
        }),
      });
      const metaJson = await metaRes.json();
      if (!metaRes.ok) {
        setError(metaJson.error || "Upload saved to storage but metadata failed.");
        return;
      }

      setSuccessStatus(metaJson.status === "approved" ? "approved" : "pending");
      form.reset();
      setFileName("");
      setSelectedFile(null);
      const p = projectById[projectId];
      setProgressPct(String(Math.max(p?.progress ?? 0, Math.round(pct))));
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-semibold">No published projects yet</p>
        <p className="mt-2 text-sm">
          An administrator must publish a project before progress photos can be
          uploaded.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm sm:p-8"
    >
      {successStatus === "approved" && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p>
            Image published to the{" "}
            <Link href="/gallery" className="font-semibold underline">
              Gallery
            </Link>{" "}
            and project page.
          </p>
        </div>
      )}
      {successStatus === "pending" && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p>
            Submitted for review. Track it on your{" "}
            <Link href="/profile" className="font-semibold underline">
              profile
            </Link>
            .
          </p>
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="projectId"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Project
        </label>
        <select
          id="projectId"
          name="projectId"
          required
          value={projectId}
          onChange={(e) => onProjectChange(e.target.value)}
          className="mt-2 block w-full rounded-md border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-700 sm:text-sm"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.progress}%)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="progressPct"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Progress at this photo (%)
        </label>
        <input
          type="number"
          id="progressPct"
          name="progressPct"
          min={0}
          max={100}
          required
          value={progressPct}
          onChange={(e) => setProgressPct(e.target.value)}
          className="mt-2 block w-full rounded-md border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-700 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Update title
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="title"
            id="title"
            required
            className="block w-full rounded-md border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-700 sm:text-sm sm:leading-6"
            placeholder="e.g. Drainage works completed"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Description (Optional)
        </label>
        <div className="mt-2">
          <textarea
            name="description"
            id="description"
            rows={3}
            className="block w-full rounded-md border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-700 sm:text-sm sm:leading-6"
            placeholder="Briefly describe the progress shown in the image..."
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Upload Image
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 bg-white px-6 py-10">
          <div className="text-center">
            <UploadCloud
              className="mx-auto h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
            <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
              <label
                htmlFor="image"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-700 focus-within:ring-offset-2 hover:text-green-600"
              >
                <span>{fileName ? "Change file" : "Upload a file"}</span>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="sr-only"
                  onChange={handleFileChange}
                  required
                />
              </label>
            </div>
            {fileName ? (
              <p className="mt-2 text-sm font-medium text-green-700">
                {fileName}
              </p>
            ) : (
              <p className="mt-2 text-xs leading-5 text-gray-600">
                PNG, JPG, GIF, WebP up to 5MB
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-green-700 px-3.5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Submit for review"}
        </button>
      </div>
    </form>
  );
}
