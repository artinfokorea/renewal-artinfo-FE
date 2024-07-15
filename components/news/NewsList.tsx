import { ScrollApiResponse } from "@/interface"
import { queries } from "@/lib/queries"
import { NEWS } from "@/types/news"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import React, { useEffect } from "react"
import { useInView } from "react-intersection-observer"

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

  return <div>hihi</div>
}

export default NewsList
