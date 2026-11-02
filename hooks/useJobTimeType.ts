import { JobTimeType } from "@/types/jobs"
import { useRouter, useSearchParams } from "next/navigation"

export const useJobTimeType = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // 아마추어·소년소녀 채용은 없어졌다 — 예전 링크(?jobTimeType=AMATEUR|YOUTH)는 정규직으로 보여준다
  const param = searchParams.get("jobTimeType") as JobTimeType | null
  const jobTimeType =
    param === JobTimeType.PART_TIME ? JobTimeType.PART_TIME : JobTimeType.FULL_TIME

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
