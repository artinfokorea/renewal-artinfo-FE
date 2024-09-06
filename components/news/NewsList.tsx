import { ScrollApiResponse } from "@/interface"
import { queries } from "@/lib/queries"
import { NEWS } from "@/types/news"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import React, { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import NewsCard from "./NewsCard"

const NewsList = () => {
  const searchParams = useSearchParams()
  const keyword = searchParams.get("keyword") as string

  const queryParams = {
    size: 10,
    keyword,
  }

  const [ref, inView] = useInView({
    delay: 100,
    threshold: 0.5,
  })

  const {
    data: newsList,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery<ScrollApiResponse<NEWS, "news">>({
    ...queries.news.infiniteList(queryParams),
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
    <div className="flex flex-col gap-2 md:mt-4">
      {newsList?.pages?.map(page =>
        page?.news?.map((news, index) => {
          return (
            <NewsCard
              key={`${news.id}${keyword}`}
              ref={ref}
              news={news}
              isLastPage={!(hasNextPage && index === page.news.length - 5)}
            />
          )
        }),
      )}
    </div>
  )
}

export default NewsList
