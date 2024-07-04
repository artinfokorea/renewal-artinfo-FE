"use client"

import { queries } from "@/lib/queries"
import { JOB, JobType } from "@/types/jobs"
import { useSuspenseQuery } from "@tanstack/react-query"
import Link from "next/link"
import React from "react"

const MainObriContainer = () => {
  const { data } = useSuspenseQuery(
    queries.jobs.list({ page: 1, size: 5, types: [JobType.PART_TIME] }),
  )

  return (
    <section className="my-8 md:my-12">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">#오브리</h3>
        <Link href={`/jobs?recruit=${JobType.PART_TIME}`}>
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>

      <div className="mb-12 mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6">
        {data?.jobs.map(job => (
          <Link key={job.id} href={`/jobs/${job.id}`}>
            <div className="flex items-center rounded-md border border-lightgrey py-5 text-sm md:text-lg">
              <div className="flex w-full px-4">
                <span className="basis-1/4 font-medium text-main">
                  {job.majors?.majors?.[0]?.koName}
                </span>
                <span className="basis-1/4">{job.address}</span>
                <span className="basis-2/4 overflow-hidden text-ellipsis whitespace-nowrap font-bold">
                  {job.title}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default MainObriContainer
