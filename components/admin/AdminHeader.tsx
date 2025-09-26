// components/admin/AdminHeader.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"

export default function AdminHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b bg-white shadow-sm">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search..."
          className="w-64"
        />
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </header>
  )
}
