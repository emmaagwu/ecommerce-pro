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
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Products",
    icon: Package,
    collapsible: true,
    children: [
      { href: "/admin/products", label: "All Products", icon: List },
      { href: "/admin/products/new", label: "Add Product", icon: PlusCircle },
    ],
  },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminSidebar({
  isOpen,
  onClose,
  isMobile,
}: {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})

  // Sidebar and overlay
  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/10 backdrop-blur-sm transition-opacity duration-200"
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed z-30 top-0 left-0 h-full w-64 bg-white border-r shadow-sm flex flex-col transform transition-transform duration-200 ease-in-out",
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "relative translate-x-0"
        )}
        aria-label="Sidebar"
        style={{ boxShadow: isMobile && isOpen ? "0 2px 16px 0 rgba(0,0,0,0.07)" : undefined }}
      >
        <div className="h-16 flex items-center justify-between font-bold text-xl border-b px-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            Admin
          </Link>
          {isMobile && (
            <button
              aria-label="Close sidebar"
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) =>
            item.collapsible ? (
              <div key={item.label} className="select-none">
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-semibold text-gray-500 uppercase tracking-wide rounded-md hover:bg-gray-50 transition-colors",
                    expanded[item.label] && "bg-gray-100"
                  )}
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [item.label]: !prev[item.label],
                    }))
                  }
                  aria-expanded={expanded[item.label] ?? false}
                  aria-controls={`submenu-${item.label}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  <span className="ml-auto">
                    {expanded[item.label] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                </button>
                {expanded[item.label] && (
                  <div
                    id={`submenu-${item.label}`}
                    className="ml-6 mt-1 space-y-1"
                  >
                    {item.children?.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                          pathname === href
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                        onClick={isMobile ? onClose : undefined}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
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
                onClick={isMobile ? onClose : undefined}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          )}
        </nav>
      </aside>
    </>
  )
}