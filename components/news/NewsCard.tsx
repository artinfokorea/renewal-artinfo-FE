import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import { NEWS } from "@/types/news"
import filters from "@/lib/filters"
import FallbackImage from "../common/FallbackImage"

interface Props {
  news: NEWS
  isLastPage: boolean
}

/** 뉴스 목록 한 줄 — 왼쪽 썸네일(기존 27:17 비율) + 제목·요약·날짜 */
const NewsCard = forwardRef<HTMLDivElement, Props>(
  ({ news, isLastPage }, ref) => {
    const pathname = usePathname()
    const filter = filters()

    return (
      <li className="border-t border-[#F2F4F6] first:border-t-0">
        <Link
          href={`${pathname}/${news.id}`}
          prefetch={false}
          className="group flex gap-3.5 py-4 md:items-center md:gap-6 md:px-2 md:py-5"
        >
          <div className="relative aspect-[27/17] w-[120px] shrink-0 overflow-hidden rounded-[10px] border border-[#EEF0F3] bg-[#F7F8FA] md:w-[200px] md:rounded-xl">
            <FallbackImage
              src={news.thumbnailImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 120px, 200px"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2">
            <h3 className="line-clamp-2 break-keep text-[15px] font-bold leading-snug text-[#191F28] group-hover:text-main md:text-lg">
              {news.title}
            </h3>
            <p className="hidden break-keep text-sm leading-relaxed text-[#6B7684] md:line-clamp-2">
              {news.summary}
            </p>
            <span className="text-[13px] text-[#8B95A1] md:text-sm">
              {filter.YYYYMMDD(news.createdAt)}
            </span>
          </div>
        </Link>
        {!isLastPage && <div ref={ref} />}
      </li>
    )
  },
)

NewsCard.displayName = "NewsCard"

export default NewsCard
