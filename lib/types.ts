export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  image: string
  images?: string[]
  description: string
  sizes: string[]
  colors: string[]
  inStock: boolean
  rating: number
  reviewCount: number
  tags: string[]
  brand: string
  createdAt: string
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
  field: "name" | "price" | "rating" | "createdAt"
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
