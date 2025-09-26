import prisma from "@/lib/prisma"
import type { ProductFilters, ProductSort, ProductsResponse } from "@/lib/types"

interface GetProductsOptions {
  page?: number
  limit?: number
  sort?: ProductSort
  filters?: ProductFilters
  search?: string
}

export async function getProducts({
  page = 1,
  limit = 12,
  sort = { field: "createdAt", direction: "desc" },
  filters = {},
  search = "",
}: GetProductsOptions = {}): Promise<ProductsResponse> {
  const skip = (page - 1) * limit

  // ===== Build Prisma WHERE clause =====
  const where: any = {}

  if (filters.category) {
    where.category = { name: filters.category }
  }

  if (filters.subcategory) {
    where.subcategory = { name: filters.subcategory }
  }

  if (filters.brands?.length) {
    where.brand = { name: { in: filters.brands } }
  }

  if (filters.sizes?.length) {
    where.sizes = { some: { name: { in: filters.sizes } } }
  }

  if (filters.colors?.length) {
    where.colors = { some: { name: { in: filters.colors } } }
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {}
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice
  }

  if (filters.inStock !== undefined) {
    where.inStock = filters.inStock
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { brand: { name: { contains: search, mode: "insensitive" } } },
      { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
    ]
  }

  // ===== Fetch total count =====
  const total = await prisma.product.count({ where })

  // ===== Fetch products with relations =====
  const productsRaw = await prisma.product.findMany({
    where,
    skip,
    take: limit,
    include: {
      category: true,
      subcategory: true,
      brand: true,
      sizes: true,
      colors: true,
      tags: true,
    },
    orderBy: {
      [sort.field]: sort.direction,
    },
  })

  // ===== Normalize to Product interface =====
  const products = productsRaw.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    description: p.description,
    image: p.image,
    images: p.images || [],
    inStock: p.inStock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    category: p.category?.name || "Uncategorized",  // Handle null category
    subcategory: p.subcategory?.name,
    brand: p.brand?.name || "No Brand",  // Handle null brand
    sizes: p.sizes.map((s) => s.name),
    colors: p.colors.map((c) => c.name),
    tags: p.tags.map((t) => t.name),
    createdAt: p.createdAt.toISOString(),
  }))

  // ===== Fetch filter metadata =====
  const [categories, subcategories, brands, colors, sizes] = await Promise.all([
    prisma.category.findMany({ select: { name: true } }),
    prisma.subcategory.findMany({ select: { name: true } }),
    prisma.brand.findMany({ select: { name: true } }),
    prisma.color.findMany({ select: { name: true } }),
    prisma.size.findMany({ select: { name: true } }),
  ])

  const prices = await prisma.product.findMany({ select: { price: true } })
  const priceRange = {
    min: prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : 0,
    max: prices.length > 0 ? Math.max(...prices.map((p) => p.price)) : 0,
  }

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    filters: {
      categories: categories.map((c) => c.name),
      subcategories: subcategories.map((sc) => sc.name),
      brands: brands.map((b) => b.name),
      colors: colors.map((c) => c.name),
      sizes: sizes.map((s) => s.name),
      priceRange,
    },
  }
}