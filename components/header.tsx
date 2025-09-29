"use client"

import { usePathname } from "next/navigation"
import { Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/components/cart/cart-button"
import { CartSheet } from "@/components/cart/cart-sheet"
import { SearchBar } from "@/components/search-bar"
import Link from "next/link"
import { useAuthStore } from "@/stores/useAuthStore"

interface HeaderProps {
  onSearch?: (query: string) => void
  onMenuToggle?: () => void
}

export function Header({ onSearch, onMenuToggle }: HeaderProps) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  // Get initials from full name
  const getInitials = (name: string) => {
    const names = name.trim().split(" ")
    return names.length === 1
      ? names[0].charAt(0).toUpperCase()
      : (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  // Hide search bar on login/register pages
  const hideSearch = pathname === "/login" || pathname === "/register"

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuToggle}>
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                  Ecommerce Pro
                </h1>
              </Link>
            </div>

            {/* Search bar - hidden on login/register pages */}
            {!hideSearch && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <SearchBar onSearch={onSearch} className="w-full" />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!user ? (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline">Register</Button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href={user.is_staff ? "/admin/dashboard" : "/profile"}>
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-background font-semibold">
                      {getInitials(user.full_name)}
                    </div>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              )}

              <CartButton />
            </div>
          </div>

          {/* Mobile search */}
          {!hideSearch && (
            <div className="md:hidden pb-4">
              <SearchBar onSearch={onSearch} className="w-full" />
            </div>
          )}
        </div>
      </header>

      <CartSheet />
    </>
  )
}
