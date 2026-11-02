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
import { useSearchParamList } from "@/hooks/useSearchParamList"
import ListPageHeader from "@/components/common/ListPageHeader"
import CreateButton from "@/components/common/CreateButton"
import SearchBar from "@/components/common/SearchBar"
import FilterChips from "@/components/common/FilterChips"
import FilterDropdown from "@/components/common/FilterDropdown"
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
  const provinceFilter = useSearchParamList("provinceId")
  const recruitFilter = useSearchParamList("recruit")
  const professionalFilter = useSearchParamList("professional")

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

  const totalCount = jobsCount?.data?.totalCount

  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-6 md:px-6 md:pt-12">
      <ListPageHeader
        title="채용"
        description={
          <>
            <span className="hidden md:inline">예술단체·교회·학교의 음악인 </span>
            채용 공고
            {totalCount !== undefined && (
              <span className="whitespace-nowrap">
                {" "}
                <strong className="text-main">{totalCount}</strong>개
              </span>
            )}
          </>
        }
        action={<CreateButton label="공고 등록" onClick={goToCreatePage} />}
      />

      <div className="mt-5 md:mt-7">
        <SearchBar placeholder="기관명, 공고 제목, 전공으로 검색" />
      </div>

      {jobTimeType !== JobTimeType.PART_TIME && (
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
              label="유형"
              options={JOB_TYPE_OPTIONS}
              selected={recruitFilter.values}
              onToggle={recruitFilter.toggle}
              onClear={recruitFilter.clear}
            />
            <FilterDropdown
              label="분야"
              options={fieldOptions}
              selected={professionalFilter.values}
              onToggle={professionalFilter.toggle}
              onClear={professionalFilter.clear}
            />
          </div>
        </div>
      )}

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
