import { JOB } from "@/types/jobs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import filters from "@/lib/filters"
import { Badge } from "../../ui/badge"
import FallbackImage from "../../common/FallbackImage"

interface Props {
  job: JOB
  isLastPage: boolean
}

const JobCard = forwardRef<HTMLDivElement, Props>(
  ({ job, isLastPage }, ref) => {
    const pathname = usePathname()
    const filter = filters()

    return (
      <Link href={`${pathname}/${job.id}`} prefetch={false}>
        <div className="mx-4 flex h-[130px] items-center rounded-xl md:h-[192px] md:hover:bg-[#f5f5f5]">
          <div className="flex items-center md:px-4">
            {job.imageUrl ? (
              <div className="relative h-[100px] w-[170px] rounded-xl border-2 border-whitesmoke md:h-[140px] md:w-[230px]">
                <FallbackImage
                  src={job.imageUrl}
                  alt={`${job.companyName}_job_image`}
                  fill
                  fallbackText={job.companyName}
                  className="rounded-xl"
                  quality={100}
                  priority
                  sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
                />
              </div>
            ) : (
              <div className="flex h-[100px] w-[170px] items-center justify-center rounded-xl border-2 border-whitesmoke bg-white px-2 md:h-[140px] md:w-[230px]">
                <span className="break-all text-center text-base font-bold md:text-xl">
                  {job.companyName}
                </span>
              </div>
            )}
            <div className="ml-4 flex-1 py-2 md:ml-12">
              <h4 className="line-clamp-1 break-all text-sm font-bold md:text-xl">
                {job.title}
              </h4>
              <div className="my-2 flex items-center gap-2">
                {job.address && (
                  <Badge className="rounded-xl border-main text-[10px] text-main md:text-sm">
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
                          className="rounded-xl bg-main text-[10px] text-white"
                        >
                          <span>
                            {`${major.koName} 외 ${
                              job?.majors?.majors.length - 1
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
              <div className="flex justify-between gap-2 text-xs text-coolgray md:text-base">
                <span className="line-clamp-2 break-all">
                  {job.companyName}
                </span>
                <span>{filter.YYYYMMDD(job.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        {!isLastPage && <div ref={ref} />}
      </Link>
    )
  },
)

JobCard.displayName = "JobCard"

export default JobCard
