"use client"

import React, { useState, useMemo, Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQueries } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import ListSearchForm from "@/components/common/ListSearchForm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CreateLinkButton from "@/components/common/CreateLinkButton"
import ProvinceDialog from "@/components/dialog/ProvinceDialog"
import AddButton from "@/components/common/AddButton"
import PerformanceList from "@/components/performances/PerformanceList"
import PerformanceMobileFilterTab from "@/components/performances/PerformanceMobileFilterTab"
import PerformanceCheckBoxes from "@/components/performances/PerformanceCheckBoxes"
import PerformanceListSkeleton from "@/components/skeleton/PerformanceListSkeleton"
import ArrowUpButton from "@/components/common/ArrowUpButton"

const page = () => {
  const searchParams = useSearchParams()
  const provinceIds = searchParams.getAll("provinceId") as string[]
  const router = useRouter()
  const pathname = usePathname()
  const [isProvinceDialog, setIsProvinceDialog] = useState(false)

  const [provinceList, performanceCount] = useQueries({
    queries: [queries.provinces.list(), queries.performances.count()],
  })

  const selectedProvinces = useMemo(() => {
    return provinceList?.data?.provinces?.filter(province =>
      provinceIds.includes(province.id.toString()),
    )
  }, [provinceIds])

  return (
    <div className="mx-auto max-w-screen-lg">
      <ListSearchForm placeholder="제목, 출연진, 공연장 등을 검색해보세요.">
        <h4 className="text-xl font-semibold md:text-2xl">
          기대되는 공연{" "}
          <span className="text-main">{performanceCount.data?.totalCount}</span>
        </h4>
      </ListSearchForm>
      <section className="flex">
        {/* Desktop Filter */}
        <form className="hidden min-w-[180px] flex-col text-gray-400 lg:flex">
          <PerformanceCheckBoxes />
        </form>
        <div className="flex w-full flex-col md:ml-12 md:mt-4 md:flex-1">
          <div className="hidden items-center justify-between lg:flex">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setIsProvinceDialog(!isProvinceDialog)}
                className="h-7 rounded border border-lightgray px-4 text-sm text-main"
              >
                지역선택
              </Button>
              {selectedProvinces?.slice(0, 7).map((province, index) => {
                const name = province.name.slice(0, 2)
                return (
                  <Badge
                    key={province.id}
                    className="flex h-7 items-center rounded border-lightgray text-sm text-main"
                  >
                    <span>
                      {selectedProvinces.length > 7 && index === 6
                        ? `${name} 외 ${selectedProvinces.length - 7}`
                        : name}
                    </span>
                  </Badge>
                )
              })}
            </div>
            <CreateLinkButton
              onClick={() => router.push(`${pathname}/create`)}
            />
          </div>
          {/* Mobile Filter */}
          <PerformanceMobileFilterTab
            provinces={provinceList?.data?.provinces}
          />

          <Suspense fallback={<PerformanceListSkeleton />}>
            <PerformanceList />
          </Suspense>
        </div>
        <ProvinceDialog
          provinces={provinceList?.data?.provinces}
          open={isProvinceDialog}
          close={() => setIsProvinceDialog(false)}
          multiple={true}
        />
        <ArrowUpButton
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="scroll-to-top-button"
        />
        <AddButton
          onClick={() => router.push(`${pathname}/create`)}
          className="fixed bottom-32 right-4 z-50 h-12 w-12 rounded-full bg-white shadow-md md:hidden"
        />
      </section>
    </div>
  )
}

export default page
