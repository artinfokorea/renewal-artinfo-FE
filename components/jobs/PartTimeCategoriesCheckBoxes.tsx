import React, { useEffect, useState } from "react"
import CheckboxField from "../common/CheckboxField"
import { MajorGroupField } from "@/types/jobs"
import { useRouter, useSearchParams } from "next/navigation"
import { PartTimeMajorGroup } from "@/types/majors"

interface Props {
  majorGroups?: PartTimeMajorGroup[]
}

export const PartTimeCategoriesCheckBoxes = ({ majorGroups }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const majors = searchParams.getAll("majorGroup") as MajorGroupField[]
  const [checkedMajors, setCheckedMajors] = useState<MajorGroupField[]>(majors)

  const handleMajorChange = (value: MajorGroupField) => {
    if (checkedMajors.includes(value)) {
      setCheckedMajors(checkedMajors.filter(v => v !== value))
    } else {
      setCheckedMajors([...checkedMajors, value])
    }
  }

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)
    const currentMajors = locationParams.getAll(
      "majorGroup",
    ) as MajorGroupField[]
    if (JSON.stringify(currentMajors) !== JSON.stringify(checkedMajors)) {
      locationParams.delete("majorGroup")
      checkedMajors.forEach(v => locationParams.append("majorGroup", v))
      const newUrl = `${window.location.pathname}?${locationParams.toString()}`
      router.push(newUrl, {
        scroll: false,
      })
    }
  }, [checkedMajors])

  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold">직군</h4>
      <CheckboxField
        title="전체"
        checked={checkedMajors.length === 0}
        handleChange={() => setCheckedMajors([])}
      />

      {majorGroups?.map(({ nameEn, nameKo }) => (
        <CheckboxField<MajorGroupField>
          key={nameEn}
          value={nameEn}
          title={nameKo}
          checked={checkedMajors.includes(nameEn)}
          handleChange={handleMajorChange}
        />
      ))}
    </div>
  )
}
