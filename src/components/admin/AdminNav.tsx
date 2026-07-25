"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Users,
  FolderKanban,
  Newspaper,
  Settings,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/uploads", label: "Uploads", icon: ImageIcon },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminNavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-green-700 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="text-sm font-semibold text-gray-900">Admin</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border border-gray-200 p-2 text-gray-700"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <aside className="hidden w-56 shrink-0 lg:block">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-green-700">
          Dashboard
        </p>
        <AdminNavLinks pathname={pathname} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-semibold text-gray-900">Admin</p>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <AdminNavLinks
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
