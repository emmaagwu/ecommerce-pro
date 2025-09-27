"use client"

import { ReactNode, useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track window size for responsive sidebar
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // On desktop, sidebar is always open
  useEffect(() => {
    if (!isMobile) setSidebarOpen(true)
    else setSidebarOpen(false)
  }, [isMobile])

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          isMobile={isMobile}
        />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}