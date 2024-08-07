import React from "react"

const NewsSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 md:mt-4">
      {Array.from({ length: 5 }, (_, index) => index).map(index => (
        <div
          key={index}
          className="h-100 flex flex-col gap-8 rounded-md p-4 md:mx-4 md:h-[224px] md:flex-row-reverse"
        >
          <div className="aspect-[27/17] w-full animate-pulse rounded-md bg-gray-200 md:basis-1/3" />
          <div className="flex flex-col gap-4 break-keep md:mt-2 md:basis-2/3">
            <div className="h-10 animate-pulse rounded bg-gray-200" />
            <div className="h-32 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default NewsSkeleton
