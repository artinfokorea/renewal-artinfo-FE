import { ScrollApiResponse } from "@/interface"
import { queries } from "@/lib/queries"
import { NEWS } from "@/types/news"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import React, { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import NewsCard from "./NewsCard"
import FallbackImage from "../common/FallbackImage"

const NewsList = () => {
  const searchParams = useSearchParams()
  const keyword = searchParams.get("keyword") as string

  const [ref, inView] = useInView({
    delay: 100,
    threshold: 0.5,
  })

  const {
    data: newsList,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery<ScrollApiResponse<NEWS, "news">>({
    ...queries.news.infiniteList({
      size: 10,
      keyword,
    }),
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
    <div className="mt-4">
      <div className="flex flex-col gap-4 px-4 md:flex-row-reverse">
        <div className="relative aspect-[27/17] w-full md:basis-1/3">
          <FallbackImage
            src="https://artinfo.s3.ap-northeast-2.amazonaws.com/dev/upload/4637/images/20240705/original/oSXOf0NrDJY.1720108675235.png"
            alt="news_title"
            fill
            sizes="(max-width: 768px) 270px 170px, (max-width: 1200px) 200px, 200px"
            className="rounded-lg"
          />
        </div>
        <div className="flex w-full flex-col gap-4 break-keep md:mt-4 md:basis-2/3">
          <h3 className="line-clamp-2 text-xl tracking-wider md:text-2xl">
            조수미 국제 성악 콩쿠르 첫 대회... 테너 이기업 3위
          </h3>
          <span className="line-clamp-4 text-sm font-medium leading-7 text-coolgray md:text-base">
            프랑스 루아르에서 현지시각 12월에 열린 제1회 조수미 국제 성악
            콩쿠르에서 한국인 테너 31살 이기업 씨가 3위를 차지했습니다.
          </span>
          <span className="text-sm font-medium text-coolgray">2024.07.23</span>
        </div>
      </div>
      {newsList?.pages?.map(page =>
        page?.news?.map((news, index) => {
          return (
            <NewsCard
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
