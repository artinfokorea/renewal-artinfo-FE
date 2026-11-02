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

/** 전공을 "소프라노 · 트럼펫 외 2" 처럼 한 줄 글자로 */
const majorsText = (job: JOB, limit = 3) => {
  const majors = job?.majors?.majors ?? []
  const shown = majors
    .slice(0, limit)
    .map(major => major.koName)
    .join(" · ")
  return majors.length > limit ? `${shown} 외 ${majors.length - limit}` : shown
}

/**
 * 채용 목록 한 줄 — 5:3 썸네일(모바일 110×66, 데스크톱 160×96) + 제목 2줄 + 메타 한 줄.
 * 데스크톱은 전공을 회색 글자 한 줄로 더 보여준다. 이미지가 없거나 종교 공고면 기관명 박스.
 */
const JobCard = forwardRef<HTMLDivElement, Props>(
  ({ job, isLastPage }, ref) => {
    const pathname = usePathname()
    const filter = filters()
    const showImage = !!job.imageUrl && job.type !== JobType.RELIGION
    const meta = [
      job.companyName,
      shortRegion(job.address),
      filter.FROM_NOW_COMMENT(job.createdAt),
    ]
      .filter(Boolean)
      .join(" · ")
    const majors = majorsText(job)

    return (
      <li className="border-t border-[#F2F4F6] first:border-t-0">
        <Link
          href={`${pathname}/${job.id}`}
          prefetch={false}
          className="group flex gap-3.5 py-4 md:items-center md:gap-5 md:py-[18px]"
        >
          <div className="relative h-[66px] w-[110px] shrink-0 overflow-hidden rounded-lg border border-[#EEF0F3] bg-white md:h-24 md:w-40 md:rounded-[10px]">
            {showImage ? (
              <FallbackImage
                src={job.imageUrl}
                alt={`${job.companyName} 공고 이미지`}
                fill
                fallbackText={job.companyName}
                className="object-contain"
                sizes="(max-width: 768px) 110px, 160px"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-1.5 text-center md:p-2.5">
                <span className="line-clamp-3 break-keep text-[11px] font-bold leading-snug text-[#4E5968] md:text-sm">
                  {job.companyName}
                </span>
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-1.5">
            <h3 className="line-clamp-2 break-keep text-[15px] font-bold leading-snug text-[#191F28] group-hover:text-main md:text-[17px]">
              {job.title}
            </h3>
            <p className="truncate text-[13px] text-coolgray md:text-sm">{meta}</p>
            {majors && (
              <p className="hidden truncate text-sm text-[#4E5968] md:block">
                {majors}
              </p>
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
