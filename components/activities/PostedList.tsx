import React from "react"
import { queries } from "@/lib/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Button } from "@headlessui/react"
import filters from "@/lib/filters"

export const PostedList = () => {
  const filter = filters()

  const { data: myActivities } = useSuspenseQuery(
    queries.jobs.myActivities({ page: 1, size: 10 }),
  )

  console.log(myActivities)

  return (
    <div>
      {myActivities?.jobs?.map(job => (
        <div
          key={job.id}
          className="flex flex-col gap-4 rounded border border-lightgray p-4 shadow-md"
        >
          <span>{job.title}</span>
          <div>
            <Button>신청자</Button>
            <Button>마감</Button>
            <Button>바로가기</Button>
          </div>
          <div className="flex justify-end">
            <span>{filter.YYYYMMDD(job.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
