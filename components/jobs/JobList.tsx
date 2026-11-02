import { ScrollApiResponse } from "@/interface"
import { queries } from "@/lib/queries"
import { JOB, JobType } from "@/types/jobs"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useInView } from "react-intersection-observer"
import React, { useEffect } from "react"
import JobCard from "./JobCard"
import { ProfessionalFieldTypes } from "@/types/majors"

const JobList = () => {
  const searchParams = useSearchParams()
  const recruits = searchParams.getAll("recruit") as JobType[]
  const professionals = searchParams.getAll(
    "professional",
  ) as ProfessionalFieldTypes[]
  const keyword = searchParams.get("keyword") as string
  const provinceIds = searchParams.getAll("provinceId") as string[]

  const types =
    recruits.length > 0
      ? recruits
      : [JobType.ART_ORGANIZATION, JobType.LECTURER, JobType.RELIGION]

  const queryParams = {
    size: 10,
    types,
    keyword,
    professionalFields: professionals.map(professional => professional),
    provinceIds: provinceIds.map(id => Number(id)),
  }

  const [ref, inView] = useInView({
    delay: 100,
    threshold: 0.5,
  })

  const {
    data: jobs,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery<ScrollApiResponse<JOB, "jobs">>({
    ...queries.jobs.infiniteList(queryParams),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (!lastPage.isLast) return lastPage.nextPage
      return null
    },
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  const isEmpty = !jobs?.pages?.[0]?.jobs?.length

  return (
    <section aria-label="채용 공고 목록" className="mt-4 md:mt-6">
      {isEmpty ? (
        <p className="py-16 text-center text-[15px] text-coolgray">
          조건에 맞는 공고가 없어요. 필터를 바꿔 보세요.
        </p>
      ) : (
        <ul>
          {jobs?.pages?.map(page =>
            page?.jobs?.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                ref={ref}
                isLastPage={!(hasNextPage && index === page.jobs.length - 5)}
              />
            )),
          )}
        </ul>
      )}
    </section>
  )
}

export default JobList
