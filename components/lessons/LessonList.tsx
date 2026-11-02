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

  const queryParams = {
    size: 10,
    keyword,
    professionalFields: professionals.map(professionals => professionals),
    provinceIds: provinceIds.map(id => Number(id)),
  }

  const {
    data: lessons,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery<ScrollApiResponse<LESSON, "lessons">>({
    ...queries.lessons.infiniteList(queryParams),
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

  const totalCount = lessons?.pages?.[0]?.totalCount ?? 0
  const isEmpty = !lessons?.pages?.[0]?.lessons?.length

  return (
    <section aria-label="레슨 목록" className="mt-6 md:mt-8">
      <div className="flex items-center justify-between border-b border-[#191F28] pb-3 text-sm text-[#4E5968]">
        <span>
          레슨 <strong className="text-[#191F28]">{totalCount}</strong>건
        </span>
        <span>최신순</span>
      </div>
      {isEmpty ? (
        <p className="py-16 text-center text-[15px] text-coolgray">
          조건에 맞는 레슨이 없어요. 필터를 바꿔 보세요.
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-6 md:grid-cols-4 md:gap-x-5 md:gap-y-8">
          {lessons?.pages?.map(page =>
            page?.lessons?.map((lesson, index) => (
              <LessonCard
                lesson={lesson}
                key={lesson.id}
                ref={ref}
                isLastPage={!(hasNextPage && index === page.lessons.length - 5)}
              />
            )),
          )}
        </ul>
      )}
    </section>
  )
}

export default LessonList
