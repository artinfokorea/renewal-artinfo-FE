"use client"

import React, { useState, useMemo, Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQueries } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { ArtType } from "@/types/majors"
import Cookies from "js-cookie"
import ListSearchForm from "@/components/common/ListSearchForm"
import JobListCheckBoxes from "@/components/jobs/JobListCheckBoxes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import MobileFilterTab from "@/components/common/MobileFIlterTab"
import JobListSkeleton from "@/components/skeleton/JobListSkeleton"
import JobsList from "@/components/jobs/JobsList"
import ProvinceDialog from "@/components/dialog/ProvinceDialog"
import AddButton from "@/components/common/AddButton"
import CreateLinkButton from "@/components/common/CreateLinkButton"
import ArrowUpButton from "@/components/common/ArrowUpButton"

const page = () => {
  const searchParams = useSearchParams()
  const provinceIds = searchParams.getAll("provinceId") as string[]
  const router = useRouter()
  const pathname = usePathname()
  const [isProvinceDialog, setIsProvinceDialog] = useState(false)

  const [artFields, provinceList, majorList] = useQueries({
    queries: [
      queries.majors.artFields({ artCategories: [ArtType.MUSIC] }),
      queries.provinces.list(),
      queries.majors.list(),
    ],
  })

  const selectedProvinces = useMemo(() => {
    return provinceList?.data?.provinces?.filter(province =>
      provinceIds.includes(province.id.toString()),
    )
  }, [provinceIds])

  return (
    <div className="mx-auto max-w-screen-lg">
      <ListSearchForm>
        <h4 className="text-xl font-bold md:text-2xl">
          취업은 아트인포와 함께
        </h4>
      </ListSearchForm>
      <section className="flex">
        {/* Desktop Filter */}
        <JobListCheckBoxes artFields={artFields?.data?.majorGroups} />

        <div className="flex w-full flex-col md:ml-12 md:mt-4 md:flex-1">
          <div className="mx-4 hidden items-center justify-between lg:flex">
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
              onClick={() => {
                Cookies.set("prevPath", pathname, { expires: 1 / 288 })
                router.push(`${pathname}/create`)
              }}
            />
          </div>

          {/* Mobile Filter */}
          <MobileFilterTab
            majors={majorList?.data?.majors}
            provinces={provinceList?.data?.provinces}
            page="JOB"
            artFields={artFields?.data?.majorGroups}
          />

          <Suspense fallback={<JobListSkeleton />}>
            <JobsList />
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
