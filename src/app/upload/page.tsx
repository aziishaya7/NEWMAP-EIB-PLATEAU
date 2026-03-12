"use client";

import { useState } from "react";
import { uploadProjectImage } from "@/actions/upload";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function UploadProgress() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await uploadProjectImage(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        setFileName("");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white py-24 sm:py-32 min-h-screen">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Report Progress</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Field workers and sponsors can upload progress images here to update the public Gallery.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              <p>Image uploaded successfully! It is now visible in the Gallery.</p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Project Title / Update Name</label>
            <div className="mt-2">
              <input type="text" name="title" id="title" required className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-700 sm:text-sm sm:leading-6" placeholder="e.g. Shendam Phase 2 Completed" />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description (Optional)</label>
            <div className="mt-2">
              <textarea name="description" id="description" rows={3} className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-700 sm:text-sm sm:leading-6" placeholder="Briefly describe the progress shown in the image..."></textarea>
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">Upload Image</label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 bg-white">
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                  <label htmlFor="image" className="relative cursor-pointer rounded-md bg-white font-semibold text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-700 focus-within:ring-offset-2 hover:text-green-600">
                    <span>{fileName ? "Change file" : "Upload a file"}</span>
                    <input id="image" name="image" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} required />
                  </label>
                </div>
                {fileName ? (
                  <p className="text-sm font-medium text-green-700 mt-2">{fileName}</p>
                ) : (
                  <p className="text-xs leading-5 text-gray-600 mt-2">PNG, JPG, GIF up to 5MB</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full rounded-md bg-green-700 px-3.5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition">
              {loading ? "Uploading..." : "Publish to Gallery"}
            </button>
          </div>
          
          <div className="text-sm text-gray-500 text-center mt-4">
            <p><strong>Note for User:</strong> This uses an efficient local file-system approach (`fs/promises`) inside a Next.js 15 Server Action for optimal fast MVP execution. For a serverless platform (e.g. Vercel), this would be swapped with an S3 or Blob client.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
