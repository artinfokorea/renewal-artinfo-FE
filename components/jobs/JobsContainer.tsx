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
import CloseIcon from "../icons/CloseIcon"
import MobileFilterTab from "../common/MobileFIlterTab"
import JobsList from "./JobsList"
import JobListSkeleton from "../skeleton/JobListSkeleton"
import { ArtType } from "@/types/majors"

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

  const { data: jobsCount } = useQuery(queries.jobs.count())

  const selectedProvinces = useMemo(() => {
    return provinceList?.provinces?.filter(province =>
      provinceIds.includes(province.id.toString()),
    )
  }, [provinceIds])

  const deleteProvince = (provinceId: string) => {
    const locationParams = new URLSearchParams(window.location.search)
    if (provinceIds.includes(provinceId)) {
      const newProvinceIds = provinceIds.filter(id => id !== provinceId)

      locationParams.delete("provinceId")
      newProvinceIds.forEach(id => {
        locationParams.append("provinceId", id)
      })
    }

    const newUrl = `${window.location.pathname}?${locationParams.toString()}`
    router.push(newUrl, {
      scroll: false,
    })
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4">
      <ListSearchForm
        totalCount={jobsCount?.totalCount}
        title="개의 채용이
        진행중이에요."
      />

      <section className="flex">
        <JobListCheckBoxes artFields={artFields?.majorGroups} />
        <div className="md:flex-1 w-full flex flex-col md:ml-12 md:mt-4">
          <div className="hidden lg:flex justify-between items-center">
            <div className="flex gap-2 flex-wrap">
              {selectedProvinces?.length === 0 && (
                <Button
                  onClick={() => setIsProvinceDialog(!isProvinceDialog)}
                  className="text-main text-sm border border-lightgray rounded px-4 h-7"
                >
                  지역선택
                </Button>
              )}
              {selectedProvinces?.map(province => (
                <Badge
                  key={province.id}
                  className="text-main text-sm border-lightgray rounded h-7 flex items-center"
                >
                  <span>{province.name.slice(0, 2)}</span>
                  <button
                    onClick={() => deleteProvince(province.id.toString())}
                  >
                    <CloseIcon className="w-4 h-4 pb-[1px]" />
                  </button>
                </Badge>
              ))}
            </div>
            <Button
              className="py-2 px-6 text-white bg-main rounded-3xl"
              onClick={() => router.push(`${pathname}/create`)}
            >
              등록
            </Button>
          </div>
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
          multiple={false}
        />
      </section>
    </div>
  )
}

export default JobsContainer