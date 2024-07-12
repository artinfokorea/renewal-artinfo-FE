import React from "react"

const ArtSkeleton = () => {
  return (
    <section className="my-12 md:my-16">
      <div className="mb-4 h-7 w-20 animate-pulse rounded bg-gray-200" />

      <div className="hidden grid-cols-2 gap-8 md:grid md:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`${
              index < 2 ? "block" : index < 4 ? "hidden md:block" : "hidden"
            }`}
          >
            <div className="relative aspect-[2/3] animate-pulse rounded-md bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="flex overflow-x-auto md:hidden">
        <div className="flex space-x-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} style={{ width: "200px" }}>
              <div className="relative aspect-[2/3] animate-pulse rounded-md bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ArtSkeleton
