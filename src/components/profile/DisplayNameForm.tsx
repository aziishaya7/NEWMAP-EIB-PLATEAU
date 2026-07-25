"use client";

import { useActionState, useEffect, useState } from "react";
import {
  updateDisplayNameAction,
  type ProfileActionState,
} from "@/actions/profile";

const initial: ProfileActionState = {};

export default function DisplayNameForm({
  initialName,
}: {
  initialName: string;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateDisplayNameAction,
    initial
  );

  useEffect(() => {
    if (state.success) setEditing(false);
  }, [state.success]);

  if (!editing) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-2xl font-bold text-gray-900">{initialName}</p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-sm font-semibold text-green-700 hover:text-green-800"
        >
          Edit
        </button>
        {state.success && (
          <span className="text-sm text-green-700">{state.success}</span>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <div className="min-w-[12rem] flex-1">
        <label htmlFor="displayName" className="sr-only">
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          defaultValue={initialName}
          required
          maxLength={80}
          className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-700 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="rounded-md px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
      >
        Cancel
      </button>
      {state.error && (
        <p className="w-full text-sm text-red-700">{state.error}</p>
      )}
    </form>
  );
}
