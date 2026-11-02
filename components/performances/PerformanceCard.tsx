import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import { PERFORMANCE } from "@/types/performances"
import filters from "@/lib/filters"
import FallbackImage from "../common/FallbackImage"

interface Props {
  isLastPage: boolean
  performance: PERFORMANCE
}

/** 공연 포스터 카드 — 기존 3:4 포스터 비율 유지, 제목·기간은 왼쪽 정렬 */
const PerformanceCard = forwardRef<HTMLDivElement, Props>(
  ({ isLastPage, performance }, ref) => {
    const pathname = usePathname()
    const filter = filters()

    return (
      <li>
        <Link
          href={`${pathname}/${performance.id}`}
          prefetch={false}
          className="group flex flex-col gap-2.5"
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#EEF0F3] bg-[#F7F8FA]">
            <FallbackImage
              src={performance.posterImageUrl}
              fallbackSrc="/img/metadata_image.png"
              alt={`${performance.title} 포스터`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 50vw, 240px"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="line-clamp-2 break-keep text-[15px] font-bold leading-snug text-[#191F28] group-hover:text-main md:text-base">
              {performance.title}
            </h3>
            <span className="text-[13px] text-[#6B7684]">
              {`${filter.YYYYMMDD(performance.startAt)} ~ ${filter.YYYYMMDD(performance.endAt)}`}
            </span>
          </div>
        </Link>
        {!isLastPage && <div ref={ref} />}
      </li>
    )
  },
)

PerformanceCard.displayName = "PerformanceCard"

export default PerformanceCard
