"use client"

import { useState, useEffect, useCallback } from "react"
import type { Product, ProductFilters, ProductSort, ProductsResponse } from "@/lib/types"

interface UseProductsOptions {
  initialFilters?: ProductFilters
  initialSort?: ProductSort
  initialPage?: number
  limit?: number
}

export function useProducts({
  initialFilters = {},
  initialSort = { field: "createdAt", direction: "desc" },
  initialPage = 1,
  limit = 12,
}: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>(initialFilters)
  const [sort, setSort] = useState<ProductSort>(initialSort)
  const [page, setPage] = useState(initialPage)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [availableFilters, setAvailableFilters] = useState({
    categories: [] as string[],
    subcategories: [] as string[],
    brands: [] as string[],
    priceRange: { min: 0, max: 1000 },
    sizes: [] as string[],
    colors: [] as string[],
  })
  const [searchQuery, setSearchQuery] = useState("")

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortField: sort.field,
        sortDirection: sort.direction,
      })

      if (filters.category) params.append("category", filters.category)
      if (filters.subcategory) params.append("subcategory", filters.subcategory)
      if (filters.minPrice) params.append("minPrice", filters.minPrice.toString())
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
      if (filters.sizes?.length) params.append("sizes", filters.sizes.join(","))
      if (filters.colors?.length) params.append("colors", filters.colors.join(","))
      if (filters.brands?.length) params.append("brands", filters.brands.join(","))
      if (filters.inStock !== undefined) params.append("inStock", filters.inStock.toString())
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data: ProductsResponse = await response.json()
      setProducts(data.products)
      setTotalProducts(data.total)
      setTotalPages(data.totalPages)
      setAvailableFilters(data.filters)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [filters, sort, page, limit, searchQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const updateFilters = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }, [])

  const updateSort = useCallback((newSort: ProductSort) => {
    setSort(newSort)
    setPage(1) // Reset to first page when sort changes
  }, [])

  const updatePage = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const updateSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setPage(1) // Reset to first page when search changes
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setPage(1)
  }, [])

  const removeFilter = useCallback((key: keyof ProductFilters, value?: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }

      if (key === "minPrice" || key === "maxPrice") {
        delete newFilters.minPrice
        delete newFilters.maxPrice
      } else if (value && Array.isArray(newFilters[key])) {
        const arrayKey = key as "sizes" | "colors" | "brands"
        const currentArray = newFilters[arrayKey] || []
        const newArray = currentArray.filter((item) => item !== value)
        if (newArray.length === 0) {
          delete newFilters[arrayKey]
        } else {
          newFilters[arrayKey] = newArray
        }
      } else {
        delete newFilters[key]
      }

      return newFilters
    })
    setPage(1)
  }, [])

  return {
    products,
    loading,
    error,
    filters,
    sort,
    page,
    totalProducts,
    totalPages,
    availableFilters,
    searchQuery,
    updateFilters,
    updateSort,
    updatePage,
    updateSearch,
    clearFilters,
    removeFilter,
    refetch: fetchProducts,
  }
}
