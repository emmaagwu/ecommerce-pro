"use client"

import { User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/components/cart/cart-button"
import { CartSheet } from "@/components/cart/cart-sheet"
import { SearchBar } from "@/components/search-bar"
import Link from "next/link"

interface HeaderProps {
  onSearch?: (query: string) => void
  onMenuToggle?: () => void
}

export function Header({ onSearch, onMenuToggle }: HeaderProps) {
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
                  StyleHub
                </h1>
              </Link>
            </div>

            {/* Search bar - hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBar onSearch={onSearch} className="w-full" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* User account */}
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>

              <CartButton />
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden pb-4">
            <SearchBar onSearch={onSearch} className="w-full" />
          </div>
        </div>
      </header>

      <CartSheet />
    </>
  )
}
