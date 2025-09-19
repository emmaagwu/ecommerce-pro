"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { CartItem } from "@/lib/cart-store"

interface OrderSummaryProps {
  items: CartItem[]
  total: number
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  const subtotal = total
  const shipping = subtotal > 75 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const finalTotal = subtotal + shipping + tax

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md border flex-shrink-0">
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {item.quantity}
                </Badge>
              </div>

              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                <p className="text-xs text-muted-foreground">{item.product.brand}</p>

                <div className="flex items-center gap-2 text-xs">
                  {item.selectedSize && (
                    <Badge variant="outline" className="text-xs">
                      Size: {item.selectedSize}
                    </Badge>
                  )}
                  {item.selectedColor && (
                    <Badge variant="outline" className="text-xs">
                      {item.selectedColor}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                  <span className="font-medium text-sm">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Info */}
        {shipping === 0 && <div className="text-xs text-green-600 text-center">🎉 You qualify for free shipping!</div>}

        {shipping > 0 && (
          <div className="text-xs text-muted-foreground text-center">
            Add ${(75 - subtotal).toFixed(2)} more for free shipping
          </div>
        )}
      </CardContent>
    </Card>
  )
}
