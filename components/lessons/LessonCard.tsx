import { LESSON } from "@/types/lessons"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import FallbackImage from "../common/FallbackImage"

interface Props {
  lesson: LESSON
  isLastPage: boolean
}

const LessonCard = forwardRef<HTMLDivElement, Props>(
  ({ lesson, isLastPage }, ref) => {
    const pathname = usePathname()

    const province = lesson.area?.split(" ")[0].substring(0, 2)

    const area = lesson.area?.split(" ")[1]

    return (
      <Link href={`${pathname}/${lesson.id}`}>
        {lesson.imageUrl && (
          <div className="relative aspect-[20/27]">
            <FallbackImage
              src={lesson.imageUrl}
              alt={`${lesson.name}_lesson_image `}
              className="rounded rounded-bl-3xl"
              fill
              quality={100}
              sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
            />
            <div className="absolute bottom-3 right-3 z-30 text-sm font-semibold text-white md:text-base">
              <p className="text-right">{lesson.name}</p>
              <div className="flex justify-end gap-4">
                <span>{lesson.major}</span>
                <span>
                  {province} {area}
                </span>
              </div>
            </div>
          </div>
        )}

        {!isLastPage && <div ref={ref} />}
      </Link>
    )
  },
)

LessonCard.displayName = "LessonCard"

export default LessonCard
