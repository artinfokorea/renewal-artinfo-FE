import React, { useEffect } from "react"
import PerformanceCard from "./PerformanceCard"
import { useSearchParams } from "next/navigation"
import { useInView } from "react-intersection-observer"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { ScrollApiResponse } from "@/interface"
import { PERFORMANCE, PerformanceCategory } from "@/types/performances"
import { queries } from "@/lib/queries"

const PerformanceList = () => {
  const searchParams = useSearchParams()
  const keyword = searchParams.get("keyword") as string
  const provinceIds = searchParams.getAll("provinceId") as string[]
  const categories = searchParams.getAll("category") as PerformanceCategory[]

  const queryParams = {
    size: 10,
    keyword,
    categories: categories ? categories : [],
    provinceIds: provinceIds.map(id => Number(id)),
  }

  const [ref, inView] = useInView({
    delay: 100,
    threshold: 0.5,
  })

  const {
    data: performances,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery<ScrollApiResponse<PERFORMANCE, "performances">>({
    ...queries.performances.infiniteList(queryParams),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (!lastPage.isLast) return lastPage.nextPage
      return null
    },
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  const totalCount = performances?.pages?.[0]?.totalCount ?? 0
  const isEmpty = !performances?.pages?.[0]?.performances?.length

  return (
    <section aria-label="공연 목록" className="mt-6 md:mt-8">
      <div className="flex items-center justify-between border-b border-[#191F28] pb-3 text-sm text-[#4E5968]">
        <span>
          공연 <strong className="text-[#191F28]">{totalCount}</strong>건
        </span>
        <span>최신순</span>
      </div>
      {isEmpty ? (
        <p className="py-16 text-center text-[15px] text-coolgray">
          조건에 맞는 공연이 없어요. 필터를 바꿔 보세요.
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-6 md:grid-cols-4 md:gap-x-5 md:gap-y-8">
          {performances?.pages?.map(page =>
            page?.performances?.map((performance, index) => (
              <PerformanceCard
                key={performance.id}
                isLastPage={
                  !(hasNextPage && index == page.performances.length - 5)
                }
                performance={performance}
                ref={ref}
              />
            )),
          )}
        </ul>
      )}
    </section>
  )
}

export default PerformanceList
