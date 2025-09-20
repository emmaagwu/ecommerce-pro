import { groq } from "next-sanity"

export const allProductsQuery = groq`
  *[_type == "product"]{
    _id,
    name,
    slug,
    price,
    "category": category->name,
    "brand": brand->name,
    "colors": colors[]->name,
    "sizes": sizes,
    "images": images[].asset->url
  } | order(_createdAt desc)
`
