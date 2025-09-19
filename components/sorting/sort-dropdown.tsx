"use client"

import type { ProductSort } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ArrowUpDown } from "lucide-react"

interface SortDropdownProps {
  currentSort: ProductSort
  onSortChange: (sort: ProductSort) => void
}

const sortOptions = [
  { field: "createdAt" as const, direction: "desc" as const, label: "Newest First" },
  { field: "createdAt" as const, direction: "asc" as const, label: "Oldest First" },
  { field: "price" as const, direction: "asc" as const, label: "Price: Low to High" },
  { field: "price" as const, direction: "desc" as const, label: "Price: High to Low" },
  { field: "name" as const, direction: "asc" as const, label: "Name: A to Z" },
  { field: "name" as const, direction: "desc" as const, label: "Name: Z to A" },
  { field: "rating" as const, direction: "desc" as const, label: "Highest Rated" },
  { field: "rating" as const, direction: "asc" as const, label: "Lowest Rated" },
]

export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const currentOption = sortOptions.find(
    (option) => option.field === currentSort.field && option.direction === currentSort.direction,
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">Sort by:</span>
          <span className="font-medium">{currentOption?.label || "Newest First"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={`${option.field}-${option.direction}`}
            onClick={() => onSortChange({ field: option.field, direction: option.direction })}
            className={
              currentSort.field === option.field && currentSort.direction === option.direction
                ? "bg-accent text-accent-foreground"
                : ""
            }
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
