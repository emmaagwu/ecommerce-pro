import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "12");
  const sortField = (searchParams.get("sortField") as any) || "createdAt";
  const sortDirection = (searchParams.get("sortDirection") as any) || "desc";

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
    sort: { field: sortField, direction: sortDirection },
    filters,
    search,
  });

  return NextResponse.json(response);
}