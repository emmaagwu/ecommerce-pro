import { type NextRequest, NextResponse } from "next/server"
import { dummyProducts } from "@/lib/dummy-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const product = dummyProducts.find((p) => p.id === params.id)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}
