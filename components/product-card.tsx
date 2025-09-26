"use client"

import type React from "react"

import type { Product } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCartStore } from "@/lib/cart-store"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)

  const { addItem, setIsOpen } = useCartStore()

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    setIsOpen(true)
  }
   console.log(product);
  return (
    <Card className="group relative overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden cursor-pointer">
          <Image
             src={imageError ? "/placeholder.svg?height=400&width=300" : product.image}
             alt={product.name}
             fill
             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
             priority
             className="object-cover transition-transform duration-300 group-hover:scale-105"
             onError={() => setImageError(true)}
          />

          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background z-10"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsWishlisted(!isWishlisted)
            }}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {!product.inStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Brand */}
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-card-foreground line-clamp-2 text-balance hover:text-primary transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground ml-1">
                {product.rating} ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-card-foreground">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Colors - Fixed null safety */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Colors:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="h-3 w-3 rounded-full border border-border"
                    style={{
                      backgroundColor:
                        color.toLowerCase() === "white"
                          ? "#ffffff"
                          : color.toLowerCase() === "black"
                            ? "#000000"
                            : color.toLowerCase() === "navy"
                              ? "#1e3a8a"
                              : color.toLowerCase() === "gray"
                                ? "#6b7280"
                                : color.toLowerCase() === "red"
                                  ? "#dc2626"
                                  : color.toLowerCase() === "blue"
                                    ? "#2563eb"
                                    : color.toLowerCase().includes("blue")
                                      ? "#3b82f6"
                                      : color.toLowerCase().includes("pink")
                                        ? "#ec4899"
                                        : color.toLowerCase().includes("yellow")
                                          ? "#eab308"
                                          : color.toLowerCase() === "brown"
                                            ? "#92400e"
                                            : color.toLowerCase() === "cream"
                                              ? "#fef3c7"
                                              : color.toLowerCase() === "burgundy"
                                                ? "#7c2d12"
                                                : "#9ca3af",
                    }}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add to cart button */}
        <Button
          className="w-full mt-4"
          disabled={!product.inStock}
          variant={product.inStock ? "default" : "secondary"}
          onClick={handleAddToCart}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardContent>
    </Card>
  )
}