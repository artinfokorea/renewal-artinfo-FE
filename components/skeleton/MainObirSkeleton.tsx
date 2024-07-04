import React from "react"

const MainObirSkeleton = () => {
  return (
    <section className="my-8 md:my-12">
      <div className="h-6 w-20 animate-pulse bg-gray-200" />
      <div className="mb-12 mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6">
        {Array.from({ length: 3 }, (_, index) => index).map(index => (
          <div key={index} className={`skeleton-list-item h-[66px] w-full`} />
        ))}
      </div>
    </section>
  )
}

export default MainObirSkeleton
