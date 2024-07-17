"use client"
import { deleteJob, updateArtOrganization } from "@/apis/jobs"
import AlertDialog from "@/components/dialog/AlertDialog"
import DetailContainer from "@/components/jobs/DetailContainer"
import FullTimeJobForm, {
  CreateFulltimeJobFormData,
} from "@/components/jobs/FullTimeJobForm"
import { Button } from "@/components/ui/button"
import { queries } from "@/lib/queries"
import { JobType } from "@/types/jobs"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import useMutation from "@/hooks/useMutation"
import { JobPayload } from "@/interface/jobs"

const page = () => {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pageType = searchParams.get("type") as "edit" | "create"
  const jobType = searchParams.get("jobType") as JobType
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { data } = useSession()

  const { handleForm, isLoading, handleDelete } = useMutation<JobPayload>({
    updateFn: (jobId: number, payload: JobPayload) =>
      updateArtOrganization(jobId, payload),
    deleteFn: (jobId: number) => deleteJob(jobId),
    queryKey: [...queries.jobs._def],
    redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
    successMessage: "채용이 등록되었습니다.",
  })

  const { data: job } = useSuspenseQuery(queries.jobs.detail(Number(params.id)))

  const handleDeleteJob = async () => {
    handleDelete(Number(params.id))
  }

  const handleUpdateFulltimeJob = async (
    payload: CreateFulltimeJobFormData,
  ) => {
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
    handleForm(
      {
        title,
        companyName,
        address,
        addressDetail,
        imageUrl: imageUrl || "",
        majorIds: majors.map(major => major.id),
        contents,
        type: jobType,
        recruitSiteUrl: recruitSiteUrl || "",
      },
      Number(params.id),
    )
  }

  const handleAlertDialog = () => {
    Cookies.set("prevPath", pathname, { expires: 1 / 288 })
    router.push("/auth/sign-in")
  }

  useEffect(() => {
    setIsLoginModalOpen(!data)
  }, [data])

  return (
    <section>
      {pageType === "edit" ? (
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
      </AlertDialog>
    </section>
  )
}

export default page
