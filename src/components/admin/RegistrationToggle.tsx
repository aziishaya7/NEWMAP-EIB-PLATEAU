"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegistrationToggle({
  initialOpen,
}: {
  initialOpen: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(initialOpen);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function toggle() {
    setBusy(true);
    setError("");
    setMessage("");
    const next = !open;
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationOpen: next }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not update setting.");
        return;
      }
      setOpen(next);
      setMessage(
        next
          ? "Open registration enabled."
          : "Registration closed — invite-only mode."
      );
      router.refresh();
    } catch {
      setError("Could not update setting.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Open registration
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Default is invite-only: public nav does not advertise signup, and
            accounts are created in Admin → Users. Turn on only for temporary
            emergency self-registration (page stays unlisted).
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={toggle}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition ${
            open ? "bg-green-700" : "bg-gray-300"
          } disabled:opacity-50`}
          aria-pressed={open}
          aria-label="Toggle open registration"
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
              open ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-900">
        Status: {open ? "Open" : "Closed (invite-only)"}
      </p>
      {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
