import type { ProductFilters } from "@/lib/types"

export function getActiveFilters(filters: ProductFilters) {
  const active: Array<{ key: keyof ProductFilters; label: string; value?: string }> = []

  if (filters.category) active.push({ key: "category", label: `Category: ${filters.category}` })
  if (filters.subcategory) active.push({ key: "subcategory", label: `Subcategory: ${filters.subcategory}` })
  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice || 0
    const max = filters.maxPrice || 999
    active.push({ key: "minPrice", label: `Price: $${min} - $${max}` })
  }
  if (filters.brands?.length) {
    filters.brands.forEach((brand) => active.push({ key: "brands", label: `Brand: ${brand}`, value: brand }))
  }
  if (filters.sizes?.length) {
    filters.sizes.forEach((size) => active.push({ key: "sizes", label: `Size: ${size}`, value: size }))
  }
  if (filters.colors?.length) {
    filters.colors.forEach((color) => active.push({ key: "colors", label: `Color: ${color}`, value: color }))
  }
  if (filters.inStock) active.push({ key: "inStock", label: "In Stock Only" })

  return active
}

export function getActiveFiltersCount(filters: ProductFilters) {
  return getActiveFilters(filters).length
}
