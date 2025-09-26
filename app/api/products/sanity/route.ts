// // import { type NextRequest, NextResponse } from "next/server"
// // import { dummyProducts, categories, subcategories, brands, sizes, colors } from "@/lib/dummy-data"
// // import type { ProductFilters, ProductSort, ProductsResponse } from "@/lib/types"

// // export async function GET(request: NextRequest) {
// //   const { searchParams } = new URL(request.url)

// //   // Parse query parameters
// //   const page = Number.parseInt(searchParams.get("page") || "1")
// //   const limit = Number.parseInt(searchParams.get("limit") || "12")
// //   const category = searchParams.get("category") || undefined
// //   const subcategory = searchParams.get("subcategory") || undefined
// //   const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
// //   const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
// //   const sizesParam = searchParams.get("sizes")
// //   const colorsParam = searchParams.get("colors")
// //   const brandsParam = searchParams.get("brands")
// //   const inStock = searchParams.get("inStock") === "true" ? true : undefined
// //   const sortField = (searchParams.get("sortField") as ProductSort["field"]) || "createdAt"
// //   const sortDirection = (searchParams.get("sortDirection") as ProductSort["direction"]) || "desc"
// //   const search = searchParams.get("search") || undefined

// //   // Parse array parameters
// //   const sizesFilter = sizesParam ? sizesParam.split(",") : undefined
// //   const colorsFilter = colorsParam ? colorsParam.split(",") : undefined
// //   const brandsFilter = brandsParam ? brandsParam.split(",") : undefined

// //   const filters: ProductFilters = {
// //     category,
// //     subcategory,
// //     minPrice,
// //     maxPrice,
// //     sizes: sizesFilter,
// //     colors: colorsFilter,
// //     brands: brandsFilter,
// //     inStock,
// //   }

// //   // Filter products
// //   const filteredProducts = dummyProducts.filter((product) => {
// //     // Category filter
// //     if (filters.category && product.category !== filters.category) return false

// //     // Subcategory filter
// //     if (filters.subcategory && product.subcategory !== filters.subcategory) return false

// //     // Price filters
// //     if (filters.minPrice && product.price < filters.minPrice) return false
// //     if (filters.maxPrice && product.price > filters.maxPrice) return false

// //     // Size filter
// //     if (filters.sizes && filters.sizes.length > 0) {
// //       const hasMatchingSize = filters.sizes.some((size) => product.sizes.includes(size))
// //       if (!hasMatchingSize) return false
// //     }

// //     // Color filter
// //     if (filters.colors && filters.colors.length > 0) {
// //       const hasMatchingColor = filters.colors.some((color) =>
// //         product.colors.some((productColor) => productColor.toLowerCase().includes(color.toLowerCase())),
// //       )
// //       if (!hasMatchingColor) return false
// //     }

// //     // Brand filter
// //     if (filters.brands && filters.brands.length > 0) {
// //       if (!filters.brands.includes(product.brand)) return false
// //     }

// //     // Stock filter
// //     if (filters.inStock !== undefined && product.inStock !== filters.inStock) return false

// //     // Search filter
// //     if (search) {
// //       const searchLower = search.toLowerCase()
// //       const matchesSearch =
// //         product.name.toLowerCase().includes(searchLower) ||
// //         product.description.toLowerCase().includes(searchLower) ||
// //         product.brand.toLowerCase().includes(searchLower) ||
// //         product.tags.some((tag) => tag.toLowerCase().includes(searchLower))
// //       if (!matchesSearch) return false
// //     }

// //     return true
// //   })

// //   // Sort products
// //   filteredProducts.sort((a, b) => {
// //     let aValue: string | number | Date
// //     let bValue: string | number | Date
  
// //     if (sortField === "createdAt") {
// //       aValue = new Date(a.createdAt).getTime()
// //       bValue = new Date(b.createdAt).getTime()
// //     } else if (sortField === "price") {
// //       aValue = a.price
// //       bValue = b.price
// //     } else if (sortField === "name") {
// //       aValue = a.name.toLowerCase()
// //       bValue = b.name.toLowerCase()
// //     } else if (sortField === "brand") {
// //       aValue = a.brand.toLowerCase()
// //       bValue = b.brand.toLowerCase()
// //     } else {
// //       // fallback in case new field gets added later
// //       return 0
// //     }
  
// //     if (sortDirection === "asc") {
// //       return aValue > bValue ? 1 : -1
// //     } else {
// //       return aValue < bValue ? 1 : -1
// //     }
// //   })

// //   // Calculate pagination
// //   const total = filteredProducts.length
// //   const totalPages = Math.ceil(total / limit)
// //   const startIndex = (page - 1) * limit
// //   const endIndex = startIndex + limit
// //   const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

// //   // Calculate price range for filters
// //   const prices = dummyProducts.map((p) => p.price)
// //   const priceRange = {
// //     min: Math.min(...prices),
// //     max: Math.max(...prices),
// //   }

// //   const response: ProductsResponse = {
// //     products: paginatedProducts,
// //     total,
// //     page,
// //     limit,
// //     totalPages,
// //     filters: {
// //       categories,
// //       subcategories,
// //       brands,
// //       priceRange,
// //       sizes,
// //       colors,
// //     },
// //   }

// //   return NextResponse.json(response)
// // }


// import { type NextRequest, NextResponse } from "next/server"
// import { sanityClient } from "@/sanity/client"
// import { groq } from "next-sanity"
// import type { ProductFilters, ProductSort, ProductsResponse } from "@/lib/types"

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)

//   // Parse query params
//   const page = Number.parseInt(searchParams.get("page") || "1")
//   const limit = Number.parseInt(searchParams.get("limit") || "12")
//   const category = searchParams.get("category") || undefined
//   const brand = searchParams.get("brand") || undefined
//   const search = searchParams.get("search") || undefined
//   const sortField = (searchParams.get("sortField") as ProductSort["field"]) || "createdAt"
//   const sortDirection = (searchParams.get("sortDirection") as ProductSort["direction"]) || "desc"

//   // Multi-value filters (split by comma)
//   const sizesFilter = searchParams.get("sizes")?.split(",")
//   const colorsFilter = searchParams.get("colors")?.split(",")
//   const brandsFilter = searchParams.get("brands")?.split(",")

//   const start = (page - 1) * limit
//   const end = start + limit

//   // Build GROQ filters
//   let conditions: string[] = [`_type == "product"`]

//   if (category) conditions.push(`category->name == $category`)
//   if (brand) conditions.push(`brand->name == $brand`)
//   if (brandsFilter?.length) conditions.push(`brand->name in $brandsFilter`)
//   if (sizesFilter?.length) conditions.push(`count((sizes)[@ in $sizesFilter]) > 0`)
//   if (colorsFilter?.length) conditions.push(`count((colors[]->name)[@ in $colorsFilter]) > 0`)
//   if (search) conditions.push(`name match $search`)

//   const where = `*[${conditions.join(" && ")}]`

//   // Main query
//   const query = groq`
//     ${where} | order(${sortField} ${sortDirection}) {
//       "id": _id,
//       name,
//       "slug": slug.current,
//       price,
//       inStock,
//       "category": category->name,
//       "brand": brand->name,
//       "colors": colors[]->name,
//       "sizes": sizes,      
//       "image": mainImage.asset->url,
//       "images": images[].asset->url,
//       createdAt
//     }
//   `

//   const products = await sanityClient.fetch(query, {
//     category,
//     brand,
//     search: search ? `${search}*` : undefined,
//     sizesFilter,
//     colorsFilter,
//     brandsFilter,
//   })

//   // Pagination
//   const total = products.length
//   const totalPages = Math.ceil(total / limit)
//   const paginatedProducts = products.slice(start, end)

//   // Metadata for filters
//   const metaQuery = groq`
//     {
//       "categories": *[_type == "category"].name,
//       "brands": *[_type == "brand"].name,
//       "colors": *[_type == "color"].name,
//       "sizes": *[_type == "size"].name,
//       "priceRange": {
//       "min": *[_type == "product"] | order(price asc)[0].price,
//       "max": *[_type == "product"] | order(price desc)[0].price
//       }
//     }
//   `
//   const filtersData = await sanityClient.fetch(metaQuery)

//   const response: ProductsResponse = {
//     products: paginatedProducts,
//     total,
//     page,
//     limit,
//     totalPages,
//     filters: filtersData,
//   }

//   return NextResponse.json(response)
// }

export async function GET() {
  return new Response("Sanity API is disabled for now", { status: 410 }); // 410 Gone
}
