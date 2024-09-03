import React from "react"

const PerformanceListSkeleton = () => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-8">
      {Array.from({ length: 10 }, (_, index) => index).map(index => (
        <div key={index}>
          <div className="aspect-[3/4] animate-pulse rounded-[10px] bg-gray-200" />
          <div className="my-4 flex flex-col items-center gap-3">
            <p className="h-12 w-28 animate-pulse rounded bg-gray-200"></p>
            <p className="h-4 w-40 animate-pulse bg-gray-200"> </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PerformanceListSkeleton
