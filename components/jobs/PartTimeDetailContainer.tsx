import React, { useState } from "react"
import { JOB } from "@/types/jobs"
import filters from "@/lib/filters"
import { Badge } from "../ui/badge"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import ItemManageBox from "../common/ItemManageBox"
import { usePathname, useRouter } from "next/navigation"
import { Spinner } from "../common/Loading"

interface Props {
  job: JOB
  handleApplyDialog: () => void
  isQualificationLoading: boolean
  updateStatus: () => void
}

const InfoItem = ({
  title,
  value,
}: {
  title: string
  value: string | number
}) => {
  return (
    <div className="flex text-sm md:text-lg">
      <span className="basis-1/5 font-semibold text-grayfont">{title}</span>
      <span>{value}</span>
    </div>
  )
}

export const PartTimeDetailContainer = ({
  job,
  handleApplyDialog,
  isQualificationLoading,
  updateStatus,
}: Props) => {
  const filter = filters()
  const { data } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })
  const [isDeleteConfirmDialog, setIsDeleteConfirmDialog] = useState(false)

  return (
    <div className="mt-8 max-w-screen-lg px-4 md:mt-16 md:px-8">
      <div className="flex flex-col">
        <h4 className="mt-4 break-words text-xl font-bold md:mt-0">
          {job?.title}
        </h4>
        <div className="mt-8 flex flex-col gap-6">
          <InfoItem title="단체명" value={job?.companyName} />
          <InfoItem title="급여" value={`${filter.FEECOMMA(job?.fee)}원`} />

          <div className="flex items-center">
            <span className="basis-1/5 text-sm font-semibold text-grayfont md:text-lg">
              전공
            </span>
            <div className="my-2 hidden items-center gap-2 text-xs text-white md:flex md:text-sm">
              {job?.majors?.majors?.slice(0, 3).map((major, index) => {
                if (job?.majors?.majors?.length > 3 && index === 2)
                  return (
                    <Badge key={major.id} className="rounded-xl bg-main">
                      <span>
                        {`${major.koName} 외 ${job?.majors?.majors.length - 3}`}
                      </span>
                    </Badge>
                  )

                return (
                  <Badge key={major.id} className="rounded-xl bg-main">
                    {major.koName}
                  </Badge>
                )
              })}
            </div>
            <div className="my-2 flex items-center gap-2 text-xs text-white md:hidden md:text-sm">
              {job?.majors?.majors?.slice(0, 2).map((major, index) => {
                if (job?.majors?.majors?.length > 2 && index === 1)
                  return (
                    <Badge key={major.id} className="rounded-xl bg-main">
                      {major.koName}
                      <span>{` 외 ${job?.majors?.majors?.length - 2}`}</span>
                    </Badge>
                  )

                return (
                  <Badge key={major.id} className="rounded-xl bg-main">
                    {major.koName}
                  </Badge>
                )
              })}
            </div>
          </div>
          <InfoItem
            title="주소"
            value={`${job.address} ${job.addressDetail}`}
          />
          <div className="flex">
            <span className="basis-1/5 text-sm font-semibold text-grayfont md:text-lg">
              일정
            </span>
            <div>
              {job.schedules?.map((schedule, index) => (
                <div
                  key={index}
                  className="flex flex-wrap gap-2 text-sm md:gap-4 md:text-lg"
                >
                  <span>
                    {filter.YYYYMMDD(
                      schedule.startAt,
                      "YYYY년 MM월 DD일 (ddd)",
                    )}
                  </span>
                  <span>시간</span>
                  <span>
                    {filter.YYYYMMDD(schedule.startAt, "HH:mm ~ ")}
                    {filter.YYYYMMDD(schedule.endAt, "HH:mm")}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="my-6 flex justify-end gap-2">
            <ItemManageBox
              handleEdit={() => router.push(`${pathname}?type=edit`)}
              handleDelete={() =>
                setIsDeleteConfirmDialog(!isDeleteConfirmDialog)
              }
              className="h-10"
            />
            <button
              onClick={updateStatus}
              className={`rounded border border-whitesmoke px-4 py-2 text-sm font-semibold md:text-lg ${job.isActive ? "text-main" : "text-grayfont"}`}
            >
              {job.isActive ? "진행중" : "마감"}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 border-b border-whitesmoke" />
            {!isQualificationLoading ? (
              <button
                onClick={handleApplyDialog}
                className="text-sm font-semibold text-main md:text-lg"
              >
                연주신청
              </button>
            ) : (
              <Spinner />
            )}
            <div className="flex-1 border-b-2 border-whitesmoke" />
          </div>
        </div>
      </div>
    </div>
  )
}
