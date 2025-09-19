// "use client"

// import type { ProductSort } from "@/lib/types"
// import { SortDropdown } from "./sorting/sort-dropdown"
// import { Button } from "@/components/ui/button"
// import { LayoutGrid, List } from "lucide-react"

// interface CatalogHeaderProps {
//   totalProducts: number
//   currentPage: number
//   totalPages: number
//   productsPerPage: number
//   currentSort: ProductSort
//   onSortChange: (sort: ProductSort) => void
//   viewMode?: "grid" | "list"
//   onViewModeChange?: (mode: "grid" | "list") => void
// }

// export function CatalogHeader({
//   totalProducts,
//   currentPage,
//   totalPages,
//   productsPerPage,
//   currentSort,
//   onSortChange,
//   viewMode = "grid",
//   onViewModeChange,
// }: CatalogHeaderProps) {
//   const startProduct = (currentPage - 1) * productsPerPage + 1
//   const endProduct = Math.min(currentPage * productsPerPage, totalProducts)

//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
//       {/* Results info */}
//       <div className="text-sm text-muted-foreground">
//         Showing {startProduct}-{endProduct} of {totalProducts} products
//       </div>

//       {/* Controls */}
//       <div className="flex items-center gap-3">
//         {/* View mode toggle */}
//         {onViewModeChange && (
//           <div className="hidden sm:flex items-center border border-border rounded-md">
//             <Button
//               variant={viewMode === "grid" ? "default" : "ghost"}
//               size="sm"
//               onClick={() => onViewModeChange("grid")}
//               className="rounded-r-none"
//             >
//               <LayoutGrid className="h-4 w-4" />
//             </Button>
//             <Button
//               variant={viewMode === "list" ? "default" : "ghost"}
//               size="sm"
//               onClick={() => onViewModeChange("list")}
//               className="rounded-l-none"
//             >
//               <List className="h-4 w-4" />
//             </Button>
//           </div>
//         )}

//         {/* Sort dropdown */}
//         <SortDropdown currentSort={currentSort} onSortChange={onSortChange} />
//       </div>
//     </div>
//   )
// }

"use client"

import type { ProductSort } from "@/lib/types"
import { SortDropdown } from "./sorting/sort-dropdown"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Filter } from "lucide-react"

interface CatalogHeaderProps {
  totalProducts: number
  currentPage: number
  totalPages: number
  productsPerPage: number
  currentSort: ProductSort
  onSortChange: (sort: ProductSort) => void
  viewMode?: "grid" | "list"
  onViewModeChange?: (mode: "grid" | "list") => void
  onMobileFilterToggle?: () => void // ✅ added
}

export function CatalogHeader({
  totalProducts,
  currentPage,
  totalPages,
  productsPerPage,
  currentSort,
  onSortChange,
  viewMode = "grid",
  onViewModeChange,
  onMobileFilterToggle,
}: CatalogHeaderProps) {
  const startProduct = (currentPage - 1) * productsPerPage + 1
  const endProduct = Math.min(currentPage * productsPerPage, totalProducts)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        Showing {startProduct}-{endProduct} of {totalProducts} products
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile filter button */}
        {onMobileFilterToggle && (
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden flex items-center gap-1"
            onClick={onMobileFilterToggle}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        )}

        {/* View mode toggle */}
        {onViewModeChange && (
          <div className="hidden sm:flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Sort dropdown */}
        <SortDropdown currentSort={currentSort} onSortChange={onSortChange} />
      </div>
    </div>
  )
}

