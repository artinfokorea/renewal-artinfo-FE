"use client"

import { Suspense } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQueries } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { toRegionOptions } from "@/lib/regions"
import { useSearchParamList } from "@/hooks/useSearchParamList"
import ListPageHeader from "@/components/common/ListPageHeader"
import CreateButton from "@/components/common/CreateButton"
import SearchBar from "@/components/common/SearchBar"
import FilterChips from "@/components/common/FilterChips"
import FilterDropdown from "@/components/common/FilterDropdown"
import ArrowUpButton from "@/components/common/ArrowUpButton"
import LessonList from "@/components/lessons/LessonList"
import LessonListSkeleton from "@/components/skeleton/LessonListSkeleton"

const page = () => {
  const router = useRouter()
  const pathname = usePathname()
  const provinceFilter = useSearchParamList("provinceId")
  const professionalFilter = useSearchParamList("professional")

  const [lessonFields, provinceList, lessonsCount] = useQueries({
    queries: [
      queries.lessons.fields(),
      queries.provinces.list(),
      queries.lessons.count(),
    ],
  })

  const fieldOptions =
    lessonFields?.data?.majorGroups?.map(({ nameKo, nameEn }) => ({
      label: nameKo,
      value: nameEn,
    })) ?? []

  const totalCount = lessonsCount?.data?.totalCount

  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-6 md:px-6 md:pt-12">
      <ListPageHeader
        title="레슨"
        description={
          totalCount !== undefined ? (
            <>
              <strong className="text-main">{totalCount}</strong>명의 전문가가
              레슨을 준비하고 있어요
            </>
          ) : (
            "전문가에게 레슨을 받아보세요"
          )
        }
        action={
          <CreateButton
            label="레슨 등록"
            onClick={() => router.push(`${pathname}/create`)}
          />
        }
      />

      <div className="mt-5 md:mt-7">
        <SearchBar placeholder="이름, 전공, 지역으로 검색" />
      </div>

      <div className="mt-4 flex flex-col gap-3 md:mt-5 md:flex-row md:items-start md:justify-between">
        <FilterChips
          label="지역 필터"
          options={toRegionOptions(provinceList?.data?.provinces)}
          selected={provinceFilter.values}
          onToggle={provinceFilter.toggle}
          onClear={provinceFilter.clear}
        />
        <div className="flex shrink-0 gap-2">
          <FilterDropdown
            label="분야"
            options={fieldOptions}
            selected={professionalFilter.values}
            onToggle={professionalFilter.toggle}
            onClear={professionalFilter.clear}
          />
        </div>
      </div>

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
