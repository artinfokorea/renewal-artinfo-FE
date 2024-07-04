import filters from "@/lib/filters"
import { JOB } from "@/types/jobs"
import React, { forwardRef } from "react"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { EditIcon } from "lucide-react"
import TrashIcon from "../icons/TrashIcon"

interface Props {
  job: JOB
  isLastPage: boolean
}

const ObriCard = forwardRef<HTMLDivElement, Props>(
  ({ job, isLastPage }, ref) => {
    const filter = filters()
    const pathname = usePathname()
    return (
      <Link href={`${pathname}/${job.id}`}>
        <ul className="my-4 flex flex-col rounded-lg border border-whitesmoke text-xs md:mx-4 md:my-6 md:text-base">
          <li className="border-whitespace flex h-12 items-center border-b px-4 md:h-12">
            <h5 className="basis-2/5 font-semibold text-main md:basis-1/3">
              {job.majors?.majors[0].koName}
            </h5>
            <div className="flex basis-3/5 justify-between md:basis-2/3">
              <h4 className="font-bold">{job.title}</h4>
              {job.endAt < new Date() ? (
                <button
                  disabled
                  className="rounded bg-lightgray px-3 text-white"
                >
                  마감
                </button>
              ) : (
                <button className="rounded border border-whitesmoke px-3 text-main">
                  지원
                </button>
              )}
            </div>
          </li>
          <li className="border-whitespace flex h-12 items-center border-b px-4 md:h-12">
            <span className="basis-2/5 font-bold md:basis-1/3">
              페이 {job.fee}만원
            </span>
            <span className="basis-3/5 md:basis-2/3">{job.province}</span>
          </li>
          <li className="border-whitespace flex h-12 items-center justify-center gap-4 border-b px-4 md:h-12 md:gap-8">
            <span>{filter.YYYYMMDD(job.startAt, "YYYY.MM.DD(ddd) hh:mm")}</span>{" "}
            -<span>{filter.YYYYMMDD(job.endAt, "YYYY.MM.DD(ddd) hh:mm")}</span>
          </li>
          <li className="flex h-12 items-center px-6 md:h-12">
            <span className="mr-2 h-[6px] w-[6px] rounded-full bg-primary" />
            {job.contents}
          </li>
        </ul>
        {!isLastPage && <div ref={ref} />}
      </Link>
    )
  },
)

ObriCard.displayName = "ObriCard"

export default ObriCard
