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

interface Props {
  deleteJob: () => void
  job?: JOB
}

const DetailContainer = ({ deleteJob, job }: Props) => {
  const filter = filters()
  const router = useRouter()
  const { data: user } = useQuery(queries.users.detail())
  const pathname = usePathname()
  const [isDeleteConfirmDialog, setIsDeleteConfirmDialog] = useState(false)

  return (
    <div className="mt-4 px-4 md:px-8 max-w-screen-lg mx-auto">
      <div className="flex flex-col md:flex-row">
        {job?.imageUrl && (
          <div className="h-[244px] relative w-full md:w-[400px]">
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
          className={`py-2 flex-1 flex flex-col justify-center gap-2 md:gap-4 ${
            job?.type !== JobType.RELIGION && "md:ml-12"
          }`}
        >
          <h4 className="text-xl font-bold break-words mt-4 md:mt-0">
            {job?.title}
          </h4>
          <div className="hidden md:flex my-2 items-center text-xs md:text-sm gap-2 text-white">
            {job?.majors?.majors?.slice(0, 3).map((major, index) => {
              if (job?.majors?.majors?.length > 3 && index === 2)
                return (
                  <Badge key={major.id} className="bg-main rounded-xl">
                    <span>
                      {`${major.koName} 외 ${job?.majors?.majors.length - 3}`}
                    </span>
                  </Badge>
                )

              return (
                <Badge key={major.id} className="bg-main rounded-xl">
                  {major.koName}
                </Badge>
              )
            })}
          </div>
          <div className="flex md:hidden my-2 items-center text-xs md:text-sm gap-2 text-white">
            {job?.majors?.majors?.slice(0, 2).map((major, index) => {
              if (job?.majors?.majors?.length > 2 && index === 1)
                return (
                  <Badge key={major.id} className="bg-main rounded-xl">
                    {major.koName}
                    <span>{` 외 ${job?.majors?.majors?.length - 2}`}</span>
                  </Badge>
                )

              return (
                <Badge key={major.id} className="bg-main rounded-xl">
                  {major.koName}
                </Badge>
              )
            })}
          </div>
          <p className="text-coolgray text-sm md:text-lg font-medium">
            {job?.address}
          </p>
          <div className="flex justify-between text-coolgray text-sm md:text-lg font-medium">
            <span>{job?.companyName}</span>
            <span>{filter.YYYYMMDD(job?.endAt)}</span>
          </div>
        </div>
      </div>
      {user?.id === job?.authorId ? (
        <div className="flex my-8 h-8 items-center gap-4 md:gap-6">
          <div className="flex-1 border-b-2 border-whitesmoke w-full" />
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
        <div className="my-8" />
      )}
      {job?.contents && (
        <div dangerouslySetInnerHTML={{ __html: job.contents }}></div>
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
