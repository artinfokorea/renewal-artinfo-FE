"use client"

import { queries } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import React, { useState } from "react"
import filters from "@/lib/filters"
import useToast from "@/hooks/useToast"
import { LESSON, SchoolType, SchoolTypeValues } from "@/types/lessons"
import { Badge } from "../ui/badge"
import { useSession } from "next-auth/react"
import ItemManageBox from "../common/ItemManageBox"
import { usePathname, useRouter } from "next/navigation"
import ConfirmDialog from "../dialog/ConfirmDialog"
import FallbackImage from "../common/FallbackImage"
import AlertDialog from "../dialog/AlertDialog"
import { Button } from "../ui/button"
import { LessonApplyDialog } from "../dialog/LessonApplyDialog"
import { lessonApply } from "@/services/lessons"
import { useLoading } from "@toss/use-loading"

interface Props {
  lesson: LESSON
  deleteLesson: () => void
}

const LessonDetailContainer = ({ lesson, deleteLesson }: Props) => {
  const [isDeleteConfirmDialog, setIsDeleteConfirmDialog] = useState(false)
  const [isApplyDialog, setIsApplyDialog] = useState(false)
  const [isPhoneEmpty, setIsPhoneEmpty] = useState(false)
  const filter = filters()
  const { successToast, errorToast } = useToast()
  const { data, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, startTransition] = useLoading()

  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })

  const checkPhone = () => {
    if (!user?.phone) {
      setIsPhoneEmpty(true)
    } else {
      setIsApplyDialog(true)
    }
  }

  const handleApply = async (contents: string) => {
    try {
      await startTransition(
        lessonApply({
          teacherId: lesson.authorId,
          contents,
        }),
      )

      successToast("레슨 신청이 완료되었습니다.")
      setIsApplyDialog(false)
    } catch (error) {
      console.error(error)
      errorToast("레슨 신청에 실패했습니다.")
    }
  }

  return (
    <div className="mt-8 md:mt-16 md:px-4">
      <div className="flex flex-col md:flex-row md:gap-24">
        {lesson?.imageUrl && (
          <div className="relative mx-auto h-[320px] w-[240px] md:h-[300px] md:w-[220px]">
            <FallbackImage
              src={lesson?.imageUrl}
              alt="lesson_image"
              fill
              style={{ objectFit: "cover" }}
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
                {lesson?.majors?.map(major => (
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
              <div>
                <button
                  className="text-base font-semibold leading-7 text-main hover:underline"
                  onClick={checkPhone}
                >
                  레슨 문의하기
                </button>
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

      <div className="flex flex-col gap-4 px-4 md:min-h-[400px] md:flex-row md:gap-8 md:px-0">
        <div className="min-h-[300px] w-full overflow-hidden rounded-md bg-whitesmoke p-4 md:p-8">
          <p className="mb-3 text-lg font-semibold text-coolgray md:mb-6">
            전문가 소개
          </p>
          <div
            className="whitespace-pre-wrap rounded-lg p-2"
            dangerouslySetInnerHTML={{
              __html: (filter.URLFY(lesson?.introduction) as string) || "",
            }}
          />
        </div>
        <div
          className={`min-h-[300px] w-full overflow-hidden rounded-md bg-whitesmoke p-4 md:p-8 ${lesson?.career ? "block" : "hidden"}`}
        >
          <p className="mb-3 text-lg font-semibold text-coolgray md:mb-6">
            경력
          </p>
          <div
            className="whitespace-pre-wrap rounded-lg p-2"
            dangerouslySetInnerHTML={{
              __html: (filter.URLFY(lesson?.career) as string) || "",
            }}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteConfirmDialog}
        handleDialog={() => setIsDeleteConfirmDialog(!isDeleteConfirmDialog)}
        title="레슨 삭제"
        description="레슨을 삭제하시겠습니까?"
        action={deleteLesson}
      />
      <AlertDialog
        title={
          status === "unauthenticated"
            ? "로그인이 필요합니다."
            : "레슨 신청을 위해 연락처를 등록해 주세요."
        }
        isOpen={isPhoneEmpty}
        handleDialog={() => {
          if (status === "unauthenticated") {
            router.push("/auth/sign-in")
          } else {
            router.push("/my-profile")
          }
        }}
      >
        <div className="my-4 flex flex-col justify-center gap-4">
          {status === "unauthenticated" && (
            <p className="text-sm text-silver md:text-base">
              레슨 문의를 위해 로그인이 필요합니다.
            </p>
          )}
          <Button
            onClick={() => {
              if (status === "unauthenticated") {
                router.push("/auth/sign-in")
              } else {
                router.push("/my-profile")
              }
            }}
            className="bg-main text-white hover:bg-blue-600"
          >
            {status === "unauthenticated" ? "로그인" : "프로필로 이동하기"}
          </Button>
        </div>
      </AlertDialog>
      <LessonApplyDialog
        isLoading={isLoading}
        open={isApplyDialog}
        close={() => setIsApplyDialog(false)}
        handleApply={handleApply}
      />
    </div>
  )
}

export default LessonDetailContainer
