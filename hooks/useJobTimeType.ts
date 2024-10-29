import { JobTimeType } from "@/types/jobs"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export const useJobTimeType = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [jobTimeType, setJobTimeType] = useState<JobTimeType>(
    (searchParams.get("jobTimeType") as JobTimeType) || JobTimeType.FULL_TIME,
  )

  const handleJobTimeTypeChange = (value: JobTimeType) => {
    setJobTimeType(value)
  }

  useEffect(() => {
    const locationParams = new URLSearchParams()
    locationParams.set("jobTimeType", jobTimeType)
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`
    router.push(newUrl, {
      scroll: false,
    })
  }, [jobTimeType])

  return {
    jobTimeType,
    handleJobTimeTypeChange,
  }
}
