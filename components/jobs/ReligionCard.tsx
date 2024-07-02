import { JOB, JobType } from "@/types/jobs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import Image from "next/image"
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
        <div className="hover:bg-whitesmoke rounded-xl h-[130px] md:h-[192px]  flex items-center">
          <div className="flex items-center md:px-4">
            <div className="h-[100px] md:h-[140px] w-[170px] md:w-[230px] border-whitesmoke border-2 rounded-xl flex justify-center items-center">
              <span className="font-bold text-lg md:text-2xl">
                {job.companyName}
              </span>
            </div>

            <div className="ml-4 md:ml-12 py-2 flex-1">
              <h4 className="text-sm md:text-xl font-bold break-keep">
                {job.title}
              </h4>
              <div className="flex gap-2 my-2 items-center text-xs md:text-sm">
                <Badge className="border border-main text-main text-[10px] md:text-sm font-semibold h-5 md:h-6">
                  {/* {job.province as string} */}
                  고양시
                </Badge>
                <div className="flex gap-2">
                  {job.majors?.majors?.map(major => (
                    <Badge
                      key={major.id}
                      className="bg-main text-white text-[10px] md:text-sm rounded-xl h-5 md:h-6"
                    >
                      {major.koName}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-coolgray text-xs md:text-base">
                <span>{job.companyName}</span>
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
