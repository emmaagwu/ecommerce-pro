"use client";
import { useEffect, useState, useCallback } from "react";
import ProductFilters from "@/components/admin/products/ProductFilters";
import ProductTable from "@/components/admin/products/ProductTable";

const PAGE_LIMIT = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [filtersMeta, setFiltersMeta] = useState<{ categories: string[], brands: string[] }>({ categories: [], brands: [] });
  const [loading, setLoading] = useState(true);

  // UI state for filters and pagination
  const [filters, setFilters] = useState<{ search?: string, category?: string, brand?: string }>({});
  const [page, setPage] = useState(1);

  // Fetch filter metadata
  useEffect(() => {
    fetch("/api/admin/filters")
      .then(res => res.json())
      .then(data => {
        setFiltersMeta({
          categories: data.categories || [],
          brands: data.brands || [],
        });
      });
  }, []);

  // Fetch products whenever page or filters change
  const fetchProducts = useCallback(() => {
    setLoading(true);

    const searchParams = new URLSearchParams();
    searchParams.set("page", String(page));
    searchParams.set("limit", String(PAGE_LIMIT));
    if (filters.category) searchParams.set("category", filters.category);
    if (filters.brand) searchParams.set("brands", filters.brand);
    if (filters.search) searchParams.set("search", filters.search);

    fetch(`/api/products?${searchParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page, filters]);

  // refetch products on filter/page change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // When filters change, reset to first page and refetch
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // For ProductTable refresh after delete
  const handleRefresh = () => fetchProducts();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ProductFilters
        categories={filtersMeta.categories}
        brands={filtersMeta.brands}
        onChange={handleFilterChange}
        initial={filters}
      />
      <div className="bg-white rounded-lg shadow p-4">
        <ProductTable
          products={products}
          loading={loading}
          page={page}
          limit={PAGE_LIMIT}
          total={total}
          onPageChange={setPage}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}