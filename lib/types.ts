export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  inStock: boolean
  createdAt: string

  // Optional
  originalPrice?: number
  images?: string[]
  rating?: number
  reviewCount?: number
  category?: string
  subcategory?: string
  brand?: string
  sizes?: string[]
  colors?: string[]
  tags?: string[]
}

export interface ProductFilters {
  category?: string
  subcategory?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  brands?: string[]
  inStock?: boolean
  tags?: string[]
}

export interface ProductSort {
  field: "name" | "price" | "rating" | "createdAt" | "brand"
  direction: "asc" | "desc"
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
  filters: {
    categories: string[]
    subcategories: string[]
    brands: string[]
    priceRange: { min: number; max: number }
    sizes: string[]
    colors: string[]
  }
}
