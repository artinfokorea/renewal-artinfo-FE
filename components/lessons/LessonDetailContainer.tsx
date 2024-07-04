"use client"

import { queries } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import React, { useState } from "react"
import Image from "next/image"
import filters from "@/lib/filters"
import ClipBoardIcon from "../icons/ClipBoardIcon"
import useToast from "@/hooks/useToast"
import { clipboard } from "@toss/utils"
import { LESSON, SchoolType, SchoolTypeValues } from "@/types/lessons"
import { Badge } from "../ui/badge"
import { useSession } from "next-auth/react"
import ItemManageBox from "../common/ItemManageBox"
import { usePathname, useRouter } from "next/navigation"
import ConfirmDialog from "../dialog/ConfirmDialog"

interface Props {
  lesson: LESSON
  deleteLesson: () => void
}

const LessonDetailContainer = ({ lesson, deleteLesson }: Props) => {
  const [isPhoneShow, setIsPhoneShow] = useState(false)
  const [isDeleteConfirmDialog, setIsDeleteConfirmDialog] = useState(false)
  const filter = filters()
  const { successToast } = useToast()
  const { data } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })

  const copyToPhone = async () => {
    const isSuccess = await clipboard.writeText(lesson?.phone as string)

    if (isSuccess) {
      successToast("연락처가 복사되었습니다.")
    }
  }

  return (
    <div className="mt-8 md:mt-16 md:px-4">
      <div className="flex flex-col md:flex-row md:gap-24">
        {lesson?.imageUrl && (
          <div className="relative mx-auto h-[360px] w-[300px] md:h-[300px] md:w-[240px]">
            <Image
              src={lesson?.imageUrl}
              alt="lesson_image"
              fill
              priority
              quality={100}
              className="rounded-md"
              sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
            />
          </div>
        )}
        <div className="flex-1 p-4 md:p-0">
          <h4 className="mt-4 text-center text-2xl font-bold md:mt-0 md:text-left">
            {lesson?.name}
          </h4>
          {user?.id === lesson?.authorId && (
            <div className="my-2 flex h-8 items-center gap-4 md:hidden md:gap-6">
              <div className="w-full flex-1 border-b-2 border-whitesmoke" />
              <ItemManageBox
                handleEdit={() => router.push(`${pathname}?type=edit`)}
                handleDelete={() =>
                  setIsDeleteConfirmDialog(!isDeleteConfirmDialog)
                }
                className="h-10"
              />
            </div>
          )}
          <div className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
            <div className="flex items-center gap-4 text-base md:text-lg">
              <span className="font-bold">전공</span>
              <div>
                {lesson?.majors?.map((major, index) => (
                  <Badge
                    key={major}
                    className="mx-1 rounded-xl bg-main text-xs text-white md:text-sm"
                  >
                    {major}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 text-base md:text-lg">
              <span className="font-bold">가격</span>
              <div>
                <span className="font-medium">
                  {filter.FEECOMMA(lesson?.pay as number)}원
                </span>
                <span className="text-xs"> (1회)</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-base md:text-lg">
              <span className="font-bold">학력</span>

              {lesson?.schools?.map(school => (
                <div
                  key={school.id}
                  className="mb-2 flex items-center gap-6 md:gap-12"
                >
                  <img
                    src={
                      school.type === SchoolType.UNDERGRADUATE
                        ? "/icon/bachelor.png"
                        : school.type === SchoolType.MASTER
                          ? "/icon/master.png"
                          : "/icon/doctor.png"
                    }
                    alt="school_image"
                    className="h-[30px] w-[30px]"
                  />
                  <div>
                    <h5 className="text-base font-semibold text-primary">
                      {school.name}
                    </h5>
                    <p className="text-sm text-coolgray">
                      {SchoolTypeValues[school.type]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-base md:text-lg">
                <span className="font-bold">연락처</span>
                {isPhoneShow ? (
                  <div className="ml-4 flex items-center font-medium">
                    <span>{lesson?.phone}</span>
                    <button onClick={copyToPhone}>
                      <ClipBoardIcon className="ml-2 w-4 pb-1" />
                    </button>
                  </div>
                ) : (
                  <button
                    className="font-semibold text-main"
                    onClick={() => setIsPhoneShow(!isPhoneShow)}
                  >
                    연락처보기
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2 text-base md:text-lg">
                <span className="font-bold">지역</span>
                <div>
                  {lesson?.areas?.map((area, index) => (
                    <span key={area} className="text-sm">
                      {index === (lesson.areas && lesson.areas?.length - 1)
                        ? area
                        : `${area}, `}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {user?.id === lesson?.authorId ? (
        <div className="my-8 hidden h-8 items-center gap-4 md:flex md:gap-6">
          <div className="w-full flex-1 border-b border-whitesmoke" />
          <ItemManageBox
            handleEdit={() => router.push(`${pathname}?type=edit`)}
            handleDelete={() =>
              setIsDeleteConfirmDialog(!isDeleteConfirmDialog)
            }
            className="h-10"
          />
        </div>
      ) : (
        <div className="mx-4 my-8 flex-1 border-b-2 border-whitesmoke md:mx-0" />
      )}

      <div className="flex flex-col gap-4 px-4 md:flex-row md:gap-8 md:px-0">
        <div className="min-h-[200px] overflow-y-auto rounded-md bg-whitesmoke p-4 md:h-[380px] md:w-1/2 md:p-8">
          <p className="mb-3 text-lg font-semibold text-coolgray md:mb-6">
            전문가 소개
          </p>
          <p className="min-h-[120px] whitespace-pre-wrap rounded-lg p-2 md:h-[260px]">
            {lesson?.introduction}
          </p>
        </div>
        <div className="min-h-[200px] overflow-y-auto rounded-md bg-whitesmoke p-4 md:h-[380px] md:w-1/2 md:p-8">
          <p className="mb-3 text-lg font-semibold text-coolgray md:mb-6">
            경력
          </p>
          <p className="min-h-[120px] whitespace-pre-wrap rounded-lg p-2 md:h-[260px]">
            {lesson?.career}
          </p>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteConfirmDialog}
        handleDialog={() => setIsDeleteConfirmDialog(!isDeleteConfirmDialog)}
        title="레슨 삭제"
        description="레슨을 삭제하시겠습니까?"
        action={deleteLesson}
      />
    </div>
  )
}

export default LessonDetailContainer
