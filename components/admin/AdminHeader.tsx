"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Bell, Menu } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"

export default function AdminHeader({
  onMenuClick,
  isMobile,
}: {
  onMenuClick?: () => void
  isMobile?: boolean
}) {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/") // Redirect to home after logout
  }

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b bg-white shadow-sm">
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            aria-label="Open sidebar"
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        )}
        <Link href="/" className="text-lg font-bold text-primary hover:opacity-80 transition-opacity">
          <span className="hidden sm:inline">MyShop</span>
          <span className="sm:hidden">🏠</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search..."
          className="w-24 sm:w-48 md:w-64"
        />
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        {!!user && (
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 font-medium transition"
          >
            Logout
          </button>
        )}
        {/* You can add user avatar/name here if you like */}
      </div>
    </header>
  )
}