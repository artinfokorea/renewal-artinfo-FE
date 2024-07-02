"use client"
import { deleteJob, updateArtOrganization } from "@/apis/jobs"
import DetailContainer from "@/components/jobs/DetailContainer"
import FullTimeJobForm, {
  CreateFulltimeJobFormData,
} from "@/components/jobs/FullTimeJobForm"
import ReligionForm from "@/components/jobs/ReligionForm"
import useToast from "@/hooks/useToast"
import { queries } from "@/lib/queries"
import { JobType } from "@/types/jobs"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useLoading } from "@toss/use-loading"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"

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
    </section>
  )
}

export default page
