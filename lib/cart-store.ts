"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "./types"

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  setIsOpen: (open: boolean) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, selectedSize, selectedColor) => {
        const existingItemIndex = get().items.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor,
        )

        if (existingItemIndex > -1) {
          // Update existing item quantity
          set((state) => ({
            items: state.items.map((item, index) =>
              index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
            ),
          }))
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${selectedSize || "no-size"}-${selectedColor || "no-color"}`,
            product,
            quantity,
            selectedSize,
            selectedColor,
          }
          set((state) => ({ items: [...state.items, newItem] }))
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0)
      },

      setIsOpen: (open) => {
        set({ isOpen: open })
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
