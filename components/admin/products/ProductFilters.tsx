"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ALL_VALUE = "__all__";

export default function ProductFilters({
  categories,
  brands,
  onChange,
  initial = {},
}: {
  categories: string[],
  brands: string[],
  onChange: (filters: { search?: string, category?: string, brand?: string }) => void,
  initial?: { search?: string, category?: string, brand?: string },
}) {
  // Always default to ALL_VALUE, never ""
  const [search, setSearch] = useState(initial.search || "");
  const [category, setCategory] = useState(initial.category || ALL_VALUE);
  const [brand, setBrand] = useState(initial.brand || ALL_VALUE);

  useEffect(() => {
    setSearch(initial.search || "");
    setCategory(initial.category || ALL_VALUE);
    setBrand(initial.brand || ALL_VALUE);
  }, [initial]);

  const handleApply = () => {
    onChange({
      search,
      category: category === ALL_VALUE ? undefined : category,
      brand: brand === ALL_VALUE ? undefined : brand,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-end">
      <div className="flex-grow min-w-[180px]">
        <label className="block text-sm font-medium mb-1">Search</label>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
        />
      </div>
      <div className="min-w-[150px]">
        <label className="block text-sm font-medium mb-1">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <span>
              {category === ALL_VALUE ? "All" : category}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[150px]">
        <label className="block text-sm font-medium mb-1">Brand</label>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger>
            <span>
              {brand === ALL_VALUE ? "All" : brand}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All</SelectItem>
            {brands.map(b => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleApply} className="h-10">Apply</Button>
    </div>
  );
}