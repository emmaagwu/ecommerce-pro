"use client"

import { useRouter } from "next/navigation"
import ProductForm from "@/components/admin/products/ProductForm"
import { toast } from "sonner"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm
        productId={params.id}
        onSuccess={() => {
          toast.success("Product updated successfully!")
          router.push("/admin/products")
        }}
      />
    </div>
  )
}