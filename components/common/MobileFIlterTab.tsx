import { PROVINCE } from "@/types"
import { JobType, JobTypeValues, SearchType } from "@/types/jobs"
import React, { useEffect, useMemo, useState } from "react"
import MobileProvinceFilter from "../common/MobileProvinceFilter"
import MobileProfessionalFilter from "./MobileProfessionalFilter"
import MobileRecruitTypeFilter from "./MobileRecruitTypeFilter"
import {
  ArtField,
  ProfessinalValues,
  ProfessionalFieldTypes,
} from "@/types/majors"
import { useRouter, useSearchParams } from "next/navigation"

interface Props {
  provinces?: PROVINCE[]
  page: "LESSON" | "JOB"
  artFields?: ArtField[]
}

const MobileFilterTab = ({ provinces, page, artFields }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const recruit = searchParams.get("recruit") as JobType
  const professional = searchParams.get(
    "professional",
  ) as ProfessionalFieldTypes
  const provinceId = searchParams.get("provinceId") as string
  const [mobileSearchTab, setMobileSearchTab] = useState<SearchType>()
  const [selectedRecruit, setSelectedRecruit] = useState<JobType | "">(
    recruit || "",
  )
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(
    provinceId || "",
  )
  const [selectedProfessional, setSelectedProfessional] = useState<
    ProfessionalFieldTypes | ""
  >(professional || "")

  const handleSearchTab = (searchType: SearchType) => {
    if (mobileSearchTab === searchType) {
      setMobileSearchTab(undefined)
    } else {
      setMobileSearchTab(searchType)
    }
  }

  const handleRecruit = (recruit: JobType | "") => {
    setSelectedRecruit(recruit)
    setMobileSearchTab(undefined)
  }

  const handleProvince = (provinceId: string | "") => {
    setSelectedProvinceId(provinceId)
    setMobileSearchTab(undefined)
  }

  const handleProfessional = (professional: ProfessionalFieldTypes | "") => {
    setSelectedProfessional(professional)
    setMobileSearchTab(undefined)
  }

  const selectedProvince = useMemo(() => {
    return provinces?.filter(
      province => province.id.toString() === selectedProvinceId,
    )[0]
  }, [selectedProvinceId, provinces])

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)
    locationParams.delete("recruit")
    if (selectedRecruit) locationParams.append("recruit", selectedRecruit)
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`
    router.push(newUrl, {
      scroll: false,
    })
  }, [selectedRecruit])

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)
    locationParams.delete("provinceId")
    if (selectedProvinceId)
      locationParams.append("provinceId", selectedProvinceId)
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`
    router.push(newUrl, {
      scroll: false,
    })
  }, [selectedProvinceId])

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)

    locationParams.delete("professional")
    if (selectedProfessional)
      locationParams.append("professional", selectedProfessional)
    const newUrl = `${window.location.pathname}?${locationParams.toString()}`
    router.push(newUrl, {
      scroll: false,
    })
  }, [selectedProfessional])

  return (
    <div className="flex flex-col lg:hidden border relative rounded">
      <div
        className={`grid text-main text-sm ${
          page === "JOB" ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {page === "JOB" && (
          <button
            onClick={() => handleSearchTab(SearchType.RECRUIT)}
            className={`py-2 rounded ${
              mobileSearchTab === SearchType.RECRUIT && "bg-whitesmoke"
            }`}
          >
            {selectedRecruit ? JobTypeValues[selectedRecruit] : "직군"}
          </button>
        )}
        <button
          onClick={() => handleSearchTab(SearchType.REGION)}
          className={`py-2 rounded ${
            mobileSearchTab === SearchType.REGION && "bg-whitesmoke"
          }`}
        >
          {selectedProvince ? selectedProvince?.name.substring(0, 2) : "지역"}
        </button>
        <button
          onClick={() => handleSearchTab(SearchType.MAJOR)}
          className={`py-2 rounded ${
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
