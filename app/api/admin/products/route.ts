import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      price,
      originalPrice,
      description,
      category,
      subcategory,
      brand,
      colors = [],
      sizes = [],
      tags = [],
      image,
      images = [],
      inStock = true,
    } = body;

    // Convert price fields to float
    const priceFloat = parseFloat(price);
    const originalPriceFloat = originalPrice ? parseFloat(originalPrice) : undefined;

    // --- Upsert relations ---
    const categoryRecord = await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });

    const subcategoryRecord = await prisma.subcategory.upsert({
      where: { name_categoryId: { name: subcategory, categoryId: categoryRecord.id } },
      update: {},
      create: { name: subcategory, categoryId: categoryRecord.id },
    });

    const brandRecord = await prisma.brand.upsert({
      where: { name: brand },
      update: {},
      create: { name: brand },
    });

    const colorRecords = await Promise.all(
      colors.map((c: string) =>
        prisma.color.upsert({ where: { name: c }, update: {}, create: { name: c } })
      )
    );

    const sizeRecords = await Promise.all(
      sizes.map((s: string) =>
        prisma.size.upsert({ where: { name: s }, update: {}, create: { name: s } })
      )
    );

    const tagRecords = await Promise.all(
      tags.map((t: string) =>
        prisma.tag.upsert({ where: { name: t }, update: {}, create: { name: t } })
      )
    );

    // --- Create product ---
    const product = await prisma.product.create({
      data: {
        name,
        price: priceFloat,
        originalPrice: originalPriceFloat,
        description,
        image: image || "",
        images,
        inStock,
        rating: 0,
        reviewCount: 0,
        category: { connect: { id: categoryRecord.id } },
        subcategory: { connect: { id: subcategoryRecord.id } },
        brand: { connect: { id: brandRecord.id } },
        colors: { connect: colorRecords.map((c) => ({ id: c.id })) },
        sizes: { connect: sizeRecords.map((s) => ({ id: s.id })) },
        tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("❌ Product creation failed:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// ================= PATCH endpoint =================
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    // Handle upserts for relations if they exist in the request
    let categoryRecord, subcategoryRecord, brandRecord, colorRecords, sizeRecords, tagRecords;

    if (data.category) {
      categoryRecord = await prisma.category.upsert({
        where: { name: data.category },
        update: {},
        create: { name: data.category },
      });
    }

    if (data.subcategory && categoryRecord) {
      subcategoryRecord = await prisma.subcategory.upsert({
        where: { name_categoryId: { name: data.subcategory, categoryId: categoryRecord.id } },
        update: {},
        create: { name: data.subcategory, categoryId: categoryRecord.id },
      });
    }

    if (data.brand) {
      brandRecord = await prisma.brand.upsert({
        where: { name: data.brand },
        update: {},
        create: { name: data.brand },
      });
    }

    if (data.colors) {
      colorRecords = await Promise.all(
        data.colors.map((c: string) =>
          prisma.color.upsert({ where: { name: c }, update: {}, create: { name: c } })
        )
      );
    }

    if (data.sizes) {
      sizeRecords = await Promise.all(
        data.sizes.map((s: string) =>
          prisma.size.upsert({ where: { name: s }, update: {}, create: { name: s } })
        )
      );
    }

    if (data.tags) {
      tagRecords = await Promise.all(
        data.tags.map((t: string) =>
          prisma.tag.upsert({ where: { name: t }, update: {}, create: { name: t } })
        )
      );
    }

    // Prepare update object
    const updateData: any = { ...data };

    if (categoryRecord) updateData.category = { connect: { id: categoryRecord.id } };
    if (subcategoryRecord) updateData.subcategory = { connect: { id: subcategoryRecord.id } };
    if (brandRecord) updateData.brand = { connect: { id: brandRecord.id } };
    if (colorRecords) updateData.colors = { set: colorRecords.map((c) => ({ id: c.id })) };
    if (sizeRecords) updateData.sizes = { set: sizeRecords.map((s) => ({ id: s.id })) };
    if (tagRecords) updateData.tags = { set: tagRecords.map((t) => ({ id: t.id })) };

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("❌ Product update failed:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// ================= DELETE endpoint =================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Product deletion failed:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
