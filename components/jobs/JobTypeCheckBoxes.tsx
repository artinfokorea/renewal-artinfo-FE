import { JobType, JobTypeList } from "@/types/jobs"
import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "../ui/label"
import CheckboxField from "../common/CheckboxField"
import { useEffect, useState } from "react"

const JobTypeCheckBoxes = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const recruits = searchParams.getAll("recruit") as JobType[]
  const [checkedState, setCheckedState] = useState<JobType[]>(recruits)

  const handleRecruitChange = (value: JobType) => {
    if (checkedState.includes(value)) {
      setCheckedState(checkedState.filter(v => v !== value))
    } else {
      setCheckedState([...recruits, value])
    }
  }

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)
    locationParams.delete("recruit")
    checkedState.forEach(v => locationParams.append("recruit", v))
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`
    router.push(newUrl, {
      scroll: false,
    })
  }, [checkedState])

  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold">직군</h4>
      <CheckboxField
        title="전체"
        checked={checkedState.length === 0}
        handleChange={() => setCheckedState([])}
      />

      {JobTypeList.map(({ title, value }) => (
        <CheckboxField<JobType>
          key={value}
          value={value}
          title={title}
          checked={checkedState.includes(value)}
          handleChange={handleRecruitChange}
        />
      ))}
    </div>
  )
}

export default JobTypeCheckBoxes
