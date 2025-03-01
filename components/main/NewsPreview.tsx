import React from "react"
import NewsPaperIcon from "../icons/NewsPaperIcon"
import Link from "next/link"
import { Separator } from "../ui/separator"
import { useSuspenseQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import filters from "@/lib/filters"

export const NewsPreview = () => {
  const { data: news } = useSuspenseQuery({
    ...queries.news.list({
      page: 1,
      size: 5,
    }),
  })

  const filter = filters()

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <NewsPaperIcon className="h-5 w-5" />
          뉴스
        </h3>
        <Link href="/news">
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>
      <Separator className="mb-4 mt-2 h-[1px] bg-gray-200" />
      <div className="flex flex-col gap-6">
        {news.news.map(news => (
          <Link key={news.id} href={`/news/${news.id}`}>
            <div className="flex items-center justify-between gap-4">
              <h4 className="line-clamp-1 text-sm font-semibold md:text-base">
                {news.title}
              </h4>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="min-w-8 whitespace-nowrap text-right text-sm">
                  {filter.YYYYMMDD(news.createdAt, "MM.DD (ddd)")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
