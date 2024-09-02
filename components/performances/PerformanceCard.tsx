import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import FallbackImage from "../common/FallbackImage"
import { PERFORMANCE } from "@/types/performances"

interface Props {
  isLastPage: boolean
  performance: PERFORMANCE
}

const PerformanceCard = forwardRef<HTMLDivElement, Props>(
  ({ isLastPage, performance }, ref) => {
    const pathname = usePathname()

    // const province = lesson.area?.split(" ")[0].substring(0, 2)

    // const area = lesson.area?.split(" ")[1]

    return (
      <Link href={`${pathname}/${performance.id}`} prefetch={false}>
        <div className="relative aspect-[3/4]">
          <FallbackImage
            src="https://artinfo.s3.ap-northeast-2.amazonaws.com/prod/upload/1710/images/20240806/original/v8ofDoqEE16.1722905864785.png"
            alt={`test_lesson_image `}
            className="rounded-[10px]"
            fill
            quality={100}
            sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
          />
        </div>
        <div className="my-4 flex flex-col items-center gap-3">
          <h4 className="break-keep text-center text-xs font-bold md:text-base">
            제6회 알티밋 (Altimeets) 정기공연: Unity
          </h4>
          <span className="text-[10px] text-grey md:text-xs">
            2024.10.06 ~ 2024.10.06
          </span>
        </div>

        {!isLastPage && <div ref={ref} />}
      </Link>
    )
  },
)

PerformanceCard.displayName = "PerformanceCard"

export default PerformanceCard
