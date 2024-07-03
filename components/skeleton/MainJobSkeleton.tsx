import React from "react"

const MainJobSkeleton = () => {
  return (
    // <section className="my-8 md:my-12">
    //   <div className="h-6 w-20 bg-gray-200 animate-pulse" />
    //   <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-4 mb-12 ">
    //     {Array.from({ length: 3 }, (_, index) => index).map(index => (
    //       <div
    //         key={index}
    //         className={`h-[100px] md:h-[185px] w-full skeleton-list-item ${
    //           index < 2 ? "block" : "hidden md:block"
    //         }`}
    //       />
    //     ))}
    //   </div>
    // </section>
    <section className="my-12 md:my-16">
      <div className="flex justify-between">
        <div className="w-20 h-7 bg-gray-200 rounded animate-pulse" />
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* 데스크톱 버전 */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-4 mb-12">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`skeleton-list-item ${
              index < 2 ? "block" : index < 3 ? "hidden md:block" : "hidden"
            }`}
          >
            <div className="aspect-[5/3] relative rounded-lg bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>

      {/* 모바일 버전 */}
      <div className="flex md:hidden overflow-x-auto mt-4 mb-12">
        <div className="flex space-x-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="skeleton-list-item"
              style={{ width: "150px" }}
            >
              <div className="aspect-[5/3] relative rounded-lg bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MainJobSkeleton
