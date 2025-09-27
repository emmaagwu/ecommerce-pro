"use client"

import { use } from "react"
import { useEffect, useState } from "react"
import { ProductDetailView } from "@/components/product-detail-view"
import { RelatedProducts } from "@/components/related-products"
import type { Product } from "@/lib/types"
import { transformProduct } from "@/hooks/use-products"  // <-- import here

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params) // unwrap the promise

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const baseRoute = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    fetch(`${baseRoute}/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(transformProduct(data))) // <-- transform here
      .finally(() => setLoading(false))
  }, [id, baseRoute])

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="min-h-screen bg-background">
      <ProductDetailView product={product} />
      <RelatedProducts currentProductId={product.id} category={product.category} />
    </div>
  )
}


