import React from "react"
import { AspectRatio } from "../ui/aspect-ratio"

const MainJobSkeleton = () => {
  return (
    <section className="my-12 md:my-16">
      <div className="flex items-center justify-between">
        <div className="h-7 w-12 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-11 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="mb-12 mt-4 hidden grid-cols-2 gap-4 md:grid md:grid-cols-3 md:gap-8">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={` ${
              index < 2 ? "block" : index < 3 ? "hidden md:block" : "hidden"
            }`}
          >
            <div className="relative aspect-[5/3] animate-pulse rounded-lg bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="mb-12 mt-4 flex overflow-x-auto md:hidden">
        <div className="flex space-x-[10px]">
          {[...Array(5)].map((_, index) => (
            <div key={index} style={{ width: "150px" }}>
              <div className="relative aspect-[5/3] animate-pulse rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MainJobSkeleton
