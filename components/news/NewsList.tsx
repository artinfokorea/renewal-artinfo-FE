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

  const isEmpty = !newsList?.pages?.[0]?.news?.length

  return (
    <section aria-label="뉴스 목록" className="mt-4 md:mt-6">
      {isEmpty ? (
        <p className="py-16 text-center text-[15px] text-coolgray">
          검색 결과가 없어요.
        </p>
      ) : (
        <ul>
          {newsList?.pages?.map(page =>
            page?.news?.map((news, index) => (
              <NewsCard
                key={news.id}
                ref={ref}
                news={news}
                isLastPage={!(hasNextPage && index === page.news.length - 5)}
              />
            )),
          )}
        </ul>
      )}
    </section>
  )
}

export default NewsList
