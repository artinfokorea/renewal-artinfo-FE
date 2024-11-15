import React from "react"

const PartTimeListSkeleton = () => {
  return (
    <div className="mt-4 grid max-w-full grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 10 }, (_, index) => (
        <div
          key={index}
          className="relative mx-4 h-40 rounded border border-whitesmoke p-4 md:h-[145px]"
        >
          <div className="mb-3 h-7 w-3/4 animate-pulse rounded bg-gray-200" />

          <div className="my-3 flex gap-2">
            <div className="h-6 w-16 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-6 w-20 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-6 w-24 animate-pulse rounded-xl bg-gray-200" />
          </div>

          <div className="my-3 flex flex-col gap-1 md:flex-row md:justify-between">
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default PartTimeListSkeleton
