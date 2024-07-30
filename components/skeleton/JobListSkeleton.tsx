import React from "react"

const JobListSkeleton = () => {
  return (
    <div className="mt-4">
      {Array.from({ length: 10 }, (_, index) => index).map(index => (
        <div
          key={index}
          className="mx-4 flex h-[130px] rounded-xl md:h-[192px] md:px-4"
        >
          <div className="my-4 h-[100px] w-[170px] animate-pulse rounded-lg bg-gray-200 md:my-auto md:h-[140px] md:w-[230px]" />
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
