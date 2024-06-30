import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArtField, ProfessionalFieldTypes } from "@/types/majors"

interface Props {
  artFields?: ArtField[]
}

const MobileProfessionalFilter = ({ artFields }: Props) => {
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
    <div className="py-4 px-2 flex flex-col gap-1">
      <button
        onClick={() => setCheckedProfessionals([])}
        className={`text-coolgray font-semibold py-1 px-4 text-left rounded-lg ${
          checkedProfessionals.length === 0 && "bg-whitesmoke"
        }
          `}
      >
        전체
      </button>
      {artFields?.map(({ nameEn, nameKo }) => {
        return (
          <div key={nameEn}>
            <div className="flex items-center">
              <button
                className={`flex items-center gap-2 text-coolgray font-semibold py-1 px-4 text-left rounded-lg w-full ${
                  checkedProfessionals.includes(nameEn) && "bg-whitesmoke "
                } `}
                onClick={() => handleProfessionalChange(nameEn)}
              >
                {nameKo}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MobileProfessionalFilter
