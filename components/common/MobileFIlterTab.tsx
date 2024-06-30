import { PROVINCE } from "@/types"
import { SearchType } from "@/types/jobs"
import React, { useState } from "react"
import MobileProvinceFilter from "../common/MobileProvinceFilter"
import MobileProfessionalFilter from "./MobileProfessionalFilter"
import MobileRecruitTypeFilter from "../jobs/MobileRecruitTypeFilter"
import { ArtField } from "@/types/majors"

interface Props {
  provinces?: PROVINCE[]
  page: "LESSON" | "JOB"
  artFields?: ArtField[]
}

const MobileFilterTab = ({ provinces, page, artFields }: Props) => {
  const [mobileSearchTab, setMobileSearchTab] = useState<SearchType>()

  const handleSearchTab = (searchType: SearchType) => {
    if (mobileSearchTab === searchType) {
      setMobileSearchTab(undefined)
    } else {
      setMobileSearchTab(searchType)
    }
  }

  return (
    <div className="flex flex-col lg:hidden border relative">
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
            직군
          </button>
        )}
        <button
          onClick={() => handleSearchTab(SearchType.REGION)}
          className={`py-2 rounded ${
            mobileSearchTab === SearchType.REGION && "bg-whitesmoke"
          }`}
        >
          지역
        </button>
        <button
          onClick={() => handleSearchTab(SearchType.MAJOR)}
          className={`py-2 rounded ${
            mobileSearchTab === SearchType.MAJOR && "bg-whitesmoke"
          }`}
        >
          분야
        </button>
      </div>

      {mobileSearchTab === SearchType.RECRUIT && <MobileRecruitTypeFilter />}
      {mobileSearchTab === SearchType.REGION && (
        <MobileProvinceFilter provinces={provinces} />
      )}
      {mobileSearchTab === SearchType.MAJOR && (
        <MobileProfessionalFilter artFields={artFields} />
      )}
    </div>
  )
}

export default MobileFilterTab
