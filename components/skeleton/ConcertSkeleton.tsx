import React from "react"

const ConcertSkeleton = () => {
  return (
    <>
      <section className="hidden md:grid gap-8 my-12 md:my-16 lg:gap-8 grid-cols-2 md:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`${
              index < 2 ? "block" : index < 4 ? "hidden md:block" : "hidden"
            }`}
          >
            <div className="aspect-[2/3] relative rounded-md bg-gray-200 animate-pulse" />
          </div>
        ))}
      </section>
      <section className="my-12 md:my-16  flex md:hidden overflow-x-auto">
        <div className="flex space-x-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} style={{ width: "200px" }}>
              <div className="aspect-[2/3] relative rounded-md bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default ConcertSkeleton
