"use client"

import React from "react"
import { JobType } from "@/types/jobs"
import { createFullTimeJob } from "@/services/jobs"
import { usePathname, useSearchParams } from "next/navigation"
import { queries } from "@/lib/queries"
import FullTimeJobForm, {
  CreateFulltimeJobFormData,
} from "@/components/jobs/FullTimeJobForm"
import useMutation from "@/hooks/useMutation"
import { JobPayload } from "@/interface/jobs"

const page = () => {
  const searchParams = useSearchParams()
  // 다른 화면에서 ?jobType= 로 넘어오면 그 분류로 시작 (분류 선택은 폼 안의 세그먼트)
  const initialType = searchParams.get("jobType") as JobType | null
  const pathname = usePathname()

  const { handleSubmit, isLoading } = useMutation<JobPayload>({
    createFn: (payload: JobPayload) => createFullTimeJob(payload),
    queryKey: [...queries.jobs._def],
    redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
    successMessage: {
      create: "채용이 등록되었습니다.",
    },
  })

  const handleFullTimeJob = async (payload: CreateFulltimeJobFormData, jobType: JobType) => {
    const {
      title,
      companyName,
      address,
      addressDetail,
      imageUrl,
      majors,
      contents,
      recruitSiteUrl,
    } = payload
    handleSubmit({
      title,
      companyName,
      address,
      addressDetail,
      imageUrl: imageUrl || "",
      majorIds: majors.map(major => major.id),
      contents,
      type: jobType,
      recruitSiteUrl: recruitSiteUrl || "",
    })
  }

  return (
    <section>
      <FullTimeJobForm
        handleFullTimeJob={handleFullTimeJob}
        isLoading={isLoading}
        initialType={initialType && Object.values(JobType).includes(initialType) ? initialType : undefined}
      />
    </section>
  )
}

export default page
