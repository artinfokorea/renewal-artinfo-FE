"use client"

import { queries } from "@/lib/queries"
import { Button } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import React, { useState } from "react"
import { ChevronLeft, ChevronRight, PhoneIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import FallbackImage from "../common/FallbackImage"
import { Badge } from "../ui/badge"
import { SchoolTypeValues } from "@/types/lessons"

interface ApplicantsListProps {
  jobId: number
}

const ApplicantsList = ({ jobId }: ApplicantsListProps) => {
  const { data } = useQuery(queries.jobs.applicantList(jobId))
  const [page, setPage] = useState(0)

  const previousPage = () => {
    setPage(prev => prev - 1)
  }

  const nextPage = () => {
    setPage(prev => prev + 1)
  }

  return (
    <div className="flex flex-col border p-4">
      {data?.applicants.length === 0 ? (
        <div className="bg-white text-gray-700">신청자가 없습니다</div>
      ) : (
        <>
          <div className="flex items-center justify-center gap-4 md:mb-4 md:justify-end">
            <Button
              onClick={previousPage}
              disabled={page === 0}
              className="border disabled:text-gray-200"
            >
              <ChevronLeft className="text-gray-700" />
            </Button>
            <div className="border px-2 text-gray-700">
              <p>
                {page + 1} / {data?.applicants.length ?? 0}
              </p>
            </div>
            <Button
              onClick={nextPage}
              disabled={page === (data?.applicants.length ?? 0) - 1}
              className="border disabled:text-gray-200"
            >
              <ChevronRight className="text-gray-700" />
            </Button>
          </div>

          {data?.applicants[page] && (
            <div>
              <div className="flex flex-col md:flex-row">
                <Avatar className="mx-auto my-4 h-[150px] w-[150px] md:mx-4">
                  <FallbackImage
                    src={data.applicants[page].iconImageUrl}
                    alt="user_profile_image"
                    fill
                    sizes="150px"
                    quality={100}
                    priority
                    className="rounded-full"
                  />
                  <AvatarFallback>
                    <AvatarImage
                      src={"/img/placeholder-user.png"}
                      alt="user_profile_image"
                      className="h-[150px] w-[150px] rounded-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-4 px-6 md:flex-1 md:px-2">
                  <div className="flex gap-4">
                    <span className="basis-1/6 text-grayfont">이름</span>
                    <span className="basis-5/6">
                      {data.applicants[page].name}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="basis-1/6 text-grayfont">전공</span>
                    <div className="basis-5/6">
                      {data.applicants[page].majors?.map(major => (
                        <Badge
                          key={major.id}
                          className="mx-1 rounded-xl bg-main text-xs text-white md:text-sm"
                        >
                          {major.koName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="ml-1 basis-1/6">
                      <PhoneIcon className="h-5 w-5" />
                    </span>
                    <span className="basis-5/6">
                      {data.applicants[page].phone}
                    </span>
                  </div>
                </div>

                <div className="my-4 flex gap-4 px-6 md:my-0 md:flex-1 md:px-0">
                  <span className="basis-1/6 text-grayfont">학력</span>
                  <div className="basis-5/6">
                    {data.applicants[page].schools?.map(school => (
                      <div key={school.type} className="flex flex-col">
                        <span>{school.name}</span>
                        <span className="text-sm text-grayfont">
                          {SchoolTypeValues[school.type]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="mx-6 mt-6 border-b border-grayfont md:mx-2" />
                <div className="p-6 md:px-2">
                  <span className="text-grayfont">소개</span>
                  <p className="my-4">{data.applicants[page].profile}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ApplicantsList
