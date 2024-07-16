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
              alt={`${job?.companyName}_job_image`}
              fill
              fallbackText={job.companyName}
              quality={100}
              sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
              className="rounded-xl"
            />
          </div>
        )}
        <div
          className={`flex flex-1 flex-col justify-center gap-2 py-2 ${
            job?.imageUrl && "md:ml-12"
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
          <div className="flex items-center justify-between text-sm font-medium text-coolgray md:text-lg">
            <span>{job?.companyName}</span>
            <span>{filter.YYYYMMDD(job?.createdAt)}</span>
          </div>
          {job?.recruitSiteUrl && (
            <a
              href={job?.recruitSiteUrl}
              target="_blank"
              className="text-sm font-bold text-main md:hidden md:text-lg"
            >
              채용 사이트 바로가기
            </a>
          )}
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
      ) : job?.recruitSiteUrl ? (
        <div className="my-8 flex items-center justify-center">
          <div className="flex-1 border-b-2 border-whitesmoke"></div>
          <a
            href={job?.recruitSiteUrl}
            target="_blank"
            className="mx-4 hidden text-base font-bold text-main md:inline md:text-lg"
          >
            채용 사이트 바로가기
          </a>
          <div className="flex-1 border-b-2 border-whitesmoke"></div>
        </div>
      ) : (
        <div className="my-8 flex flex-1 border-b-2 border-whitesmoke" />
      )}
      {job?.contents && (
        <div
          className="editor_view ck-content"
          dangerouslySetInnerHTML={{
            __html: job?.contents,
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
