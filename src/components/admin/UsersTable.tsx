"use client";

import { useEffect, useState } from "react";
import PasswordInput from "@/components/ui/PasswordInput";

type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "user";
  isSuperAdmin?: boolean;
  createdAt: string;
  isSelf: boolean;
};

export default function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [canCreateAdmins, setCanCreateAdmins] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "user" as "user" | "admin",
  });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to load users.");
        return;
      }
      setUsers(json.users ?? []);
      setCanCreateAdmins(Boolean(json.canCreateAdmins));
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setRole(userId: string, role: "admin" | "user") {
    setBusyId(userId);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to update role.");
        return;
      }
      await load();
    } catch {
      setError("Failed to update role.");
    } finally {
      setBusyId(null);
    }
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to create user.");
        return;
      }
      setForm({ email: "", password: "", displayName: "", role: "user" });
      setMessage(`Created ${json.user?.email ?? "user"} as ${json.user?.role}.`);
      await load();
    } catch {
      setError("Failed to create user.");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-600">Loading users…</p>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}

      <form
        onSubmit={createUser}
        className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
      >
        <div>
          <h3 className="font-semibold text-gray-900">Create user</h3>
          <p className="mt-1 text-sm text-gray-600">
            Add accounts directly (useful when open registration is off).
            {canCreateAdmins
              ? " As super admin you can also create other admins."
              : " Only the super admin can assign the admin role."}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Display name
            </label>
            <input
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">Role</label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value as "user" | "admin",
                })
              }
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            >
              <option value="user">User</option>
              {canCreateAdmins && <option value="admin">Admin</option>}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-md border-0 px-3 py-2 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Temporary password
            </label>
            <PasswordInput
              id="temp-password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              wrapperClassName="relative mt-1"
              className="w-full rounded-md border-0 px-3 py-2 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-700 sm:text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={creating}
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create account"}
        </button>
      </form>

      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
        <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{u.displayName}</p>
                  <p className="text-gray-500">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      u.role === "admin"
                        ? "bg-green-50 text-green-800 ring-green-200"
                        : "bg-gray-50 text-gray-700 ring-gray-200"
                    }`}
                  >
                    {u.isSuperAdmin ? "super admin" : u.role}
                  </span>
                  {u.isSelf && (
                    <span className="ml-2 text-xs text-gray-400">(you)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {u.isSuperAdmin ? (
                    <span className="text-xs text-gray-400">Protected</span>
                  ) : u.role === "admin" ? (
                    <button
                      type="button"
                      disabled={u.isSelf || busyId === u.id || !canCreateAdmins}
                      onClick={() => setRole(u.id, "user")}
                      className="text-sm font-semibold text-gray-700 hover:text-red-700 disabled:opacity-40"
                    >
                      Demote
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId === u.id || !canCreateAdmins}
                      onClick={() => setRole(u.id, "admin")}
                      className="text-sm font-semibold text-green-700 hover:text-green-800 disabled:opacity-40"
                    >
                      Make admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {users.map((u) => (
          <div
            key={u.id}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <p className="font-semibold text-gray-900">{u.displayName}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
            <p className="mt-2 text-xs text-gray-500">
              Role: {u.isSuperAdmin ? "super admin" : u.role}
              {u.isSelf ? " (you)" : ""} · Joined{" "}
              {new Date(u.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-3">
              {u.isSuperAdmin ? (
                <span className="text-xs text-gray-400">Protected</span>
              ) : u.role === "admin" ? (
                <button
                  type="button"
                  disabled={u.isSelf || busyId === u.id || !canCreateAdmins}
                  onClick={() => setRole(u.id, "user")}
                  className="text-sm font-semibold text-gray-700 disabled:opacity-40"
                >
                  Demote to user
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busyId === u.id || !canCreateAdmins}
                  onClick={() => setRole(u.id, "admin")}
                  className="text-sm font-semibold text-green-700 disabled:opacity-40"
                >
                  Make admin
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
