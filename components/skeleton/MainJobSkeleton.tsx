import React from "react"

const MainJobSkeleton = () => {
  return (
    <section className="my-12 md:my-16">
      <div className="flex justify-between">
        <div className="w-20 h-7 bg-gray-200 rounded animate-pulse" />
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-4 mb-12">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={` ${
              index < 2 ? "block" : index < 3 ? "hidden md:block" : "hidden"
            }`}
          >
            <div className="aspect-[5/3] relative rounded-lg bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="flex md:hidden overflow-x-auto mt-4 mb-12">
        <div className="flex space-x-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} style={{ width: "150px" }}>
              <div className="aspect-[5/3] relative rounded-lg bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MainJobSkeleton
