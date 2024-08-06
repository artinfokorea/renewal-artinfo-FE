"use client"
import { deleteJob, updateArtOrganization } from "@/services/jobs"
import FullTimeJobForm, {
  CreateFulltimeJobFormData,
} from "@/components/jobs/FullTimeJobForm"
import { queries } from "@/lib/queries"

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useEffect, useState } from "react"
import useMutation from "@/hooks/useMutation"
import { JobPayload } from "@/interface/jobs"
import EventDetailContainer from "./EventDetailContainer"

const EventDetailClient = () => {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pageType = searchParams.get("type") as "edit" | "create"

  //     const { handleSubmit, isLoading, handleDelete } = useMutation<JobPayload>({
  //       updateFn: (jobId: number, payload: JobPayload) =>
  //         updateArtOrganization(jobId, payload),
  //       deleteFn: (jobId?: number) => deleteJob(jobId as number),
  //       queryKey: [...queries.jobs._def],
  //       redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
  //       successMessage: {
  //         create: "채용이 수정되었습니다.",
  //         delete: "채용이 삭제되었습니다.",
  //       },
  //     })

  //   const handleDeleteJob = async () => {
  //     handleDelete(Number(params.id))
  //   }

  //   const handleUpdateFulltimeJob = async (
  //     payload: CreateFulltimeJobFormData,
  //   ) => {
  //     const {
  //       title,
  //       companyName,
  //       address,
  //       addressDetail,
  //       imageUrl,
  //       majors,
  //       contents,
  //       recruitSiteUrl,
  //     } = payload
  //     handleSubmit(
  //       {
  //         title,
  //         companyName,
  //         address,
  //         addressDetail,
  //         imageUrl: imageUrl || "",
  //         majorIds: majors.map(major => major.id),
  //         contents,
  //         type: jobType,
  //         recruitSiteUrl: recruitSiteUrl || "",
  //       },
  //       Number(params.id),
  //     )
  //   }

  return (
    <section className="mx-auto max-w-screen-lg">
      <EventDetailContainer />
      {/* {pageType === "edit" ? (
        <FullTimeJobForm
          handleFullTimeJob={handleUpdateFulltimeJob}
          isLoading={isLoading}
          job={job}
          withImage={jobType !== JobType.RELIGION}
        />
      ) : (
        <DetailContainer job={job} deleteJob={handleDeleteJob} />
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
      </AlertDialog> */}
    </section>
  )
}

export default EventDetailClient
