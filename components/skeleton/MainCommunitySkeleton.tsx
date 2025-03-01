import { Separator } from "@/components/ui/separator"
import React from "react"

const MainCommunitySkeleton = () => {
  return (
    <section className="gird-cols-1 my-12 grid gap-8 md:my-16 md:grid-cols-2 md:gap-12">
      {/* 나눔 섹션 */}
      <div>
        <div className="flex items-center justify-between">
          <div className="h-7 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-14 animate-pulse rounded bg-gray-200" />
        </div>
        <Separator className="mb-4 mt-2 h-[1px] bg-gray-200" />
        <div className="flex flex-col gap-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* 뉴스 섹션 */}
      <div>
        <div className="flex items-center justify-between">
          <div className="h-7 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-14 animate-pulse rounded bg-gray-200" />
        </div>
        <Separator className="mb-4 mt-2 h-[1px] bg-gray-200" />
        <div className="flex flex-col gap-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MainCommunitySkeleton
