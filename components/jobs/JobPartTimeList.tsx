import { ScrollApiResponse } from "@/interface"
import { queries } from "@/lib/queries"
import { JOB, PartTimeMajor } from "@/types/jobs"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useInView } from "react-intersection-observer"
import React, { useEffect } from "react"
import { JobPartTimeCard } from "./JobPartTimeCard"

const JobPartTimeList = () => {
  const searchParams = useSearchParams()
  const partTimeMajors = searchParams.getAll("partTimeMajor") as PartTimeMajor[]
  const keyword = searchParams.get("keyword") as string
  const provinceIds = searchParams.getAll("provinceId") as string[]

  const queryParams = {
    size: 10,
    majorGroups: partTimeMajors.length > 0 ? partTimeMajors : [],
    keyword,
    provinceIds: provinceIds.map(id => Number(id)),
  }

  const [ref, inView] = useInView({
    delay: 100,
    threshold: 0.5,
  })

  const {
    data: partTimeJobs,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery<ScrollApiResponse<JOB, "jobs">>({
    ...queries.jobs.infinitePartTimeList(queryParams),
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
    <div className="mt-4 grid max-w-full grid-cols-1 gap-4 md:grid-cols-2">
      {partTimeJobs?.pages?.map(page =>
        page?.jobs?.map((job, index) => {
          return (
            <JobPartTimeCard
              key={job.id}
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

export default JobPartTimeList
