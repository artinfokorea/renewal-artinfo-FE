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

  const totalCount = newsList?.pages?.[0]?.totalCount ?? 0
  const isEmpty = !newsList?.pages?.[0]?.news?.length

  return (
    <section aria-label="뉴스 목록" className="mt-6 md:mt-8">
      <div className="flex items-center justify-between border-b border-[#191F28] pb-3 text-sm text-[#4E5968]">
        <span>
          뉴스 <strong className="text-[#191F28]">{totalCount}</strong>건
        </span>
        <span>최신순</span>
      </div>
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
