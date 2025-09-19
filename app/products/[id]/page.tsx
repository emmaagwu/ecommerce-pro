import { notFound } from "next/navigation"
import { dummyProducts } from "@/lib/dummy-data"
import { ProductDetailView } from "@/components/product-detail-view"
import { RelatedProducts } from "@/components/related-products"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = dummyProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <ProductDetailView product={product} />
      <RelatedProducts currentProductId={product.id} category={product.category} />
    </div>
  )
}

export function generateStaticParams() {
  return dummyProducts.map((product) => ({
    id: product.id,
  }))
}
