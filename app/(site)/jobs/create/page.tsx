"use client"

import React from "react"
import { JobType } from "@/types/jobs"
import { createFullTimeJob } from "@/services/jobs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { queries } from "@/lib/queries"
import JobTypeSelectDialog from "@/components/jobs/JobTypeSelectDIalog"
import FullTimeJobForm, {
  CreateFulltimeJobFormData,
} from "@/components/form/service/FullTimeJobForm"
import useMutation from "@/hooks/useMutation"
import { JobPayload } from "@/interface/jobs"

const page = () => {
  const searchParams = useSearchParams()
  const jobType = searchParams.get("jobType") as JobType
  const pathname = usePathname()
  const router = useRouter()

  const { handleForm, isLoading } = useMutation<JobPayload>({
    createFn: (payload: JobPayload) => createFullTimeJob(payload),
    queryKey: [...queries.jobs._def],
    redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
    successMessage: {
      create: "채용이 등록되었습니다.",
    },
  })

  const handleFullTimeJob = async (payload: CreateFulltimeJobFormData) => {
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
    handleForm({
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
      {!jobType ? (
        <JobTypeSelectDialog
          handleSelectedJobType={(jobType: JobType) =>
            router.push(`${pathname}?jobType=${jobType}`)
          }
        />
      ) : (
        <FullTimeJobForm
          handleFullTimeJob={handleFullTimeJob}
          isLoading={isLoading}
          withImage={jobType !== JobType.RELIGION}
        />
      )}
    </section>
  )
}

export default page
