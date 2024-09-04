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

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-8">
      {performances?.pages?.map(page =>
        page?.performances?.map((performance, index) => (
          <PerformanceCard
            key={index}
            isLastPage={
              !(hasNextPage && index === page.performances.length - 5)
            }
            performance={performance}
            ref={ref}
          />
        )),
      )}
    </div>
  )
}

export default PerformanceList
