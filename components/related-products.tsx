"use client"

import { useEffect, useState } from "react"
import ProductCard from "@/components/product-card"
import type { Product } from "@/lib/types"
import { transformProduct } from "@/hooks/use-products"

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const baseRoute = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001"

  useEffect(() => {
    if (!category) return

    setLoading(true)

    fetch(`${baseRoute}/api/products/?category=${encodeURIComponent(category)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch related products")
        return res.json()
      })
      .then((data) => {
        const transformed = data.results
          .map(transformProduct)
          .filter((p: Product) => p.id !== currentProductId) // exclude current
          .slice(0, 4) // max 4
        setRelatedProducts(transformed)
      })
      .catch((err) => {
        console.error("Error fetching related products:", err)
        setRelatedProducts([])
      })
      .finally(() => setLoading(false))
  }, [category, currentProductId, baseRoute])

  if (loading) return null
  if (relatedProducts.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-8 text-center">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
