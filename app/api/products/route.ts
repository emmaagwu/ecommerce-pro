import { NextResponse } from "next/server";

const allowedSortFields = ["createdAt", "name", "price", "rating", "brand"] as const;
const allowedSortDirections = ["desc", "asc"] as const;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "12");

  let sortField = searchParams.get("sortField") || "createdAt";
  let sortDirection = searchParams.get("sortDirection") || "desc";

  if (!allowedSortFields.includes(sortField as typeof allowedSortFields[number])) {
    sortField = "createdAt";
  }
  if (!allowedSortDirections.includes(sortDirection as typeof allowedSortDirections[number])) {
    sortDirection = "desc";
  }

  const filters = {
    category: searchParams.get("category") || undefined,
    subcategory: searchParams.get("subcategory") || undefined,
    brands: searchParams.get("brands")?.split(",") || [],
    sizes: searchParams.get("sizes")?.split(",") || [],
    colors: searchParams.get("colors")?.split(",") || [],
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    inStock: searchParams.get("inStock") === "true" ? true : undefined,
  };

  const search = searchParams.get("search") || "";

  const { getProducts } = await import("@/actions/getProducts");

  const response = await getProducts({
    page,
    limit,
    sort: {
      field: sortField as typeof allowedSortFields[number],
      direction: sortDirection as typeof allowedSortDirections[number],
    },
    filters,
    search,
  });

  return NextResponse.json(response);
}