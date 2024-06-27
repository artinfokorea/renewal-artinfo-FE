"use client"

import { queries } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import ListSearchForm from "../common/ListSearchForm"
import { Suspense, useMemo, useState } from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import CloseIcon from "../icons/CloseIcon"
import ProvinceDialog from "../dialog/ProvinceDialog"
import MajorCheckBoxes from "../common/MajorCheckBoxes"
import MobileFilterTab from "../common/MobileFIlterTab"
import LessonList from "./LessonList"
import LessonListSkeleton from "../skeleton/LessonListSkeleton"
import ConfirmDialog from "../dialog/ConfirmDialog"

const LessonsContainer = () => {
  const searchParams = useSearchParams()
  const provinceIds = searchParams.getAll("provinceId") as string[]
  const router = useRouter()
  const [isProvinceDialog, setIsProvinceDialog] = useState(false)
  const pathname = usePathname()

  const { data: majors } = useQuery(queries.majors.list())

  const { data: provinceList } = useQuery(queries.provinces.list())

  const { data: lessonsCount } = useQuery(queries.lessons.count())

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
        totalCount={lessonsCount?.totalCount}
        title="명의 전문가가
        준비중이에요."
      />
      <section className="flex">
        <form className="hidden lg:flex flex-col text-gray-400 min-w-[180px]">
          <MajorCheckBoxes majors={majors?.majors} />
        </form>
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
            majors={majors?.majors}
            provinces={provinceList?.provinces}
            page="LESSON"
          />
          <Suspense fallback={<LessonListSkeleton />}>
            <LessonList />
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

export default LessonsContainer
