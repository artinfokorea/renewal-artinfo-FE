import React, { forwardRef } from "react"
import { JOB } from "@/types/jobs"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Badge } from "../ui/badge"
import filters from "@/lib/filters"

interface Props {
  job: JOB
  isLastPage: boolean
}

export const JobPartTimeCard = forwardRef<HTMLDivElement, Props>(
  ({ job, isLastPage }, ref) => {
    const pathname = usePathname()
    const filter = filters()
    const startAt = filter.YYYYMMDD(job.startAt)
    const endAt = filter.YYYYMMDD(job.endAt)

    return (
      <Link href={`${pathname}/part-time/${job.id}`} prefetch={false}>
        <div className="mx-4 h-40 rounded border border-whitesmoke p-4 md:h-[145px]">
          <h3 className="line-clamp-2 text-lg font-semibold md:text-xl">
            {job.title}
          </h3>
          <div className="my-3 flex gap-2">
            {job.address && (
              <Badge className="rounded-xl border-main text-xs text-main md:text-sm">
                {job.address.split(" ")[0].substring(0, 2)}
              </Badge>
            )}
            {job?.majors?.majors?.slice(0, 3).map((major, index) => {
              if (job?.majors?.majors?.length > 3 && index === 2)
                return (
                  <Badge
                    key={major.id}
                    className="rounded-xl bg-main text-xs text-white md:text-sm"
                  >
                    <span className="text-sm text-white">
                      {`${major.koName} 외 ${job?.majors?.majors.length - 3}`}
                    </span>
                  </Badge>
                )

              return (
                <Badge
                  key={major.id}
                  className="rounded-xl bg-main text-xs text-white md:text-sm"
                >
                  {major.koName}
                </Badge>
              )
            })}
          </div>
          <div className="my-3 flex flex-col gap-1 text-xs font-semibold md:flex-row md:justify-between md:text-sm">
            <span className="text-grey">{job.companyName}</span>
            <span>
              {startAt} ~ {endAt}
            </span>
          </div>
        </div>
        {!isLastPage && <div ref={ref} />}
      </Link>
    )
  },
)

JobPartTimeCard.displayName = "JobPartTimeCard"
