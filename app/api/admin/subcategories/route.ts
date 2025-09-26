import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const subcategories = await prisma.subcategory.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(subcategories);
  } catch (_) {
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, categoryId } = await req.json();

    if (!name || !categoryId)
      return NextResponse.json({ error: "Name and categoryId are required" }, { status: 400 });

    const subcategory = await prisma.subcategory.create({
      data: { name, categoryId },
    });
    return NextResponse.json(subcategory, { status: 201 });
  } catch (err) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Subcategory already exists for this category" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 });
  }
}