"use client"

import { PartTimeForm, PartTimeFormData } from "@/components/jobs/PartTimeForm"
import useMutation from "@/hooks/useMutation"
import { PartTimeCreatePayload } from "@/interface/jobs"
import { queries } from "@/lib/queries"
import { createPartTimeJob } from "@/services/jobs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"

const page = () => {
  const pathname = usePathname()
  const router = useRouter()

  const { handleSubmit, isLoading } = useMutation<PartTimeCreatePayload>({
    createFn: (payload: PartTimeCreatePayload) => createPartTimeJob(payload),
    queryKey: [...queries.jobs._def],
    successMessage: {
      create: "단기 채용 공고가 등록되었습니다.",
    },
  })

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
    </section>
  )
}

export default page
