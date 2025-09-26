"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { format } from "date-fns";

export default function ProductTable({
  products,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onRefresh,
}: {
  products: any[],
  loading: boolean,
  page: number,
  limit: number,
  total: number,
  onPageChange: (p: number) => void,
  onRefresh?: () => void,
}) {
  const router = useRouter();
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // TableRow + ImageCell + Actions merged here
  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products?id=${productId}`, { method: "DELETE" });
    if (onRefresh) onRefresh();
    else router.refresh();
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <span className="animate-pulse text-gray-400">Loading...</span>
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image || product.images?.[0] ? (
                    <img
                      src={product.image || product.images[0]}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded border"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded border text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <span className="font-semibold text-green-700">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="ml-2 text-xs text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {product.inStock ? (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">In Stock</span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs">Out of Stock</span>
                  )}
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  {product.category}
                  {product.subcategory ? ` / ${product.subcategory}` : ""}
                </TableCell>
                <TableCell>{format(new Date(product.createdAt), "d MMM yyyy")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product.id)}
                    >
                      <Pencil size={16} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Pagination merged */}
      <div className="flex justify-end items-center mt-6 gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="mx-2 text-sm">
          Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </>
  );
}