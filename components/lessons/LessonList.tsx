import React, { useEffect } from "react"
import LessonCard from "./LessonCard"
import { useSearchParams } from "next/navigation"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { ScrollApiResponse } from "@/interface"
import { useInView } from "react-intersection-observer"
import { LESSON } from "@/types/lessons"
import { queries } from "@/lib/queries"
import { ProfessionalFieldTypes } from "@/types/majors"

const LessonList = () => {
  const searchParams = useSearchParams()
  const professionals = searchParams.getAll(
    "professional",
  ) as ProfessionalFieldTypes[]
  const keyword = searchParams.get("keyword") as string
  const provinceIds = searchParams.getAll("provinceId") as string[]

  const {
    data: lessons,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery<ScrollApiResponse<LESSON, "lessons">>({
    ...queries.lessons.infiniteList({
      size: 10,
      keyword,
      professionalFields: professionals.map(professionals => professionals),
      provinceIds: provinceIds.map(id => Number(id)),
    }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (!lastPage.isLast) return lastPage.nextPage
      return null
    },
  })

  const [ref, inView] = useInView({
    delay: 100,
    threshold: 0.5,
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-8">
      {lessons?.pages?.map(page =>
        page?.lessons?.map((lesson, index) => {
          return (
            <LessonCard
              lesson={lesson}
              key={lesson.id}
              ref={ref}
              isLastPage={!(hasNextPage && index === page.lessons.length - 5)}
            />
          )
        }),
      )}
    </div>
  )
}

export default LessonList
