import { JobType, JobTypeList } from "@/types/jobs"
import { useRouter, useSearchParams } from "next/navigation"
import CheckboxField from "../common/CheckboxField"
import { useEffect, useState } from "react"

const JobTypeCheckBoxes = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const recruits = searchParams.getAll("recruit") as JobType[]
  const [checkedRecruits, setCheckedRecruits] = useState<JobType[]>(recruits)

  const handleRecruitChange = (value: JobType) => {
    if (checkedRecruits.includes(value)) {
      setCheckedRecruits(checkedRecruits.filter(v => v !== value))
    } else {
      setCheckedRecruits([...recruits, value])
    }
  }

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)
    const currentRecruits = locationParams.getAll("recruit") as JobType[]
    if (JSON.stringify(currentRecruits) !== JSON.stringify(checkedRecruits)) {
      locationParams.delete("recruit")
      checkedRecruits.forEach(v => locationParams.append("recruit", v))
      const newUrl = `${window.location.pathname}?${locationParams.toString()}`
      router.push(newUrl, {
        scroll: false,
      })
    }
  }, [checkedRecruits])

  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold">직군</h4>
      <CheckboxField
        title="전체"
        checked={checkedRecruits.length === 0}
        handleChange={() => setCheckedRecruits([])}
      />

      {JobTypeList.map(({ title, value }) => (
        <CheckboxField<JobType>
          key={value}
          value={value}
          title={title}
          checked={checkedRecruits.includes(value)}
          handleChange={handleRecruitChange}
        />
      ))}
    </div>
  )
}

export default JobTypeCheckBoxes
