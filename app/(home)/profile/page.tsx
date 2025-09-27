"use client"

import { useAuthStore } from "@/stores/useAuthStore"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/components/cart/cart-button"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, fetchMe, logout } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      await fetchMe()
      setLoading(false)
    }
    loadUser()
  }, [fetchMe])

  const handleLogout = async () => {
    await logout()
    router.push("/") // Redirect to home page after logout
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if (!user) return <div className="min-h-screen flex items-center justify-center">You are not logged in.</div>

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary text-background flex items-center justify-center text-xl font-semibold">
              {user.full_name
                .split(" ")
                .map((n) => n[0].toUpperCase())
                .join("")}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user.full_name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Account Details</h3>
            <p><span className="font-semibold">User ID:</span> {user.id}</p>
            <p><span className="font-semibold">Role:</span> {user.is_staff ? "Admin" : "Customer"}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Orders</h3>
            <p>Track your recent orders and view details here.</p>
            <Button variant="secondary">View Orders</Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Cart</h3>
            <CartButton />
          </div>
        </div>
      </div>
    </div>
  )
}
