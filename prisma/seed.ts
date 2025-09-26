import { PrismaClient } from "../app/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // ----- Categories -----
  const fashion = await prisma.category.upsert({
    where: { name: "Fashion" },
    update: {},
    create: { name: "Fashion" },
  })

  // ----- Subcategories -----
  const menSub = await prisma.subcategory.upsert({
    where: { name_categoryId: { name: "Men", categoryId: fashion.id } },
    update: {},
    create: { name: "Men", categoryId: fashion.id },
  })

  const womenSub = await prisma.subcategory.upsert({
    where: { name_categoryId: { name: "Women", categoryId: fashion.id } },
    update: {},
    create: { name: "Women", categoryId: fashion.id },
  })

  // ----- Brands -----
  const nike = await prisma.brand.upsert({
    where: { name: "Nike" },
    update: {},
    create: { name: "Nike" },
  })

  const adidas = await prisma.brand.upsert({
    where: { name: "Adidas" },
    update: {},
    create: { name: "Adidas" },
  })

  // ----- Sizes -----
  const [small, medium, large] = await Promise.all([
    prisma.size.upsert({ where: { name: "S" }, update: {}, create: { name: "S" } }),
    prisma.size.upsert({ where: { name: "M" }, update: {}, create: { name: "M" } }),
    prisma.size.upsert({ where: { name: "L" }, update: {}, create: { name: "L" } }),
  ])

  // ----- Colors -----
  const [black, white, red, blue] = await Promise.all([
    prisma.color.upsert({ where: { name: "Black" }, update: {}, create: { name: "Black" } }),
    prisma.color.upsert({ where: { name: "White" }, update: {}, create: { name: "White" } }),
    prisma.color.upsert({ where: { name: "Red" }, update: {}, create: { name: "Red" } }),
    prisma.color.upsert({ where: { name: "Blue" }, update: {}, create: { name: "Blue" } }),
  ])

  // ----- Tags -----
  const [newTag, saleTag, trendingTag] = await Promise.all([
    prisma.tag.upsert({ where: { name: "New Arrival" }, update: {}, create: { name: "New Arrival" } }),
    prisma.tag.upsert({ where: { name: "Sale" }, update: {}, create: { name: "Sale" } }),
    prisma.tag.upsert({ where: { name: "Trending" }, update: {}, create: { name: "Trending" } }),
  ])

  // ----- Products -----
  await prisma.product.create({
    data: {
      name: "Nike Air Max Sneakers",
      price: 120.0,
      originalPrice: 150.0,
      description: "Stylish and comfortable Nike Air Max sneakers perfect for everyday wear.",
      image: "https://example.com/nike-airmax-main.jpg",
      images: [
        "https://example.com/nike-airmax-1.jpg",
        "https://example.com/nike-airmax-2.jpg",
      ],
      inStock: true,
      rating: 4.5,
      reviewCount: 20,
      category: { connect: { id: fashion.id } },
      subcategory: { connect: { id: menSub.id } },
      brand: { connect: { id: nike.id } },
      sizes: { connect: [{ id: small.id }, { id: medium.id }, { id: large.id }] },
      colors: { connect: [{ id: black.id }, { id: white.id }] },
      tags: { connect: [{ id: newTag.id }, { id: trendingTag.id }] },
    },
  })

  await prisma.product.create({
    data: {
      name: "Adidas Women’s Hoodie",
      price: 75.0,
      originalPrice: 95.0,
      description: "Cozy Adidas hoodie for women. Perfect for workouts and casual outings.",
      image: "https://example.com/adidas-hoodie-main.jpg",
      images: [
        "https://example.com/adidas-hoodie-1.jpg",
        "https://example.com/adidas-hoodie-2.jpg",
      ],
      inStock: true,
      rating: 4.8,
      reviewCount: 45,
      category: { connect: { id: fashion.id } },
      subcategory: { connect: { id: womenSub.id } },
      brand: { connect: { id: adidas.id } },
      sizes: { connect: [{ id: medium.id }, { id: large.id }] },
      colors: { connect: [{ id: red.id }, { id: blue.id }] },
      tags: { connect: [{ id: saleTag.id }, { id: trendingTag.id }] },
    },
  })

  console.log("✅ Database seeded successfully with 2 fashion products")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
