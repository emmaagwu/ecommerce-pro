// import { notFound } from "next/navigation"
// import { dummyProducts } from "@/lib/dummy-data"
// import { ProductDetailView } from "@/components/product-detail-view"
// import { RelatedProducts } from "@/components/related-products"

// interface ProductPageProps {
//   params: {
//     id: string
//   }
// }

// export default function ProductPage({ params }: ProductPageProps) {
//   const product = dummyProducts.find((p) => p.id === params.id)

//   if (!product) {
//     notFound()
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <ProductDetailView product={product} />
//       <RelatedProducts currentProductId={product.id} category={product.category} />
//     </div>
//   )
// }

// export function generateStaticParams() {
//   return dummyProducts.map((product) => ({
//     id: product.id,
//   }))
// }


"use client"

import { use } from "react"
import { useEffect, useState } from "react"
import { ProductDetailView } from "@/components/product-detail-view"
import { RelatedProducts } from "@/components/related-products"
import type { Product } from "@/lib/types"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params) // <-- unwrap the promise

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="min-h-screen bg-background">
      <ProductDetailView product={product} />
      <RelatedProducts currentProductId={product.id} category={product.category} />
    </div>
  )
}
