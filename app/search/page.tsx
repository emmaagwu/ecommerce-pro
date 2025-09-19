"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import { FilterSidebar } from "@/components/filters/filter-sidebar"
import { ActiveFilters } from "@/components/filters/active-filters"
import { CatalogHeader } from "@/components/catalog-header"
import { Pagination } from "@/components/pagination/pagination"
import { MobileFilterSheet } from "@/components/filters/mobile-filter-sheet"
import { useProducts } from "@/hooks/use-products"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Search } from "lucide-react"
import { getActiveFiltersCount } from "@/lib/utils/filters"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const searchQuery = searchParams.get("q") || ""
  const page = Number(searchParams.get("page")) || 1

  const { products, loading, sort, error, totalPages, totalProducts, filters, updateFilters, updateSort, updatePage, availableFilters, removeFilter, clearFilters, } = useProducts({
    search: searchQuery,
    initialPage: page,
  })

  useEffect(() => {
    if (!searchQuery) {
      router.push("/")
    }
  }, [searchQuery, router])

  if (!searchQuery) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Search Results Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Search Results for &quot;{searchQuery}&quot;</h1>
          </div>
          <p className="text-muted-foreground">
            {totalProducts === 0 ? "No products found" : `${totalProducts} product${totalProducts === 1 ? "" : "s"} found`}
          </p>
        </div>

        {totalProducts === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground mb-6">Try adjusting your search terms or browse our categories</p>
            <button onClick={() => router.push("/")} className="text-primary hover:underline">
              Browse all products
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-8">
              {/* Desktop Filters */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <FilterSidebar filters={filters} availableFilters={availableFilters} onFiltersChange={updateFilters} />
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                {/* Catalog Header with Sort */}
                <CatalogHeader
                  totalProducts={totalProducts}
                  currentPage={page}
                  totalPages={totalPages}
                  productsPerPage={12}
                  currentSort={sort}
                  onSortChange={updateSort}
                  onMobileFilterToggle={() => setIsMobileFilterOpen(true)}
                />

                {/* Active Filters */}
                <ActiveFilters
                  filters={filters}
                  onRemoveFilter={removeFilter}
                  onClearAll={clearFilters}
                />

                {/* Products Grid */}
                <ProductGrid products={products} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={updatePage} />
                  </div>
                )}
              </main>
            </div>

            {/* Mobile Filter Sheet */}
            <MobileFilterSheet
              isOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
              filters={filters}
              availableFilters={availableFilters}
              onFiltersChange={updateFilters}
              onClearFilters={clearFilters}
              activeFiltersCount={getActiveFiltersCount(filters)}
            />
          </>
        )}
      </div>
    </div>
  )
}
