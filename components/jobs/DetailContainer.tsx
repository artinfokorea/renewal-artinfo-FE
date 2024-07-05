"use client"

import { queries } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import React, { useState } from "react"
import { Badge } from "../ui/badge"
import filters from "@/lib/filters"
import FallbackImage from "../common/FallbackImage"
import ItemManageBox from "../common/ItemManageBox"
import ConfirmDialog from "../dialog/ConfirmDialog"
import { JOB, JobType } from "@/types/jobs"
import { useSession } from "next-auth/react"

interface Props {
  deleteJob: () => void
  job?: JOB
}

const DetailContainer = ({ deleteJob, job }: Props) => {
  const filter = filters()
  const router = useRouter()
  const { data } = useSession()
  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })
  const pathname = usePathname()
  const [isDeleteConfirmDialog, setIsDeleteConfirmDialog] = useState(false)

  return (
    <div className="mx-auto mt-4 max-w-screen-lg px-4 md:px-8">
      <div className="flex flex-col md:flex-row">
        {job?.imageUrl && (
          <div className="relative h-[244px] w-full md:w-[400px]">
            <FallbackImage
              src={job?.imageUrl}
              alt="job_image"
              fill
              fallbackText={job.companyName}
              quality={100}
              sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
              className="rounded-xl"
            />
          </div>
        )}
        <div
          className={`flex flex-1 flex-col justify-center gap-2 py-2 md:gap-4 ${
            job?.type !== JobType.RELIGION && "md:ml-12"
          }`}
        >
          <h4 className="mt-4 break-words text-xl font-bold md:mt-0">
            {job?.title}
          </h4>
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
          <p className="text-sm font-medium text-coolgray md:text-lg">
            {job?.address}
          </p>
          <div className="flex justify-between text-sm font-medium text-coolgray md:text-lg">
            <span>{job?.companyName}</span>
            <span>{filter.YYYYMMDD(job?.endAt)}</span>
          </div>
        </div>
      </div>
      {user?.id === job?.authorId ? (
        <div className="my-8 flex h-8 items-center gap-4 md:gap-6">
          <div className="w-full flex-1 border-b-2 border-whitesmoke" />
          <ItemManageBox
            handleEdit={() =>
              router.push(`${pathname}?type=edit&jobType=${job?.type}`)
            }
            handleDelete={() =>
              setIsDeleteConfirmDialog(!isDeleteConfirmDialog)
            }
            className="h-10"
          />
        </div>
      ) : (
        <div className="mx-4 my-8 flex-1 border-b-2 border-whitesmoke md:mx-0" />
      )}
      {job?.contents && (
        <div
          dangerouslySetInnerHTML={{
            __html: filter.URLFY(job?.contents) as string,
          }}
        />
      )}
      <ConfirmDialog
        isOpen={isDeleteConfirmDialog}
        handleDialog={() => setIsDeleteConfirmDialog(!isDeleteConfirmDialog)}
        title="채용 삭제"
        description="채용을 삭제하시겠습니까?"
        action={deleteJob}
      />
    </div>
  )
}

export default DetailContainer
