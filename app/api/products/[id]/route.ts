// import { type NextRequest, NextResponse } from "next/server"
// import { dummyProducts } from "@/lib/dummy-data"

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   const product = dummyProducts.find((p) => p.id === params.id)

//   if (!product) {
//     return NextResponse.json({ error: "Product not found" }, { status: 404 })
//   }

//   return NextResponse.json(product)
// }

import { type NextRequest, NextResponse } from "next/server"
import { dummyProducts } from "@/lib/dummy-data"

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params

  const product = dummyProducts.find((p) => p.id === id)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

