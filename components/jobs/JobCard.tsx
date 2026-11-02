import { JOB, JobType } from "@/types/jobs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { forwardRef } from "react"
import filters from "@/lib/filters"
import { shortRegion } from "@/lib/regions"
import FallbackImage from "../common/FallbackImage"

interface Props {
  job: JOB
  isLastPage: boolean
}

/**
 * 채용 목록 한 줄 — 5:3 썸네일(데스크톱 200×120, 모바일 120×72) + 제목 2줄 + 메타 + 전공 태그.
 * 이미지가 없거나 종교 공고면 기관명 박스로 대신한다.
 */
const JobCard = forwardRef<HTMLDivElement, Props>(
  ({ job, isLastPage }, ref) => {
    const pathname = usePathname()
    const filter = filters()
    const majors = job?.majors?.majors ?? []
    const showImage = !!job.imageUrl && job.type !== JobType.RELIGION
    const region = shortRegion(job.address)
    const meta = [job.companyName, region, filter.FROM_NOW_COMMENT(job.createdAt)]
      .filter(Boolean)
      .join(" · ")

    const tags = (limit: number, className: string) => (
      <div className={`flex-wrap gap-1.5 ${className}`}>
        {majors.slice(0, limit).map(major => (
          <span
            key={major.id}
            className="inline-flex h-6 items-center rounded-md bg-[#E8F3FF] px-2 text-xs font-medium text-[#1B64DA] md:h-[26px] md:px-2.5 md:text-[13px]"
          >
            {major.koName}
          </span>
        ))}
        {majors.length > limit && (
          <span className="inline-flex h-6 items-center rounded-md bg-[#F2F4F6] px-2 text-xs font-medium text-[#4E5968] md:h-[26px] md:text-[13px]">
            +{majors.length - limit}
          </span>
        )}
      </div>
    )

    return (
      <li className="border-b border-[#EEF0F3]">
        <Link
          href={`${pathname}/${job.id}`}
          prefetch={false}
          className="group flex gap-3.5 py-4 md:items-center md:gap-6 md:px-2 md:py-5"
        >
          <div className="relative h-[72px] w-[120px] shrink-0 overflow-hidden rounded-[10px] border border-[#EEF0F3] bg-white md:h-[120px] md:w-[200px] md:rounded-xl">
            {showImage ? (
              <FallbackImage
                src={job.imageUrl}
                alt={`${job.companyName} 공고 이미지`}
                fill
                fallbackText={job.companyName}
                className="object-cover"
                sizes="(max-width: 768px) 120px, 200px"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-2 text-center md:p-3">
                <span className="line-clamp-3 break-keep text-xs font-bold leading-snug text-[#333D4B] md:text-base">
                  {job.companyName}
                </span>
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2">
            <h3 className="line-clamp-2 break-keep text-[15px] font-bold leading-snug text-[#191F28] group-hover:text-main md:text-lg">
              {job.title}
            </h3>
            <p className="truncate text-[13px] text-[#6B7684] md:text-sm">{meta}</p>
            {majors.length > 0 && (
              <>
                {tags(2, "flex md:hidden")}
                {tags(3, "hidden md:flex")}
              </>
            )}
          </div>
        </Link>
        {!isLastPage && <div ref={ref} />}
      </li>
    )
  },
)

JobCard.displayName = "JobCard"

export default JobCard
