"use client"

import React, { useState, useMemo, Suspense } from "react"
import ListSearchForm from "../common/ListSearchForm"
import JobListCheckBoxes from "./JobListCheckBoxes"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import ProvinceDialog from "../dialog/ProvinceDialog"
import MobileFilterTab from "../common/MobileFIlterTab"
import JobsList from "./JobsList"
import JobListSkeleton from "../skeleton/JobListSkeleton"
import { ArtType } from "@/types/majors"
import AddButton from "../common/AddButton"
import Cookies from "js-cookie"

const JobsContainer = () => {
  const searchParams = useSearchParams()
  const provinceIds = searchParams.getAll("provinceId") as string[]
  const router = useRouter()
  const pathname = usePathname()
  const [isProvinceDialog, setIsProvinceDialog] = useState(false)

  const { data: artFields } = useQuery(
    queries.majors.artFields({ artCategories: [ArtType.MUSIC] }),
  )

  const { data: provinceList } = useQuery(queries.provinces.list())

  const selectedProvinces = useMemo(() => {
    return provinceList?.provinces?.filter(province =>
      provinceIds.includes(province.id.toString()),
    )
  }, [provinceIds])

  return (
    <div className="mx-auto max-w-screen-lg px-4">
      <ListSearchForm>
        <h4 className="text-lg font-bold md:text-2xl">
          취업은 아트인포와 함께
        </h4>
      </ListSearchForm>
      <section className="flex">
        {/* Desktop Filter */}
        <JobListCheckBoxes artFields={artFields?.majorGroups} />

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
            <Button
              className="rounded-3xl bg-main px-6 py-2 text-white"
              onClick={() => {
                Cookies.set("prevPath", pathname, { expires: 1 / 288 })
                router.push(`${pathname}/create`)
              }}
            >
              채용등록
            </Button>
          </div>

          {/* Mobile Filter */}
          <MobileFilterTab
            provinces={provinceList?.provinces}
            page="JOB"
            artFields={artFields?.majorGroups}
          />

          <Suspense fallback={<JobListSkeleton />}>
            <JobsList />
          </Suspense>
        </div>
        <ProvinceDialog
          provinces={provinceList?.provinces}
          open={isProvinceDialog}
          close={() => setIsProvinceDialog(false)}
          multiple={true}
        />
        <AddButton
          onClick={() => router.push(`${pathname}/create`)}
          className="fixed bottom-32 right-4 z-50 h-12 w-12 rounded-full bg-white shadow-md md:hidden"
        />
      </section>
    </div>
  )
}

export default JobsContainer
