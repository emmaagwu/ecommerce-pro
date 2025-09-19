"use client"

import type { ProductFilters } from "@/lib/types"
import { FilterSidebar } from "./filter-sidebar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MobileFilterSheetProps {
  filters: ProductFilters
  availableFilters: {
    categories: string[]
    subcategories: string[]
    brands: string[]
    priceRange: { min: number; max: number }
    sizes: string[]
    colors: string[]
  }
  onFiltersChange: (filters: ProductFilters) => void
  onClearFilters: () => void
  activeFiltersCount: number
}

export function MobileFilterSheet({
  filters,
  availableFilters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount,
}: MobileFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterSidebar
            filters={filters}
            availableFilters={availableFilters}
            onFiltersChange={onFiltersChange}
            onClearFilters={onClearFilters}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
