import UsersTable from "@/components/admin/UsersTable";

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Users</h2>
        <p className="mt-1 text-sm text-gray-600">
          Promote field staff to admin or demote when needed. Roles live in{" "}
          <code className="rounded bg-gray-100 px-1 text-xs">app_metadata</code>
          .
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
