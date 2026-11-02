import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import { LESSON } from "@/types/lessons"
import FallbackImage from "../common/FallbackImage"

interface Props {
  lesson: LESSON
  isLastPage: boolean
}

/** 레슨 카드 — 기존 세로 사진 비율(20:27) 유지, 이름·전공·지역은 사진 아래로 */
const LessonCard = forwardRef<HTMLDivElement, Props>(
  ({ lesson, isLastPage }, ref) => {
    const pathname = usePathname()
    const province = lesson.area?.split(" ")[0].substring(0, 2)
    const area = lesson.area?.split(" ")[1]
    const location = [province, area].filter(Boolean).join(" ")

    return (
      <li>
        <Link
          href={`${pathname}/${lesson.id}`}
          prefetch={false}
          className="group flex flex-col gap-2.5"
        >
          <div className="relative aspect-[20/27] overflow-hidden rounded-xl border border-[#EEF0F3] bg-[#F7F8FA]">
            <FallbackImage
              src={lesson.imageUrl}
              alt={`${lesson.name} 프로필 사진`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 50vw, 240px"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="truncate text-[15px] font-bold text-[#191F28] group-hover:text-main md:text-base">
              {lesson.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {lesson.major && (
                <span className="inline-flex h-6 items-center rounded-md bg-[#E8F3FF] px-2 text-xs font-medium text-[#1B64DA]">
                  {lesson.major}
                </span>
              )}
              {location && (
                <span className="truncate text-[13px] text-[#6B7684]">
                  {location}
                </span>
              )}
            </div>
          </div>
        </Link>
        {!isLastPage && <div ref={ref} />}
      </li>
    )
  },
)

LessonCard.displayName = "LessonCard"

export default LessonCard
