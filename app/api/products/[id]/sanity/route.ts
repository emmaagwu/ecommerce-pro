// // import { type NextRequest, NextResponse } from "next/server"
// // import { dummyProducts } from "@/lib/dummy-data"

// // export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
// //   const product = dummyProducts.find((p) => p.id === params.id)

// //   if (!product) {
// //     return NextResponse.json({ error: "Product not found" }, { status: 404 })
// //   }

// //   return NextResponse.json(product)
// // }

// import { type NextRequest, NextResponse } from "next/server"
// import { dummyProducts } from "@/lib/dummy-data"

// export async function GET(
//   request: NextRequest,
//   {params}: { params:  Promise<{ id: string; }>}
// ) {
//   const { id } = await params

//   const product = dummyProducts.find((p) => p.id === id)

//   if (!product) {
//     return NextResponse.json({ error: "Product not found" }, { status: 404 })
//   }

//   return NextResponse.json(product)
// }


// FOR SANITY



// import { type NextRequest, NextResponse } from "next/server"
// import { sanityClient } from "@/sanity/client"
// import { groq } from "next-sanity"
// import type { Product } from "@/lib/types"

// export async function GET(
//   request: NextRequest,
//   { params }: {params: Promise<{ id: string }> } 
// ) {
//   const { id } = await params

//   // GROQ query for a single product
//   const query = groq`
//     *[_type == "product" && _id == $id][0] {
//       "id": _id,
//       name,
//       "slug": slug.current,
//       price,
//       inStock,
//       "category": category->name,
//       "brand": brand->name,
//       "colors": colors[]->name,
//       "sizes": sizes[]->name,
//       "image": mainImage.asset->url,
//       "images": images[].asset->url,
//       description,
//       createdAt
//     }
//   `

//   const product: Product | null = await sanityClient.fetch(query, { id })

//   if (!product) {
//     return NextResponse.json({ error: "Product not found" }, { status: 404 })
//   }

//   return NextResponse.json(product)
// }


export async function GET() {
  return new Response("Sanity API is disabled for now", { status: 410 }); // 410 Gone
}


