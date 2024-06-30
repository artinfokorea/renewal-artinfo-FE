import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CheckboxField from "./CheckboxField"
import { ArtField, ProfessionalFieldTypes } from "@/types/majors"

interface Props {
  artFields?: ArtField[]
}

const ProfessionalCheckBoxes = ({ artFields }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const professionals = searchParams.getAll(
    "professional",
  ) as ProfessionalFieldTypes[]
  const [checkedProfessionals, setCheckedProfessionals] =
    useState<ProfessionalFieldTypes[]>(professionals)

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)

    locationParams.delete("professional")
    checkedProfessionals.forEach(v => locationParams.append("professional", v))
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`
    router.push(newUrl, {
      scroll: false,
    })
  }, [checkedProfessionals])

  const handleProfessionalChange = (key: ProfessionalFieldTypes) => {
    if (checkedProfessionals.includes(key)) {
      setCheckedProfessionals(checkedProfessionals.filter(v => v !== key))
    } else {
      setCheckedProfessionals([...checkedProfessionals, key])
    }
  }

  return (
    <div className="mt-12">
      <h4 className="text-lg font-semibold">분야</h4>
      <CheckboxField
        title="전체"
        checked={checkedProfessionals.length === 0}
        handleChange={() => setCheckedProfessionals([])}
      />

      {artFields?.map(({ nameKo, nameEn }) => {
        return (
          <div key={nameEn}>
            <CheckboxField<ProfessionalFieldTypes>
              value={nameEn}
              title={nameKo}
              checked={checkedProfessionals.includes(nameEn)}
              handleChange={() => handleProfessionalChange(nameEn)}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ProfessionalCheckBoxes
