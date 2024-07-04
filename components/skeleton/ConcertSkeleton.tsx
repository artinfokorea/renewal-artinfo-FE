import React from "react"

const ConcertSkeleton = () => {
  return (
    <>
      <section className="my-12 hidden grid-cols-2 gap-8 md:my-16 md:grid md:grid-cols-4 lg:gap-8">
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
      </section>
      <section className="my-12 flex overflow-x-auto md:my-16 md:hidden">
        <div className="flex space-x-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} style={{ width: "200px" }}>
              <div className="relative aspect-[2/3] animate-pulse rounded-md bg-gray-200" />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default ConcertSkeleton
