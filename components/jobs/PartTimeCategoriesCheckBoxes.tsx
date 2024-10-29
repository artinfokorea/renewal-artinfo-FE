import React, { useEffect, useState } from "react"
import CheckboxField from "../common/CheckboxField"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { PartTimeMajor } from "@/types/jobs"
import { useRouter, useSearchParams } from "next/navigation"
import { PartTimeMajorGroup } from "@/types/majors"

interface Props {
  partTimeMajorList?: PartTimeMajorGroup[]
}

export const PartTimeCategoriesCheckBoxes = ({ partTimeMajorList }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const partTimeMajors = searchParams.getAll("partTimeMajor") as PartTimeMajor[]
  const [checkedMajors, setCheckedMajors] =
    useState<PartTimeMajor[]>(partTimeMajors)

  const handleMajorChange = (value: PartTimeMajor) => {
    if (checkedMajors.includes(value)) {
      setCheckedMajors(checkedMajors.filter(v => v !== value))
    } else {
      setCheckedMajors([...checkedMajors, value])
    }
  }

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)
    const currentRecruits = locationParams.getAll(
      "partTimeMajor",
    ) as PartTimeMajor[]
    if (JSON.stringify(currentRecruits) !== JSON.stringify(checkedMajors)) {
      locationParams.delete("partTimeMajor")
      checkedMajors.forEach(v => locationParams.append("partTimeMajor", v))
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

      {partTimeMajorList?.map(({ nameEn, nameKo }) => (
        <CheckboxField<PartTimeMajor>
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
