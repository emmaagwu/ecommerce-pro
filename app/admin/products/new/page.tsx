import ProductForm from "@/components/admin/products/ProductForm"

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <ProductForm />
    </div>
  )
}