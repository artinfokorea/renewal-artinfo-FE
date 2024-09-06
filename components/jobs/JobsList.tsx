import { ScrollApiResponse } from "@/interface"
import { queries } from "@/lib/queries"
import { JOB, JobType } from "@/types/jobs"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useInView } from "react-intersection-observer"
import React, { useEffect } from "react"
import JobCard from "./JobCard"
import ReligionCard from "./ReligionCard"
import { ProfessionalFieldTypes } from "@/types/majors"

const JobsList = () => {
  const searchParams = useSearchParams()
  const recruits = searchParams.getAll("recruit") as JobType[]
  const professionals = searchParams.getAll(
    "professional",
  ) as ProfessionalFieldTypes[]
  const keyword = searchParams.get("keyword") as string
  const provinceIds = searchParams.getAll("provinceId") as string[]

  const queryParams = {
    size: 10,
    types:
      recruits.length > 0
        ? recruits
        : [JobType.ART_ORGANIZATION, JobType.LECTURER, JobType.RELIGION],
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

  return (
    <div className="mt-4 max-w-full">
      {jobs?.pages?.map(page =>
        page?.jobs?.map((job, index) => {
          return job.type === JobType.RELIGION ? (
            <ReligionCard
              key={`${job.id}${professionals}${provinceIds}`}
              job={job}
              ref={ref}
              isLastPage={!(hasNextPage && index === page.jobs.length - 5)}
            />
          ) : (
            <JobCard
              key={`${job.id}${professionals}${provinceIds}`}
              job={job}
              ref={ref}
              isLastPage={!(hasNextPage && index === page.jobs.length - 5)}
            />
          )
        }),
      )}
    </div>
  )
}

export default JobsList
