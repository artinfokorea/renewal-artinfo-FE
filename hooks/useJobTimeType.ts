import { JobTimeType } from "@/types/jobs"
import { useRouter, useSearchParams } from "next/navigation"

export const useJobTimeType = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const jobTimeType =
    (searchParams.get("jobTimeType") as JobTimeType) || JobTimeType.FULL_TIME

  const handleJobTimeTypeChange = (value: JobTimeType) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("jobTimeType", value)
    router.push(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  return {
    jobTimeType,
    handleJobTimeTypeChange,
  }
}
