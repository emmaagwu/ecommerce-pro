import React from "react"

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse px-4 pt-6 pb-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image skeleton */}
      <div className="w-full h-80 md:h-[480px] bg-gray-200 rounded-lg" />
      {/* Details skeleton */}
      <div className="flex flex-col gap-6">
        <div className="h-8 w-3/4 bg-gray-200 rounded" />
        <div className="h-6 w-1/2 bg-gray-200 rounded" />
        <div className="h-10 w-full bg-gray-200 rounded" />
        <div className="h-40 w-full bg-gray-100 rounded" />
        <div className="flex gap-4 mt-6">
          <div className="h-12 w-32 bg-gray-200 rounded" />
          <div className="h-12 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}