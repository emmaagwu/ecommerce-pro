"use client"

import { useState, useEffect } from "react"
import ProductFilters from "@/components/admin/products/ProductFilters"
import ProductTable from "@/components/admin/products/ProductTable"

const PAGE_LIMIT = 12

export default function ProductsPage() {
  const [filtersMeta, setFiltersMeta] = useState<{ categories: string[], brands: string[] }>({ categories: [], brands: [] })
  const [filters, setFilters] = useState<{ search?: string, category?: string, brand?: string }>({})
  const [page, setPage] = useState(1)

  const baseRoute = process.env.NEXT_PUBLIC_API_BASE_URL

  // Fetch filter metadata
  useEffect(() => {
    fetch(`${baseRoute}/api/filters/`)
      .then(res => res.json())
      .then(data => {
        setFiltersMeta({
          categories: data.categories?.map((c: any) => c.name) || [],
          brands: data.brands?.map((b: any) => b.name) || [],
        })
      })
  }, [baseRoute])

  // When filters change, reset to first page
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="container mx-auto py-8 px-0 sm:px-4">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ProductFilters
        categories={filtersMeta.categories}
        brands={filtersMeta.brands}
        onChange={handleFilterChange}
        initial={filters}
      />
      <div className="bg-white rounded-lg shadow p-1 sm:p-4">
        <ProductTable
          page={page}
          limit={PAGE_LIMIT}
          onPageChange={setPage}
          filters={filters}
          search={filters.search || ""}
        />
      </div>
    </div>
  )
}