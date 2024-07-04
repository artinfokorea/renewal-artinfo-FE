"use client"
import { deleteJob, updateArtOrganization } from "@/apis/jobs"
import AlertDialog from "@/components/dialog/AlertDialog"
import DetailContainer from "@/components/jobs/DetailContainer"
import FullTimeJobForm, {
  CreateFulltimeJobFormData,
} from "@/components/jobs/FullTimeJobForm"
import { Button } from "@/components/ui/button"
import useToast from "@/hooks/useToast"
import { queries } from "@/lib/queries"
import { JobType } from "@/types/jobs"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useLoading } from "@toss/use-loading"
import { useSession } from "next-auth/react"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useEffect, useState } from "react"

const page = () => {
  const params = useParams()
  const { successToast, errorToast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pageType = searchParams.get("type") as "edit" | "create"
  const jobType = searchParams.get("jobType") as JobType
  const [isHandleFormLoading, handleFormTransition] = useLoading()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { data } = useSession()

  const { data: job } = useSuspenseQuery(queries.jobs.detail(Number(params.id)))

  const handleDeleteJob = async () => {
    try {
      await deleteJob(Number(params.id))
      successToast("채용이 삭제되었습니다.")
      queryClient.invalidateQueries({
        queryKey: queries.jobs._def,
      })
      router.push(pathname.slice(0, pathname.lastIndexOf("/")))
    } catch (error: any) {
      errorToast(error.message)
      console.log("error", error)
    }
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
    } = payload

    try {
      await handleFormTransition(
        updateArtOrganization(Number(params.id), {
          title,
          companyName,
          address,
          addressDetail,
          imageUrl: imageUrl || "",
          majorIds: majors.map(major => major.id),
          contents,
          type: jobType,
        }),
      )
      successToast("채용이 수정되었습니다.")
      queryClient.invalidateQueries({
        queryKey: queries.jobs._def,
      })
      router.push(pathname.slice(0, pathname.lastIndexOf("/")))
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    if (!data) {
      setIsLoginModalOpen(true)
    }
  }, [data])

  return (
    <section>
      {pageType === "edit" ? (
        <FullTimeJobForm
          handleFullTimeJob={handleUpdateFulltimeJob}
          isLoading={isHandleFormLoading}
          job={job}
          withImage={jobType !== JobType.RELIGION}
        />
      ) : (
        <DetailContainer job={job} deleteJob={handleDeleteJob} />
      )}
      <AlertDialog
        isOpen={isLoginModalOpen}
        handleDialog={() => router.push("/auth/sign-in")}
        title="로그인이 필요합니다."
      >
        <div className="my-4 flex flex-col justify-center gap-4">
          <p className="text-sm text-silver md:text-base">
            채용 상세를 확인하려면 로그인이 필요합니다.
          </p>
          <Button
            onClick={() => router.push("/auth/sign-in")}
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
