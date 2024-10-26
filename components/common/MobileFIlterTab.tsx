import { PROVINCE } from "@/types"
import { JobTypeValues, SearchType } from "@/types/jobs"
import React, { useMemo } from "react"
import MobileProvinceFilter from "../common/MobileProvinceFilter"
import MobileProfessionalFilter from "./MobileProfessionalFilter"
import MobileRecruitTypeFilter from "./MobileRecruitTypeFilter"
import { ArtField, MAJOR, ProfessionalFieldTypes } from "@/types/majors"
import { useFilterState } from "@/hooks/useMobileFilterState"

interface Props {
  provinces?: PROVINCE[]
  page: "LESSON" | "JOB"
  artFields?: ArtField[]
  majors?: MAJOR[]
}

const MobileFilterTab = ({ provinces, page, artFields, majors }: Props) => {
  const {
    mobileSearchTab,
    selectedRecruit,
    selectedProvinceId,
    selectedProfessional,
    handleSearchTab,
    handleRecruit,
    handleProvince,
    handleProfessional,
  } = useFilterState()

  const majorCategories = Array.from(
    new Set(majors?.map(major => major.secondGroupEn)),
  ).map(key => {
    const major = majors?.find(m => m.secondGroupEn === key)
    return {
      key,
      value: major?.secondGroupKo,
    }
  })

  const ProfessinalValues: { [key in ProfessionalFieldTypes]: string } =
    majorCategories?.reduce<{
      [key in ProfessionalFieldTypes]: string
    }>(
      (acc, curr) => {
        if (curr.value) {
          acc[curr.key] = curr.value
        }
        return acc
      },
      {} as { [key in ProfessionalFieldTypes]: string },
    )

  const selectedProvince = useMemo(() => {
    return provinces?.filter(
      province => province.id.toString() === selectedProvinceId,
    )[0]
  }, [selectedProvinceId, provinces])

  return (
    <div className="relative mx-4 flex flex-col rounded border lg:hidden">
      <div
        className={`grid text-sm text-main ${
          page === "JOB" ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {page === "JOB" && (
          <button
            onClick={() => handleSearchTab(SearchType.RECRUIT)}
            className={`rounded py-2 ${
              mobileSearchTab === SearchType.RECRUIT && "bg-whitesmoke"
            }`}
          >
            {selectedRecruit ? JobTypeValues[selectedRecruit] : "직군"}
          </button>
        )}
        <button
          onClick={() => handleSearchTab(SearchType.REGION)}
          className={`rounded py-2 ${
            mobileSearchTab === SearchType.REGION && "bg-whitesmoke"
          }`}
        >
          {selectedProvince ? selectedProvince?.name.substring(0, 2) : "지역"}
        </button>
        <button
          onClick={() => handleSearchTab(SearchType.MAJOR)}
          className={`rounded py-2 ${
            mobileSearchTab === SearchType.MAJOR && "bg-whitesmoke"
          }`}
        >
          {selectedProfessional
            ? ProfessinalValues[selectedProfessional]
            : "분야"}
        </button>
      </div>

      {mobileSearchTab === SearchType.RECRUIT && (
        <MobileRecruitTypeFilter handleRecruit={handleRecruit} />
      )}
      {mobileSearchTab === SearchType.REGION && (
        <MobileProvinceFilter
          provinces={provinces}
          handleProvince={handleProvince}
        />
      )}
      {mobileSearchTab === SearchType.MAJOR && (
        <MobileProfessionalFilter
          artFields={artFields}
          handleProfessional={handleProfessional}
        />
      )}
    </div>
  )
}

export default MobileFilterTab
