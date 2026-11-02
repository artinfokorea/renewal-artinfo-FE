"use client"

import React, { Suspense } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQueries } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { queries } from "@/lib/queries"
import { toRegionOptions } from "@/lib/regions"
import { ArtType } from "@/types/majors"
import { JobTimeType, JobTypeList } from "@/types/jobs"
import { useJobTimeType } from "@/hooks/useJobTimeType"
import ListPageHeader from "@/components/common/ListPageHeader"
import ListToolbar from "@/components/common/ListToolbar"
import CreateButton from "@/components/common/CreateButton"
import ArrowUpButton from "@/components/common/ArrowUpButton"
import JobList from "@/components/jobs/JobList"
import JobPartTimeList from "@/components/jobs/JobPartTimeList"
import JobListSkeleton from "@/components/skeleton/JobListSkeleton"
import PartTimeListSkeleton from "@/components/skeleton/PartTimeListSkeleton"

const JOB_TYPE_OPTIONS = JobTypeList.map(({ title, value }) => ({
  label: title,
  value,
}))

const page = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { jobTimeType } = useJobTimeType()

  const [artFields, provinceList, jobsCount] = useQueries({
    queries: [
      queries.majors.artFields({ artCategories: [ArtType.MUSIC] }),
      queries.provinces.list(),
      queries.jobs.count(),
    ],
  })

  const fieldOptions =
    artFields?.data?.majorGroups?.map(({ nameKo, nameEn }) => ({
      label: nameKo,
      value: nameEn,
    })) ?? []

  const goToCreatePage = () => {
    Cookies.set("prevPath", pathname, { expires: 1 / 288 })
    if (jobTimeType === JobTimeType.PART_TIME) {
      router.push(`${pathname}/part-time/create`)
    } else {
      router.push(`${pathname}/create`)
    }
  }


  return (
    <div className="mx-auto max-w-[760px] px-4 pt-6 md:px-6 md:pt-14">
      <ListPageHeader
        title="채용"
        count={jobsCount?.data?.totalCount}
        action={<CreateButton label="공고 등록" onClick={goToCreatePage} />}
      />

      <ListToolbar
        searchPlaceholder="기관, 제목, 전공 검색"
        groups={
          jobTimeType === JobTimeType.PART_TIME
            ? []
            : [
                {
                  param: "provinceId",
                  name: "지역",
                  options: toRegionOptions(provinceList?.data?.provinces),
                },
                { param: "recruit", name: "유형", options: JOB_TYPE_OPTIONS },
                { param: "professional", name: "분야", options: fieldOptions },
              ]
        }
      />

      {jobTimeType === JobTimeType.PART_TIME ? (
        <Suspense fallback={<PartTimeListSkeleton />}>
          <JobPartTimeList />
        </Suspense>
      ) : (
        <Suspense fallback={<JobListSkeleton />}>
          <JobList />
        </Suspense>
      )}

      <ArrowUpButton
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="scroll-to-top-button"
      />
    </div>
  )
}

export default page
