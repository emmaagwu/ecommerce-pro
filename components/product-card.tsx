"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // --- Discount logic ---
  let discountPercent = 0
  let hasDiscount = false

  if (product.originalPrice !== undefined && product.originalPrice > product.price) {
    hasDiscount = true
    discountPercent = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    )
  }

  return (
    <Card className="overflow-hidden group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              -{discountPercent}%
            </Badge>
          )}

          {!product.inStock && (
            <Badge className="absolute top-2 right-2 bg-gray-500 text-white">
              Out of Stock
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 truncate">{product.name}</h3>

          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">${product.price.toFixed(2)}</span>

            {hasDiscount && (
              <>
                <span className="text-muted-foreground line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
                <span className="text-green-600 text-sm font-medium">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
