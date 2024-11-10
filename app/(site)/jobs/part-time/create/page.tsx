"use client"

import AlertDialog from "@/components/dialog/AlertDialog"
import { PartTimeForm, PartTimeFormData } from "@/components/jobs/PartTimeForm"
import useMutation from "@/hooks/useMutation"
import { PartTimeCreatePayload } from "@/interface/jobs"
import { queries } from "@/lib/queries"
import { createPartTimeJob } from "@/services/jobs"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

const page = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!session?.user,
  })

  const { handleSubmit, isLoading } = useMutation<PartTimeCreatePayload>({
    createFn: (payload: PartTimeCreatePayload) => createPartTimeJob(payload),
    queryKey: [...queries.jobs._def],
    successMessage: {
      create: "단기 채용 공고가 등록되었습니다.",
    },
  })

  useEffect(() => {
    if (!user?.phone) {
      setIsAlertDialogOpen(true)
    }
  }, [user])

  const handleSubmitForm = async (payload: PartTimeFormData) => {
    const { majors, schedules } = payload

    const newPartTimeJob = await handleSubmit({
      ...payload,
      majorIds: majors.map(major => major.id),
      schedules: schedules?.map(schedule => ({
        startAt: new Date(schedule.date + "T" + schedule.startTime),
        endAt: new Date(schedule.date + "T" + schedule.endTime),
      })),
    })
    if (newPartTimeJob) {
      router.push(
        `${pathname.slice(0, pathname.lastIndexOf("/"))}/${newPartTimeJob.item.id}`,
      )
    }
  }

  return (
    <section className="mx-auto max-w-screen-lg">
      <PartTimeForm handleSubmitForm={handleSubmitForm} isLoading={isLoading} />

      <AlertDialog
        isOpen={isAlertDialogOpen}
        handleDialog={() => router.push("/my-profile")}
        title="연주 등록은 휴대폰 번호를 통해 인증이 필요합니다."
      >
        <div className="my-4 flex flex-col justify-center gap-4">
          <p className="text-sm text-silver md:text-base">
            내 프로필에서 휴대폰 번호를 등록해주세요.
          </p>
          <Button
            onClick={() => router.push("/my-profile")}
            className="bg-main text-white hover:bg-blue-600"
          >
            로그인
          </Button>
        </div>
      </AlertDialog>
    </section>
  )
}

export default page
