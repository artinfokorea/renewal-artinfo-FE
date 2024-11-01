"use client"

import { PartTimeForm } from "@/components/jobs/PartTimeForm"
import useMutation from "@/hooks/useMutation"
import { PartTimeCreatePayload } from "@/interface/jobs"
import { queries } from "@/lib/queries"
import { createPartTimeJob } from "@/services/jobs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"

const page = () => {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") as "create" | "edit"
  const pathname = usePathname()
  const router = useRouter()

  const { handleSubmit, isLoading } = useMutation<PartTimeCreatePayload>({
    createFn: (payload: PartTimeCreatePayload) => createPartTimeJob(payload),
    queryKey: [...queries.jobs._def],
    successMessage: {
      create: "단기 채용 공고가 등록되었습니다.",
    },
  })

  const handleSubmitForm = async (payload: PartTimeCreatePayload) => {
    const newPartTimeJob = await handleSubmit(payload)
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
