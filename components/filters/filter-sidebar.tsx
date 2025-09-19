"use client"

import type { ProductFilters } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import { useState } from "react"

interface FilterSidebarProps {
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
  onClearFilters?: () => void
  className?: string
}

export function FilterSidebar({
  filters,
  availableFilters,
  onFiltersChange,
  onClearFilters,
  className,
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || availableFilters.priceRange.min,
    filters.maxPrice || availableFilters.priceRange.max,
  ])

  const updateFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: "sizes" | "colors" | "brands", value: string) => {
    const currentArray = filters[key] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    updateFilter(key, newArray.length > 0 ? newArray : undefined)
  }

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value)
    updateFilter("minPrice", value[0])
    updateFilter("maxPrice", value[1])
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category) count++
    if (filters.subcategory) count++
    if (filters.minPrice || filters.maxPrice) count++
    if (filters.sizes?.length) count += filters.sizes.length
    if (filters.colors?.length) count += filters.colors.length
    if (filters.brands?.length) count += filters.brands.length
    if (filters.inStock !== undefined) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Category</Label>
            <div className="space-y-2">
              {availableFilters.categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.category === category}
                    onCheckedChange={(checked) => updateFilter("category", checked ? category : undefined)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Subcategory Filter */}
          {filters.category && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Subcategory</Label>
              <div className="space-y-2">
                {availableFilters.subcategories.map((subcategory) => (
                  <div key={subcategory} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subcategory-${subcategory}`}
                      checked={filters.subcategory === subcategory}
                      onCheckedChange={(checked) => updateFilter("subcategory", checked ? subcategory : undefined)}
                    />
                    <Label htmlFor={`subcategory-${subcategory}`} className="text-sm font-normal cursor-pointer">
                      {subcategory}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Label>
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={availableFilters.priceRange.max}
              min={availableFilters.priceRange.min}
              step={5}
              className="w-full"
            />
          </div>

          {/* Brand Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Brand</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableFilters.brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands?.includes(brand) || false}
                    onCheckedChange={() => toggleArrayFilter("brands", brand)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Size</Label>
            <div className="flex flex-wrap gap-2">
              {availableFilters.sizes.map((size) => (
                <Button
                  key={size}
                  variant={filters.sizes?.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayFilter("sizes", size)}
                  className="h-8 px-3"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Color</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableFilters.colors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={filters.colors?.includes(color) || false}
                    onCheckedChange={() => toggleArrayFilter("colors", color)}
                  />
                  <Label
                    htmlFor={`color-${color}`}
                    className="text-sm font-normal cursor-pointer flex items-center gap-2"
                  >
                    <div
                      className="h-3 w-3 rounded-full border border-border"
                      style={{
                        backgroundColor:
                          color.toLowerCase() === "white"
                            ? "#ffffff"
                            : color.toLowerCase() === "black"
                              ? "#000000"
                              : color.toLowerCase() === "navy"
                                ? "#1e3a8a"
                                : color.toLowerCase() === "gray"
                                  ? "#6b7280"
                                  : color.toLowerCase() === "red"
                                    ? "#dc2626"
                                    : color.toLowerCase() === "blue"
                                      ? "#2563eb"
                                      : color.toLowerCase().includes("blue")
                                        ? "#3b82f6"
                                        : color.toLowerCase().includes("pink")
                                          ? "#ec4899"
                                          : color.toLowerCase().includes("yellow")
                                            ? "#eab308"
                                            : color.toLowerCase() === "brown"
                                              ? "#92400e"
                                              : color.toLowerCase() === "cream"
                                                ? "#fef3c7"
                                                : color.toLowerCase() === "burgundy"
                                                  ? "#7c2d12"
                                                  : "#9ca3af",
                      }}
                    />
                    {color}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Filter */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock === true}
                onCheckedChange={(checked) => updateFilter("inStock", checked ? true : undefined)}
              />
              <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                In Stock Only
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
