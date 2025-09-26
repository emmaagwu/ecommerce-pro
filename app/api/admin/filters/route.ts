import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [categories, subcategories, brands, colors, sizes, tags] = await Promise.all([
      prisma.category.findMany({ select: { name: true } }),
      prisma.subcategory.findMany({ select: { name: true, category: { select: { name: true } } } }),
      prisma.brand.findMany({ select: { name: true } }),
      prisma.color.findMany({ select: { name: true } }),
      prisma.size.findMany({ select: { name: true } }),
      prisma.tag.findMany({ select: { name: true } }),
    ]);

    return NextResponse.json({
      categories: categories.map(c => c.name),
      subcategories: subcategories.map(sc => sc.name),
      brands: brands.map(b => b.name),
      colors: colors.map(c => c.name),
      sizes: sizes.map(s => s.name),
      tags: tags.map(t => t.name),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 });
  }
}
