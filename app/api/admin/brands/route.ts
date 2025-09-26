import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(brands);
  } catch (_) {
    // You can log the error for debugging if needed
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const brand = await prisma.brand.create({ data: { name } });
    return NextResponse.json(brand, { status: 201 });
  } catch (err) {   
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Brand already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}