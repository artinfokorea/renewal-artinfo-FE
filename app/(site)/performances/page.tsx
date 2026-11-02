"use client"

import { Suspense } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQueries } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { toRegionOptions } from "@/lib/regions"
import { performanceCategoryArray } from "@/types/performances"
import ListPageHeader from "@/components/common/ListPageHeader"
import ListToolbar from "@/components/common/ListToolbar"
import CreateButton from "@/components/common/CreateButton"
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

  const [provinceList] = useQueries({
    queries: [queries.provinces.list()],
  })


  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-6 md:px-6 md:pt-14">
      <ListPageHeader
        title="공연"
        action={
          <CreateButton
            label="공연 등록"
            onClick={() => router.push(`${pathname}/create`)}
          />
        }
      />

      <ListToolbar
        searchPlaceholder="공연 제목, 출연진 검색"
        groups={[
          {
            param: "provinceId",
            name: "지역",
            options: toRegionOptions(provinceList?.data?.provinces),
          },
          { param: "category", name: "장르", options: CATEGORY_OPTIONS },
        ]}
      />

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
