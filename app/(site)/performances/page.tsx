"use client"

import React, { useState, useMemo, Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQueries, useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import ListSearchForm from "@/components/common/ListSearchForm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArtType } from "@/types/majors"
import CreateLinkButton from "@/components/common/CreateLinkButton"
import MobileFilterTab from "@/components/common/MobileFIlterTab"
import ProvinceDialog from "@/components/dialog/ProvinceDialog"
import AddButton from "@/components/common/AddButton"
import LessonListSkeleton from "@/components/skeleton/LessonListSkeleton"
import EventList from "@/components/events/EventList"

//artinfo.s3.ap-northeast-2.amazonaws.com/prod/upload/1710/images/20240806/original/v8ofDoqEE16.1722905864785.png"

const page = () => {
  const searchParams = useSearchParams()
  const provinceIds = searchParams.getAll("provinceId") as string[]
  const router = useRouter()
  const pathname = usePathname()
  const [isProvinceDialog, setIsProvinceDialog] = useState(false)

  const [lessonFields, provinceList, majorList] = useQueries({
    queries: [
      queries.lessons.fields(),
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
        <h4 className="text-xl font-bold md:text-2xl">기대되는 공연</h4>
      </ListSearchForm>
      <section className="flex">
        {/* Desktop Filter */}
        <form className="hidden min-w-[180px] flex-col text-gray-400 lg:flex">
          {/* <ProfessionalCheckBoxes artFields={lessonFields?.data?.majorGroups} /> */}
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
          <MobileFilterTab
            majors={majorList?.data?.majors}
            artFields={lessonFields?.data?.majorGroups}
            provinces={provinceList?.data?.provinces}
            page="LESSON"
          />
          <EventList />
        </div>
        <ProvinceDialog
          provinces={provinceList?.data?.provinces}
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

export default page
