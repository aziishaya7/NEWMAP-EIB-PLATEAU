import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { getSessionUser, isAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user)) redirect("/");

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Admin dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Moderate uploads, manage users, and publish programme content.
        </p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <AdminNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
