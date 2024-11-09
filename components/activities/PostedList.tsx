import React, { useState } from "react"
import { queries } from "@/lib/queries"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Button } from "@headlessui/react"
import filters from "@/lib/filters"
import { useRouter } from "next/navigation"
import { updateJobStatus } from "@/services/jobs"
import useToast from "@/hooks/useToast"
import { JOB } from "@/types/jobs"
import ApplicantsList from "./ApplicantsList"

export const PostedList = () => {
  const filter = filters()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { successToast, errorToast } = useToast()

  const [showApplicantsMap, setShowApplicantsMap] = useState<{
    [key: number]: boolean
  }>({})

  const toggleApplicants = (jobId: number) => {
    setShowApplicantsMap(prev => ({
      ...prev,
      [jobId]: !prev[jobId],
    }))
  }

  const goToDetail = (id: number) => {
    router.push(`/jobs/part-time/${id}`)
  }

  const handleUpdatePartTimeStatus = async (job: JOB) => {
    try {
      await updateJobStatus(job.id, !job.isActive)
      queryClient.invalidateQueries({ queryKey: [...queries.jobs._def] })
      successToast("채용 상태가 변경되었습니다.")
    } catch (error) {
      errorToast("채용 상태 변경에 실패하였습니다.")
      console.log(error)
    }
  }

  const { data: myActivities } = useSuspenseQuery(
    queries.jobs.myActivities({ page: 1, size: 10 }),
  )

  return (
    <section className="flex flex-col gap-4">
      {myActivities.jobs.length === 0 ? (
        <div>데이터가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {myActivities.jobs.map(job => (
            <>
              <div
                key={job.id}
                className="relative z-10 flex flex-col gap-4 rounded border border-lightgray p-4 shadow-md"
              >
                {/* <div className="absolute inset-0 z-20 rounded bg-gray-500/50" /> */}
                <span>{job.title}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleApplicants(job.id)}
                    className="rounded border px-2 py-1 text-main"
                  >
                    신청자
                  </Button>
                  <Button
                    onClick={() => handleUpdatePartTimeStatus(job)}
                    className={`rounded border px-2 py-1 ${job.isActive ? "text-main" : "text-grayfont"}`}
                  >
                    {job.isActive ? "진행중" : "마감"}
                  </Button>
                  <Button
                    onClick={() => goToDetail(job.id)}
                    className="rounded border px-2 py-1 text-main"
                  >
                    바로가기
                  </Button>
                </div>
                <div className="flex justify-end">
                  <span>{filter.YYYYMMDD(job.createdAt)}</span>
                </div>
              </div>
              {showApplicantsMap[job.id] && <ApplicantsList jobId={job.id} />}
            </>
          ))}
        </div>
      )}
    </section>
  )
}
