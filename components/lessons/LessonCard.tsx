import { LESSON } from "@/types/lessons"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import { AspectRatio } from "../ui/aspect-ratio"

interface Props {
  lesson: LESSON
  isLastPage: boolean
}

const LessonCard = forwardRef<HTMLDivElement, Props>(
  ({ lesson, isLastPage }, ref) => {
    const pathname = usePathname()

    return (
      <Link href={`${pathname}/${lesson.id}`}>
        {lesson.imageUrl && (
          <div className="relative h-[240px] md:h-[300px]">
            <Image
              src={lesson.imageUrl}
              alt="job_imgge"
              className="rounded rounded-bl-3xl"
              fill
              quality={100}
              priority
              sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
            />
            <div className="absolute bottom-3 right-3 text-white font-semibold z-30 text-sm md:text-base">
              <p className="text-right">{lesson.name}</p>
              <div className="flex gap-4 justify-end">
                <span>{lesson.major}</span>
                <span>{lesson.area}</span>
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