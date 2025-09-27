"use client"

import { useProducts } from "@/hooks/use-products"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"

export default function DashboardPage() {
  // Only fetch 5 products for "Recent Products"
  const {
    products: recentProducts,
    loading,
    totalProducts,
  } = useProducts({ limit: 5, initialPage: 1 })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, Admin 👋</h2>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
        <StatCard label="Total Products" value={totalProducts} />
        <StatCard label="Orders" value={0} />
        <StatCard label="Customers" value={0} />
        <StatCard label="Revenue" value={`$0`} />
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
        {loading ? (
          <div className="py-8 flex justify-center">
            <span className="animate-pulse text-gray-400">Loading...</span>
          </div>
        ) : recentProducts.length === 0 ? (
          <p className="text-gray-600 text-sm">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Image</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((prod) => (
                  <tr key={prod.id} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">
                      {prod.image ? (
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          width={36}
                          height={36}
                          className="rounded object-cover bg-gray-100"
                        />
                      ) : (
                        <div className="w-9 h-9 bg-gray-100 flex items-center justify-center rounded text-xs text-gray-400">N/A</div>
                      )}
                    </td>
                    <td className="py-2 pr-4 font-medium">{prod.name}</td>
                    <td className="py-2 pr-4 font-semibold text-green-700">${prod.price?.toFixed(2)}</td>
                    <td className="py-2 pr-4">{prod.category}</td>
                    <td className="py-2 pr-4">{format(new Date(prod.createdAt), "d MMM yyyy")}</td>
                    <td className="py-2 pr-4">
                      <Link href={`/admin/products/${prod.id}/edit`} className="text-blue-600 hover:underline text-xs">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <h3 className="text-xs text-gray-500">{label}</h3>
      <p className="text-lg md:text-2xl font-semibold">{value}</p>
    </div>
  )
}