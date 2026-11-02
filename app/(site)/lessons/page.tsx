"use client"

import { Suspense } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQueries } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { toRegionOptions } from "@/lib/regions"
import ListPageHeader from "@/components/common/ListPageHeader"
import ListToolbar from "@/components/common/ListToolbar"
import CreateButton from "@/components/common/CreateButton"
import ArrowUpButton from "@/components/common/ArrowUpButton"
import LessonList from "@/components/lessons/LessonList"
import LessonListSkeleton from "@/components/skeleton/LessonListSkeleton"

const page = () => {
  const router = useRouter()
  const pathname = usePathname()

  const [lessonFields, provinceList] = useQueries({
    queries: [
      queries.lessons.fields(),
      queries.provinces.list(),
    ],
  })

  const fieldOptions =
    lessonFields?.data?.majorGroups?.map(({ nameKo, nameEn }) => ({
      label: nameKo,
      value: nameEn,
    })) ?? []


  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-6 md:px-6 md:pt-14">
      <ListPageHeader
        title="레슨"
        action={
          <CreateButton
            label="레슨 등록"
            onClick={() => router.push(`${pathname}/create`)}
          />
        }
      />

      <ListToolbar
        searchPlaceholder="이름, 전공, 지역 검색"
        groups={[
          {
            param: "provinceId",
            name: "지역",
            options: toRegionOptions(provinceList?.data?.provinces),
          },
          { param: "professional", name: "분야", options: fieldOptions },
        ]}
      />

      <Suspense fallback={<LessonListSkeleton />}>
        <LessonList />
      </Suspense>

      <ArrowUpButton
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="scroll-to-top-button"
      />
    </div>
  )
}

export default page
