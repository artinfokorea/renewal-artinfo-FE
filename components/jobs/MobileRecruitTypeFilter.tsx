import { JobType, JobTypeList } from "@/types/jobs"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

const MobileRecruitTypeFilter = () => {
  const searchParams = useSearchParams()
  const recruits = searchParams.getAll("recruit") as JobType[]
  const router = useRouter()
  const [selectedRecruits, setSelectedRecruits] = useState<JobType[]>(recruits)

  const selecteRecruit = (recruit: JobType) => {
    if (selectedRecruits.includes(recruit)) {
      setSelectedRecruits(selectedRecruits.filter(v => v !== recruit))
    } else {
      setSelectedRecruits([...recruits, recruit])
    }
  }

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)
    locationParams.delete("recruit")
    selectedRecruits.forEach(v => locationParams.append("recruit", v))
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`
    router.push(newUrl, {
      scroll: false,
    })
  }, [selectedRecruits])

  return (
    <div className="py-4 px-2 flex flex-col gap-1">
      <button
        onClick={() => setSelectedRecruits([])}
        className={`text-coolgray font-semibold py-2 px-4 text-left rounded-lg
          ${selectedRecruits.length === 0 && "bg-whitesmoke"}`}
      >
        전체
      </button>
      {JobTypeList.map(({ title, value }) => (
        <button
          key={value}
          onClick={() => selecteRecruit(value)}
          className={`text-coolgray font-semibold py-2 px-4 text-left rounded-lg
          ${selectedRecruits.includes(value) && "bg-whitesmoke"}`}
        >
          {title}
        </button>
      ))}
    </div>
  )
}

export default MobileRecruitTypeFilter
