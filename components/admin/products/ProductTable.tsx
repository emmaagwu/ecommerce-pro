"use client";

import { useProducts, deleteProduct } from "@/hooks/use-products";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductTableProps {
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
  onRefresh?: () => void;
  filters?: Record<string, any>;
  search?: string;
}

export default function ProductTable({
  page,
  limit,
  onPageChange,
  onRefresh,
  filters,
  search,
}: ProductTableProps) {
  const router = useRouter();
  const {
    products,
    loading,
    totalProducts,
    totalPages,
    updatePage,
    refetch,
  } = useProducts({
    initialPage: page,
    limit,
    initialFilters: filters,
    search: search || "",
  });

  useEffect(() => {
    updatePage(page);
    // eslint-disable-next-line
  }, [page]);

  // Confirmation dialog for accidental delete
  const handleDelete = async (productId: string, productName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${productName}"?\nThis action cannot be undone.`
      )
    )
      return;
    try {
      await deleteProduct(productId);
      refetch();
      if (onRefresh) onRefresh();
      else router.refresh();
    } catch (err: any) {
      alert(err?.message || "Failed to delete product. Please try again.");
    }
  };

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  // Detect screen size for responsive rendering
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile: Card list view
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-gray-400 animate-pulse text-center py-8">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">No products found.</div>
        ) : (
          products.map(product => (
            <div key={product.id} className="flex gap-4 items-center p-3 border-b last:border-b-0">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={56}
                  height={56}
                  className="rounded object-cover bg-gray-100"
                />
              ) : (
                <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded text-xs text-gray-400">N/A</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{product.name}</div>
                <div className="text-green-700 font-semibold text-sm">${product.price.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{product.brand}</div>
                <div className="text-xs text-gray-400">
                  {product.category}
                  {product.subcategory ? ` / ${product.subcategory}` : ""}
                </div>
                <div className="text-xs text-gray-400">{format(new Date(product.createdAt), "d MMM yyyy")}</div>
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product.id)}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id, product.name)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        )}
        <MobilePagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    );
  }

  // Desktop/tablet: Table
  return (
    <>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 bg-white z-10">
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
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded border"
                        width={56}
                        height={56}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded border text-gray-400 text-xs">
                        N/A
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
                        onClick={() => handleDelete(product.id, product.name)}
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
      </div>
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

function MobilePagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="mx-2 text-sm">
        <span className="font-bold">{page}</span> / <span className="font-bold">{totalPages}</span>
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
  );
}