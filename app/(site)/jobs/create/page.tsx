"use client"

import React from "react"
import { JobType } from "@/types/jobs"
import useToast from "@/hooks/useToast"
import { createFullTimeJob } from "@/apis/jobs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLoading } from "@toss/use-loading"
import { useQueryClient } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import JobTypeSelectDialog from "@/components/jobs/JobTypeSelectDIalog"
import FullTimeJobForm, {
  CreateFulltimeJobFormData,
} from "@/components/jobs/FullTimeJobForm"

const page = () => {
  const searchParams = useSearchParams()
  const jobType = searchParams.get("jobType") as JobType
  const pathname = usePathname()
  const router = useRouter()
  const { errorToast, successToast } = useToast()
  const [isLoading, startTransition] = useLoading()
  const queryClient = useQueryClient()

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
    try {
      await startTransition(
        createFullTimeJob({
          title,
          companyName,
          address,
          addressDetail,
          imageUrl: imageUrl || "",
          majorIds: majors.map(major => major.id),
          contents,
          type: jobType,
          recruitSiteUrl: recruitSiteUrl || "",
        }),
      )
      successToast("채용이 등록되었습니다.")
      router.push(pathname.slice(0, pathname.lastIndexOf("/")))
      queryClient.invalidateQueries({
        queryKey: queries.jobs._def,
      })
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
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
