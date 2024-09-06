import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import FallbackImage from "../common/FallbackImage"
import { PERFORMANCE } from "@/types/performances"
import filters from "@/lib/filters"

interface Props {
  isLastPage: boolean
  performance: PERFORMANCE
}

const PerformanceCard = forwardRef<HTMLDivElement, Props>(
  ({ isLastPage, performance }, ref) => {
    const pathname = usePathname()

    const filter = filters()

    return (
      <Link href={`${pathname}/${performance.id}`} prefetch={false}>
        <div className="relative aspect-[3/4]">
          <FallbackImage
            src={performance.posterImageUrl}
            fallbackSrc="/img/metadata_image.png"
            alt="performance_image"
            className="rounded-[10px]"
            fill
            quality={100}
            sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
          />
        </div>
        <div className="my-4 flex flex-col items-center gap-3">
          <h4 className="break-keep text-center text-xs font-bold md:text-base">
            {performance.title}
          </h4>
          <span className="text-[10px] text-grey md:text-xs">
            {`${filter.YYYYMMDD(performance.startAt)} ~ ${filter.YYYYMMDD(performance.endAt)}`}
          </span>
        </div>

        {!isLastPage && <div className="h-6 bg-yellow-100" ref={ref} />}
      </Link>
    )
  },
)

PerformanceCard.displayName = "PerformanceCard"

export default PerformanceCard
