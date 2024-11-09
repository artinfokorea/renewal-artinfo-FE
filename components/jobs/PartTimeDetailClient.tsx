"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import AlertDialog from "../dialog/AlertDialog"
import { Button } from "../ui/button"
import Cookies from "js-cookie"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { PartTimeDetailContainer } from "./PartTimeDetailContainer"
import { PartTimeApplyDialog } from "../dialog/PartTimeApplyDialog"
import { useLoading } from "@toss/use-loading"
import { getLessonQualification } from "@/services/lessons"
import {
  applyPartTimeJob,
  deleteJob,
  updateJobStatus,
  updatePartTimeJob,
} from "@/services/jobs"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { PartTimeUpdatePayload } from "@/interface/jobs"
import useMutation from "@/hooks/useMutation"
import { PartTimeForm, PartTimeFormData } from "./PartTimeForm"
import { JobTimeType } from "@/types/jobs"
import useToast from "@/hooks/useToast"

export const PartTimeDetailClient = () => {
  const { data } = useSession()
  const params = useParams()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const { successToast, errorToast } = useToast()
  const type = searchParams.get("type") || "read"
  const router = useRouter()
  const pathname = usePathname()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isApplyDialog, setIsApplyDialog] = useState(false)
  const [isQualificationDialog, setIsQualificationDialog] = useState(false)
  const [isQualificationLoading, qualificationTransition] = useLoading()

  const { handleSubmit, isLoading, handleDelete } =
    useMutation<PartTimeUpdatePayload>({
      updateFn: (jobId: number, payload: PartTimeUpdatePayload) =>
        updatePartTimeJob(jobId, payload),
      deleteFn: (jobId?: number) => deleteJob(jobId as number),
      queryKey: [...queries.jobs._def],
      redirectPath: `/jobs?jobTimeType=${JobTimeType.PART_TIME}`,
      successMessage: {
        update: "채용이 수정되었습니다.",
        delete: "채용이 삭제되었습니다.",
      },
    })

  useEffect(() => {
    setIsLoginModalOpen(!data)
  }, [data])

  const handleDeleteJob = async () => {
    handleDelete(Number(params.id))
  }

  const { data: job } = useSuspenseQuery({
    ...queries.jobs.detail(Number(params.id)),
  })

  const handleAlertDialog = () => {
    Cookies.set("prevPath", pathname, { expires: 1 / 288 })
    router.push("/auth/sign-in")
  }

  const handleUpdatePartTimeStatus = async () => {
    try {
      await updateJobStatus(job.id, !job.isActive)
      queryClient.invalidateQueries({ queryKey: [...queries.jobs._def] })
      successToast("채용 상태가 변경되었습니다.")
    } catch (error) {
      errorToast("채용 상태 변경에 실패하였습니다.")
      console.log(error)
    }
  }

  const partTimeApply = async (profile: string) => {
    try {
      await applyPartTimeJob(job.id, profile)
      successToast("채용 신청이 완료되었습니다.")
    } catch (error) {
      errorToast("채용 신청에 실패하였습니다.")
      console.log(error)
    }
  }

  const handleUpdateSubmit = async (payload: PartTimeFormData) => {
    const { majors, schedules } = payload

    await handleSubmit(
      {
        ...payload,
        majorIds: majors.map(major => major.id),
        isActive: true,
        schedules: schedules?.map(schedule => ({
          startAt: new Date(schedule.date + "T" + schedule.startTime),
          endAt: new Date(schedule.date + "T" + schedule.endTime),
        })),
      },
      Number(params.id),
    )
    router.refresh()
  }

  const handleApplyDialog = async () => {
    try {
      await qualificationTransition(getLessonQualification())
      setIsApplyDialog(!isApplyDialog)
    } catch (error) {
      setIsQualificationDialog(true)
    }
  }

  return (
    <section>
      {type === "read" ? (
        <PartTimeDetailContainer
          job={job}
          isQualificationLoading={isQualificationLoading}
          handleApplyDialog={handleApplyDialog}
          handleDeleteJob={handleDeleteJob}
          handleUpdatePartTimeStatus={handleUpdatePartTimeStatus}
        />
      ) : (
        <PartTimeForm
          isLoading={isLoading}
          handleSubmitForm={handleUpdateSubmit}
          partTime={job}
        />
      )}

      <AlertDialog
        isOpen={isLoginModalOpen}
        handleDialog={handleAlertDialog}
        title="로그인이 필요합니다."
      >
        <div className="my-4 flex flex-col justify-center gap-4">
          <p className="text-sm text-silver md:text-base">
            채용 상세를 확인하려면 로그인이 필요합니다.
          </p>
          <Button
            onClick={handleAlertDialog}
            className="bg-main text-white hover:bg-blue-600"
          >
            로그인
          </Button>
        </div>
      </AlertDialog>
      <AlertDialog
        title="연주 신청 권한이 없습니다."
        isOpen={isQualificationDialog}
        handleDialog={() => router.push("/my-profile")}
      >
        <div className="my-4 flex flex-col justify-center gap-4">
          <p className="text-sm text-silver md:text-base">
            프로필(전공, 학력, 연락처)를 작성해 주세요.
          </p>
          <Button
            onClick={() => router.push("/my-profile")}
            className="bg-main text-white hover:bg-blue-600"
          >
            프로필로 이동하기
          </Button>
        </div>
      </AlertDialog>
      <PartTimeApplyDialog
        open={isApplyDialog}
        close={() => setIsApplyDialog(false)}
        handleApply={partTimeApply}
      />
    </section>
  )
}
