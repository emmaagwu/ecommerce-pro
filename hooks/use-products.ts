"use client"

import { useState, useEffect, useCallback } from "react"
import type { Product, ProductFilters, ProductSort } from "@/lib/types"

interface UseProductsOptions {
  initialFilters?: ProductFilters
  initialSort?: ProductSort
  initialPage?: number
  limit?: number
  search?: string
}

// API Response Type Definitions
interface FilterItem {
  id: string
  name: string
}

interface SubcategoryItem extends FilterItem {
  category: string
}

interface PriceRange {
  min: number
  max: number
}

interface ApiFiltersResponse {
  categories: FilterItem[]
  subcategories: SubcategoryItem[]
  brands: FilterItem[]
  colors: FilterItem[]
  sizes: FilterItem[]
  tags: FilterItem[]
  priceRange: PriceRange
}

interface ApiProductItem {
  id: string
  name: string
  price: number
  originalPrice?: number | null
  description: string
  image: string
  images: string[]
  inStock: boolean
  rating?: number | null
  reviewCount?: number | null
  createdAt: string
  category: FilterItem | null
  subcategory: (FilterItem & { category: FilterItem }) | null
  brand: FilterItem | null
  sizes: FilterItem[]
  colors: FilterItem[]
  tags: FilterItem[]
}

interface ApiProductsResponse {
  results: ApiProductItem[]
  count: number
  next: string | null
  previous: string | null
}

interface TransformedFilters {
  categories: string[]
  subcategories: string[]
  brands: string[]
  priceRange: PriceRange
  sizes: string[]
  colors: string[]
}

// Transform API product data to frontend Product type
export const transformProduct = (apiProduct: ApiProductItem): Product => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: apiProduct.price,
    originalPrice: apiProduct.originalPrice || undefined,
    description: apiProduct.description,
    image: apiProduct.image,
    images: apiProduct.images || [],
    inStock: apiProduct.inStock,
    rating: apiProduct.rating || 0,
    reviewCount: apiProduct.reviewCount || 0,
    category: apiProduct.category?.name || "Uncategorized",
    subcategory: apiProduct.subcategory?.name || undefined,
    brand: apiProduct.brand?.name || "No Brand",
    sizes: apiProduct.sizes?.map((s) => s.name) || [],
    colors: apiProduct.colors?.map((c) => c.name) || [],
    tags: apiProduct.tags?.map((t) => t.name) || [],
    createdAt: apiProduct.createdAt,
  }
}

export function useProducts({
  initialFilters = {},
  initialSort = { field: "createdAt", direction: "desc" },
  initialPage = 1,
  limit = 12,
  search = "",
}: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>(initialFilters)
  const [sort, setSort] = useState<ProductSort>(initialSort)
  const [page, setPage] = useState(initialPage)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [availableFilters, setAvailableFilters] = useState<TransformedFilters>({
    categories: [],
    subcategories: [],
    brands: [],
    priceRange: { min: 0, max: 1000 },
    sizes: [],
    colors: [],
  })
  const [searchQuery, setSearchQuery] = useState(search || "")

  // Get base URL from environment
  const baseRoute = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001"  

  // Fetch available filters from API
  const fetchAvailableFilters = useCallback(async () => {
    try {
      const response = await fetch(`${baseRoute}/api/filters/`)
      if (!response.ok) throw new Error("Failed to fetch filters")
      
      const data: ApiFiltersResponse = await response.json()
      
      setAvailableFilters({
        categories: data.categories.map((c) => c.name),
        subcategories: data.subcategories.map((s) => s.name),
        brands: data.brands.map((b) => b.name),
        colors: data.colors.map((c) => c.name),
        sizes: data.sizes.map((s) => s.name),
        priceRange: data.priceRange,
      })
    } catch (err) {
      console.error("Failed to fetch available filters:", err)
    }
  }, [baseRoute])

  // Fetch products with abort signal support
  const fetchProducts = useCallback(async (signal?: AbortSignal) => {
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

      const response = await fetch(`${baseRoute}/api/products/?${params}`, { signal })
      if (!response.ok) throw new Error("Failed to fetch products")

      const data: ApiProductsResponse = await response.json()
      
      // Only update state if request wasn't aborted
      if (!signal?.aborted) {
        const transformedProducts = data.results.map(transformProduct)
        setProducts(transformedProducts)
        setTotalProducts(data.count)
        setTotalPages(Math.ceil(data.count / limit))
      }
      
    } catch (err) {
      // Don't show error if request was aborted
      if (!signal?.aborted) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        setError(errorMessage)
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [filters, sort, page, limit, searchQuery, baseRoute])

  // Load available filters on component mount
  useEffect(() => {
    fetchAvailableFilters()
  }, [fetchAvailableFilters])

  // Load products with proper AbortController cleanup
  useEffect(() => {
    const controller = new AbortController()
    
    fetchProducts(controller.signal)
    
    // React will call this cleanup when dependencies change or component unmounts
    return () => controller.abort()
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

  // Manual refetch function for external use
  const refetch = useCallback(() => {
    fetchProducts()
  }, [fetchProducts])

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
    refetch,
  }
}

/**
 * Delete a product by its id.
 * @param productId - The product id to delete.
 */
export async function deleteProduct(productId: string) {
  // IMPORTANT: Use the correct API base route. If you use relative, it will proxy via Next.js.
  const res = await fetch(`/api/products?id=${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    let msg = "Failed to delete product";
    try {
      const data = await res.json();
      msg = data.message || msg;
    } catch {}
    throw new Error(msg);
  }
}