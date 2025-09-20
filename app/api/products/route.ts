import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import type { ProductFilters, ProductSort, ProductsResponse } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Pagination
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "12");
  const start = (page - 1) * limit;

  // Sorting
  const sortField = (searchParams.get("sortField") as ProductSort["field"]) || "createdAt";
  const sortDirection = (searchParams.get("sortDirection") as ProductSort["direction"]) || "desc";

  // Filters
  const categoryFilter = searchParams.get("category") || undefined;
  const brandFilter = searchParams.get("brand") || undefined;
  const search = searchParams.get("search") || undefined;
  const sizesFilter = searchParams.get("sizes")?.split(",");
  const colorsFilter = searchParams.get("colors")?.split(",");
  const brandsFilter = searchParams.get("brands")?.split(",");

  // Build Prisma query
  const where: any = {};

  if (categoryFilter) {
    where.category = { name: categoryFilter };
  }

  if (brandFilter) {
    where.brand = { name: brandFilter };
  }

  if (brandsFilter && brandsFilter.length > 0) {
    where.brand = { name: { in: brandsFilter } };
  }

  if (sizesFilter && sizesFilter.length > 0) {
    where.sizes = { some: { name: { in: sizesFilter } } };
  }

  if (colorsFilter && colorsFilter.length > 0) {
    where.colors = { some: { name: { in: colorsFilter } } };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { brand: { name: { contains: search, mode: "insensitive" } } },
      { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
    ];
  }

  // Fetch total count
  const total = await prisma.product.count({ where });

  // Fetch products with pagination
  const products = await prisma.product.findMany({
    where,
    skip: start,
    take: limit,
    include: {
      category: true,
      subcategory: true,
      brand: true,
      sizes: true,
      colors: true,
      tags: true,
    },
    orderBy: {
      [sortField]: sortDirection,
    },
  });

  // Fetch filter metadata
  const [categories, brands, colors, sizes] = await Promise.all([
    prisma.category.findMany({ select: { name: true } }),
    prisma.brand.findMany({ select: { name: true } }),
    prisma.color.findMany({ select: { name: true } }),
    prisma.size.findMany({ select: { name: true } }),
  ]);

  const prices = await prisma.product.findMany({ select: { price: true } });
  const priceRange = {
    min: Math.min(...prices.map((p) => p.price)),
    max: Math.max(...prices.map((p) => p.price)),
  };

  const response: ProductsResponse = {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    filters: {
      categories: categories.map((c) => c.name),
      brands: brands.map((b) => b.name),
      colors: colors.map((c) => c.name),
      sizes: sizes.map((s) => s.name),
      priceRange,
    },
  };

  return NextResponse.json(response);
}
