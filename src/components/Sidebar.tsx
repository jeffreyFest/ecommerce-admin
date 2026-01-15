
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

type SidebarProps = {
  userName: string | null | undefined;
  userEmail: string | null | undefined;
  userRole: string | null | undefined;
};
export default function Sidebar({
  userName,
  userEmail,
  userRole,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>

        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className={`p-2 rounded ${
              isActive("/dashboard") ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/product"
            className={`p-2 rounded ${
              isActive("/dashboard/product")
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            Products
          </Link>
          <Link
            href="/dashboard/orders"
            className={`p-2 rounded ${
              isActive("/dashboard/orders")
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            Orders
          </Link>
          <Link
            href="/dashboard/customers"
            className={`p-2 rounded ${
              isActive("/dashboard/customers")
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            Customers
          </Link>
        </nav>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <p className="text-sm">{userName}</p>
        <p className="text-xs text-gray-400">{userEmail}</p>
        <p className="text-xs text-gray-400">{userRole}</p>
        <LogoutButton />
      </div>
    </aside>
  );
}
