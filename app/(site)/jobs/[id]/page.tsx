"use client"
import { deleteJob, updateArtOrganization, updateReligion } from "@/apis/jobs"
import DetailContainer from "@/components/jobs/DetailContainer"
import OrganizationForm, {
  CreateJobFormData,
} from "@/components/jobs/OrganizationForm"
import ReligionForm, {
  CreateReligionFormData,
} from "@/components/jobs/ReligionForm"
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

  const handleUpdateFulltimeJob = async (payload: CreateJobFormData) => {
    const {
      title,
      companyName,
      province,
      detailAddress,
      imageUrl,
      majors,
      contents,
    } = payload

    try {
      await handleFormTransition(
        updateArtOrganization(Number(params.id), {
          title,
          companyName,
          address: `${province} ${detailAddress}`,
          imageUrl,
          majorIds: majors.map(major => major.id),
          contents,
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

  const handleReligionJob = async (payload: CreateReligionFormData) => {
    const {
      title,
      contents,
      companyName,
      province,
      detailAddress,
      majors,
      fee,
    } = payload
    try {
      await handleFormTransition(
        updateReligion(Number(params.id), {
          title,
          companyName,
          address: `${province} ${detailAddress}`,
          majorId: majors[0].id as number,
          contents,
          fee,
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
      {pageType === "edit" &&
      (jobType === JobType.ART_ORGANIZATION || jobType === JobType.LECTURER) ? (
        <OrganizationForm
          handleFullTimeJob={handleUpdateFulltimeJob}
          isLoading={isHandleFormLoading}
          job={job}
        />
      ) : pageType === "edit" && jobType === JobType.RELIGION ? (
        <ReligionForm
          handleReligionJob={handleReligionJob}
          isLoading={isHandleFormLoading}
          job={job}
        />
      ) : (
        <DetailContainer job={job} deleteJob={handleDeleteJob} />
      )}
    </section>
  )
}

export default page
