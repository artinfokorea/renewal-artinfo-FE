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
        <div className="md:hover:bg-[#f5f5f5] rounded-xl h-[130px] md:h-[192px]  flex items-center">
          <div className="flex items-center md:px-4">
            <div className="bg-white h-[100px] md:h-[140px] w-[170px] md:w-[230px] border-whitesmoke border-2 rounded-xl flex justify-center items-center px-2">
              <span className="font-bold text-base md:text-xl text-center break-all">
                {job.companyName}
              </span>
            </div>

            <div className="ml-4 md:ml-12 py-2 flex-1">
              <h4 className="text-sm md:text-xl font-bold line-clamp-2 break-all">
                {job.title}
              </h4>
              <div className="flex gap-2 my-2 items-center">
                {job.address && (
                  <Badge className="bg-white text-[10px] md:text-sm text-main rounded-xl whitespace-nowrap border-main border">
                    {job.address.split(" ")[0].substring(0, 2)}
                  </Badge>
                )}

                <div className="hidden md:flex gap-2">
                  {job?.majors?.majors?.slice(0, 3).map((major, index) => {
                    if (job?.majors?.majors?.length > 3 && index === 2)
                      return (
                        <Badge
                          key={major.id}
                          className="bg-main text-sm text-white rounded-xl"
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
                        className="bg-main text-sm text-white rounded-xl"
                      >
                        {major.koName}
                      </Badge>
                    )
                  })}
                </div>
                <div className="flex md:hidden gap-2">
                  {job?.majors?.majors?.slice(0, 1).map((major, index) => {
                    if (job?.majors?.majors?.length > 1 && index === 0)
                      return (
                        <Badge
                          key={major.id}
                          className="bg-main text-[10px] text-white rounded-xl whitespace-nowrap"
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
                        className="bg-main text-[10px] text-white rounded-xl whitespace-nowrap"
                      >
                        {major.koName}
                      </Badge>
                    )
                  })}
                </div>
              </div>
              <div className="flex justify-between text-coolgray text-xs md:text-base">
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
