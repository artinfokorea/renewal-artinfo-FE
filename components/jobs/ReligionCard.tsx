import { JOB } from "@/types/jobs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import filters from "@/lib/filters"
import { Badge } from "../ui/badge"

interface Props {
  job: JOB
  isLastPage: boolean
}

const ReligionCard = forwardRef<HTMLDivElement, Props>(
  ({ job, isLastPage }, ref) => {
    const pathname = usePathname()
    const filter = filters()

    return (
      <Link href={`${pathname}/${job.id}`}>
        <div className="mx-4 flex h-[130px] items-center rounded-xl md:h-[192px] md:hover:bg-[#f5f5f5]">
          <div className="flex items-center md:px-4">
            <div className="flex h-[100px] w-[170px] items-center justify-center rounded-xl border-2 border-whitesmoke bg-white px-2 md:h-[140px] md:w-[230px]">
              <span className="break-all text-center text-base font-bold md:text-xl">
                {job.companyName}
              </span>
            </div>

            <div className="ml-4 flex-1 py-2 md:ml-12">
              <h4 className="line-clamp-1 break-all text-sm font-bold md:text-xl">
                {job.title}
              </h4>
              <div className="my-2 flex items-center gap-2">
                {job.address && (
                  <Badge className="whitespace-nowrap rounded-xl border border-main bg-white text-[10px] text-main md:text-sm">
                    {job.address.split(" ")[0].substring(0, 2)}
                  </Badge>
                )}

                <div className="hidden gap-2 md:flex">
                  {job?.majors?.majors?.slice(0, 3).map((major, index) => {
                    if (job?.majors?.majors?.length > 3 && index === 2)
                      return (
                        <Badge
                          key={major.id}
                          className="rounded-xl bg-main text-sm text-white"
                        >
                          <span className="text-sm text-white">
                            {`${major.koName} 외 ${
                              job?.majors?.majors.length - 3
                            }`}
                          </span>
                        </Badge>
                      )

                    return (
                      <Badge
                        key={major.id}
                        className="rounded-xl bg-main text-sm text-white"
                      >
                        {major.koName}
                      </Badge>
                    )
                  })}
                </div>
                <div className="flex gap-2 md:hidden">
                  {job?.majors?.majors?.slice(0, 1).map((major, index) => {
                    if (job?.majors?.majors?.length > 1 && index === 0)
                      return (
                        <Badge
                          key={major.id}
                          className="whitespace-nowrap rounded-xl bg-main text-[10px] text-white"
                        >
                          <span>
                            {`${major.koName} 외 ${
                              job?.majors?.majors.length - 2
                            }`}
                          </span>
                        </Badge>
                      )

                    return (
                      <Badge
                        key={major.id}
                        className="whitespace-nowrap rounded-xl bg-main text-[10px] text-white"
                      >
                        {major.koName}
                      </Badge>
                    )
                  })}
                </div>
              </div>
              <div className="flex justify-between text-xs text-coolgray md:text-base">
                <span className="line-clamp-2 break-all">
                  {job.companyName}
                </span>
                <span>{filter.YYYYMMDD(job.endAt)}</span>
              </div>
            </div>
          </div>
        </div>
        {!isLastPage && <div ref={ref} />}
      </Link>
    )
  },
)

ReligionCard.displayName = "ReligionCard"

export default ReligionCard
