import React from "react"

const PostListSkeleton = () => {
  return (
    <div className="mt-4 grid grid-cols-1 px-4 md:grid-cols-2">
      {Array.from({ length: 6 }, (_, index) => index).map(index => (
        <div
          key={index}
          className={`border-b border-gray-200 px-4 py-3 md:h-[210px] md:py-6 ${
            index % 2 === 0 ? "md:border-r" : ""
          }`}
        >
          <p className="h-3 w-16 animate-pulse rounded bg-gray-200 md:h-4" />
          <p className="mt-1 h-5 w-52 animate-pulse rounded bg-gray-200 md:mt-6 md:h-6" />
          <p className="mt-2 hidden h-4 w-80 animate-pulse rounded bg-gray-200 md:mt-5 md:block md:h-5" />
          <p className="mt-2 hidden h-[10px] w-20 animate-pulse rounded bg-gray-200 md:mt-5 md:block md:h-5" />
          <p className="mt-1 h-4 w-32 animate-pulse rounded bg-gray-200 md:h-5" />
        </div>
      ))}
    </div>
  )
}

export default PostListSkeleton
