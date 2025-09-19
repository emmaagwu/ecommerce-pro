"use client"

import type { ProductFilters } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ActiveFiltersProps {
  filters: ProductFilters
  onRemoveFilter: (key: keyof ProductFilters, value?: string) => void
  onClearAll: () => void
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const getActiveFilters = () => {
    const active: Array<{ key: keyof ProductFilters; label: string; value?: string }> = []

    if (filters.category) {
      active.push({ key: "category", label: `Category: ${filters.category}` })
    }

    if (filters.subcategory) {
      active.push({ key: "subcategory", label: `Subcategory: ${filters.subcategory}` })
    }

    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice || 0
      const max = filters.maxPrice || 999
      active.push({ key: "minPrice", label: `Price: $${min} - $${max}` })
    }

    if (filters.brands?.length) {
      filters.brands.forEach((brand) => {
        active.push({ key: "brands", label: `Brand: ${brand}`, value: brand })
      })
    }

    if (filters.sizes?.length) {
      filters.sizes.forEach((size) => {
        active.push({ key: "sizes", label: `Size: ${size}`, value: size })
      })
    }

    if (filters.colors?.length) {
      filters.colors.forEach((color) => {
        active.push({ key: "colors", label: `Color: ${color}`, value: color })
      })
    }

    if (filters.inStock) {
      active.push({ key: "inStock", label: "In Stock Only" })
    }

    return active
  }

  const activeFilters = getActiveFilters()

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm font-medium text-muted-foreground">Active filters:</span>

      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${filter.value || ""}-${index}`}
          variant="secondary"
          className="flex items-center gap-1 pr-1"
        >
          {filter.label}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onRemoveFilter(filter.key, filter.value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-muted-foreground hover:text-foreground ml-2"
      >
        Clear all
      </Button>
    </div>
  )
}
