"use client"

import React from "react"
import { JobType, JobTypeList } from "@/types/jobs"
import { createFullTimeJob } from "@/services/jobs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { queries } from "@/lib/queries"
import FullTimeJobForm, {
  CreateFulltimeJobFormData,
} from "@/components/jobs/FullTimeJobForm"
import useMutation from "@/hooks/useMutation"
import { JobPayload } from "@/interface/jobs"
import FormTypeSelectDialog from "@/components/dialog/FormTypeSelectDialog"

const page = () => {
  const searchParams = useSearchParams()
  const jobType = searchParams.get("jobType") as JobType
  const pathname = usePathname()
  const router = useRouter()

  const { handleSubmit, isLoading } = useMutation<JobPayload>({
    createFn: (payload: JobPayload) => createFullTimeJob(payload),
    queryKey: [...queries.jobs._def],
    redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
    successMessage: {
      create: "채용이 등록되었습니다.",
    },
  })

  console.log("jobType", jobType)

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
      {!jobType ? (
        <FormTypeSelectDialog<JobType>
          handleSelected={(jobType: JobType) =>
            router.push(`${pathname}?jobType=${jobType}`)
          }
          label="채용 선택"
          list={JobTypeList}
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
