// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // Validate ID format (assuming UUID or similar)
    if (!productId || productId.trim() === "") {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Fetch the product with all relations
    const productRaw = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        subcategory: true,
        brand: true,
        sizes: true,
        colors: true,
        tags: true,
      },
    });

    if (!productRaw) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Normalize to Product interface (matching your existing structure)
    const product = {
      id: productRaw.id,
      name: productRaw.name,
      price: productRaw.price,
      originalPrice: productRaw.originalPrice ?? undefined,
      description: productRaw.description,
      image: productRaw.image,
      images: productRaw.images || [],
      inStock: productRaw.inStock,
      rating: productRaw.rating,
      reviewCount: productRaw.reviewCount,
      category: productRaw.category.name,
      subcategory: productRaw.subcategory?.name,
      brand: productRaw.brand.name,
      sizes: productRaw.sizes.map((s) => s.name),
      colors: productRaw.colors.map((c) => c.name),
      tags: productRaw.tags.map((t) => t.name),
      createdAt: productRaw.createdAt.toISOString(),
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}