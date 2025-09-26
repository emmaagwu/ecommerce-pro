import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const colors = await prisma.color.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(colors);
  } catch (_) {
    return NextResponse.json({ error: "Failed to fetch colors" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const color = await prisma.color.create({ data: { name } });
    return NextResponse.json(color, { status: 201 });
  } catch (err) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Color already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create color" }, { status: 500 });
  }
}