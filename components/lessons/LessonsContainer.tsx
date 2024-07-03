"use client"

import { queries } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import ListSearchForm from "../common/ListSearchForm"
import { Suspense, useMemo, useState } from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import ProvinceDialog from "../dialog/ProvinceDialog"
import LessonList from "./LessonList"
import LessonListSkeleton from "../skeleton/LessonListSkeleton"
import { ArtType } from "@/types/majors"
import ProfessionalCheckBoxes from "../common/ProfessionalCheckBoxes"
import MobileFilterTab from "../common/MobileFIlterTab"
import AddButton from "../common/AddButton"

const LessonsContainer = () => {
  const searchParams = useSearchParams()
  const provinceIds = searchParams.getAll("provinceId") as string[]
  const router = useRouter()
  const [isProvinceDialog, setIsProvinceDialog] = useState(false)
  const pathname = usePathname()

  const { data: artFields } = useQuery(
    queries.majors.artFields({ artCategories: [ArtType.MUSIC] }),
  )

  const { data: provinceList } = useQuery(queries.provinces.list())

  const { data: lessonsCount } = useQuery(queries.lessons.count())

  const selectedProvinces = useMemo(() => {
    return provinceList?.provinces?.filter(province =>
      provinceIds.includes(province.id.toString()),
    )
  }, [provinceIds])

  return (
    <div className="max-w-screen-lg mx-auto px-4">
      <ListSearchForm
        totalCount={lessonsCount?.totalCount}
        title="명의 전문가가
        준비중이에요."
      />
      <section className="flex">
        <form className="hidden lg:flex flex-col text-gray-400 min-w-[180px]">
          <ProfessionalCheckBoxes artFields={artFields?.majorGroups} />
        </form>
        <div className="md:flex-1 w-full flex flex-col md:ml-12 md:mt-4">
          <div className="hidden lg:flex justify-between items-center">
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setIsProvinceDialog(!isProvinceDialog)}
                className="text-main text-sm border border-lightgray rounded px-4 h-7"
              >
                지역선택
              </Button>
              {selectedProvinces?.slice(0, 7).map((province, index) => {
                const name = province.name.slice(0, 2)
                return (
                  <Badge
                    key={province.id}
                    className="text-main text-sm border-lightgray rounded h-7 flex items-center"
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
              className="py-2 px-6 text-white bg-main rounded-3xl"
              onClick={() => router.push(`${pathname}/create`)}
            >
              등록
            </Button>
          </div>
          <MobileFilterTab
            artFields={artFields?.majorGroups}
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
          multiple={true}
        />
        <AddButton
          onClick={() => router.push(`${pathname}/create`)}
          className="md:hidden fixed z-50 bottom-32 right-4 w-12 h-12 bg-white shadow-md rounded-full"
        />
      </section>
    </div>
  )
}

export default LessonsContainer
