"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { FilterSidebar } from "@/components/filters/filter-sidebar"
import { MobileFilterSheet } from "@/components/filters/mobile-filter-sheet"
import { ActiveFilters } from "@/components/filters/active-filters"
import { CatalogHeader } from "@/components/catalog-header"
import { ProductGrid } from "@/components/product-grid"
import { Pagination } from "@/components/pagination/pagination"
import { useProducts } from "@/hooks/use-products"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    products,
    loading,
    error,
    filters,
    sort,
    page,
    totalProducts,
    totalPages,
    availableFilters,
    updateFilters,
    updateSort,
    updatePage,
    updateSearch,
    clearFilters,
    removeFilter,
  } = useProducts({
    limit: 12,
  })

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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={updateSearch} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={updateSearch} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                availableFilters={availableFilters}
                onFiltersChange={updateFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
              <div className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    filters={filters}
                    availableFilters={availableFilters}
                    onFiltersChange={updateFilters}
                    onClearFilters={clearFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <MobileFilterSheet
                filters={filters}
                availableFilters={availableFilters}
                onFiltersChange={updateFilters}
                onClearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </div>

            {/* Active Filters */}
            <ActiveFilters filters={filters} onRemoveFilter={removeFilter} onClearAll={clearFilters} />

            {/* Catalog Header */}
            <CatalogHeader
              totalProducts={totalProducts}
              currentPage={page}
              totalPages={totalPages}
              productsPerPage={12}
              currentSort={sort}
              onSortChange={updateSort}
            />

            {/* Products Grid */}
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={updatePage} />
          </main>
        </div>
      </div>
    </div>
  )
}