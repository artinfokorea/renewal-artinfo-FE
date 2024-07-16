import filters from "@/lib/filters"
import { NEWS } from "@/types/news"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import FallbackImage from "../common/FallbackImage"
interface Props {
  news: NEWS
  isLastPage: boolean
}

const NewsCard = forwardRef<HTMLDivElement, Props>(
  ({ news, isLastPage }, ref) => {
    const pathname = usePathname()
    const filter = filters()

    return (
      <Link href={`${pathname}/${news.id}`}>
        <div className="flex flex-col gap-4 rounded-md p-4 md:mx-4 md:flex-row-reverse md:hover:bg-whitesmoke">
          <div className="relative aspect-[27/17] w-full md:basis-1/3">
            <FallbackImage
              src={news.thumbnailImageUrl}
              alt="news_title"
              fill
              sizes="(max-width: 768px) 270px 170px, (max-width: 1200px) 200px, 200px"
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-4 break-keep md:mt-4 md:basis-2/3">
            <h3 className="line-clamp-2 text-xl tracking-wider md:text-2xl">
              {news.title}
            </h3>
            <span className="line-clamp-4 text-sm font-medium leading-7 text-coolgray md:text-base">
              {news.summary}
            </span>
            <span className="text-sm font-medium text-coolgray md:mt-auto md:text-base">
              {filter.YYYYMMDD(news.createdAt)}
            </span>
          </div>
        </div>
        {!isLastPage && <div ref={ref} />}
      </Link>
    )
  },
)

NewsCard.displayName = "NewsCard"

export default NewsCard
