"use client"

import { Suspense } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQueries } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { toRegionOptions } from "@/lib/regions"
import { performanceCategoryArray } from "@/types/performances"
import { useSearchParamList } from "@/hooks/useSearchParamList"
import ListPageHeader from "@/components/common/ListPageHeader"
import CreateButton from "@/components/common/CreateButton"
import SearchBar from "@/components/common/SearchBar"
import FilterChips from "@/components/common/FilterChips"
import FilterDropdown from "@/components/common/FilterDropdown"
import ArrowUpButton from "@/components/common/ArrowUpButton"
import PerformanceList from "@/components/performances/PerformanceList"
import PerformanceListSkeleton from "@/components/skeleton/PerformanceListSkeleton"

const CATEGORY_OPTIONS = performanceCategoryArray.map(({ title, value }) => ({
  label: title,
  value,
}))

const page = () => {
  const router = useRouter()
  const pathname = usePathname()
  const provinceFilter = useSearchParamList("provinceId")
  const categoryFilter = useSearchParamList("category")

  const [provinceList, performanceCount] = useQueries({
    queries: [queries.provinces.list(), queries.performances.count()],
  })

  const totalCount = performanceCount?.data?.totalCount

  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-6 md:px-6 md:pt-12">
      <ListPageHeader
        title="공연"
        description={
          <>
            기대되는 공연
            {totalCount !== undefined && (
              <>
                {" "}
                <strong className="text-main">{totalCount}</strong>개
              </>
            )}
          </>
        }
        action={
          <CreateButton
            label="공연 등록"
            onClick={() => router.push(`${pathname}/create`)}
          />
        }
      />

      <div className="mt-5 md:mt-7">
        <SearchBar placeholder="공연 제목, 출연진으로 검색" />
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
            label="장르"
            options={CATEGORY_OPTIONS}
            selected={categoryFilter.values}
            onToggle={categoryFilter.toggle}
            onClear={categoryFilter.clear}
          />
        </div>
      </div>

      <Suspense fallback={<PerformanceListSkeleton />}>
        <PerformanceList />
      </Suspense>

      <ArrowUpButton
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="scroll-to-top-button"
      />
    </div>
  )
}

export default page
