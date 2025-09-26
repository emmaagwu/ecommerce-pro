// components/admin/AdminSidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Package,
  LayoutDashboard,
  Tag,
  ShoppingCart,
  Settings,
  PlusCircle,
  List,
} from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Products",
    icon: Package,
    children: [
      { href: "/admin/products", label: "All Products", icon: List },
      { href: "/admin/products/new", label: "Add Product", icon: PlusCircle },
    ],
  },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
        Admin
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) =>
          item.children ? (
            <div key={item.label}>
              <div className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
              <div className="ml-6 space-y-1">
                {item.children.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                      pathname === href
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        )}
      </nav>
    </aside>
  )
}
