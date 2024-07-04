import React from "react"

const JobListSkeleton = () => {
  return (
    <div className="mt-4">
      {Array.from({ length: 10 }, (_, index) => index).map(index => (
        <div
          key={index}
          className="my-4 flex h-[114px] rounded-xl py-4 md:h-[174px]"
        >
          <div className="w-[120px] animate-pulse rounded-lg bg-gray-200 md:w-[230px]" />
          <div className="ml-4 flex flex-1 flex-col justify-center py-2 md:ml-12">
            <div className="mb-2 h-5 w-40 animate-pulse bg-gray-200" />
            <div className="mb-2 h-5 w-24 animate-pulse bg-gray-200" />
            <div className="mb-2 h-5 w-28 animate-pulse bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default JobListSkeleton
