import { SearchType } from "@/types/jobs"
import MobileProvinceFilter from "../common/MobileProvinceFilter"
import MobilePartTimeMajorFilter from "../common/MobilePartTimeMajorFilter"
import { PartTimeMajorGroup } from "@/types/majors"
import { PROVINCE } from "@/types"
import { useMobileFilterState } from "@/hooks/useMobileFilterState"
import { useMemo } from "react"

interface MobilePartTimeTabProps {
  provinces?: PROVINCE[]
  majorGroups?: PartTimeMajorGroup[]
}

const MobilePartTimeTab = ({
  provinces,
  majorGroups,
}: MobilePartTimeTabProps) => {
  const {
    mobileSearchTab,
    selectedMajorField,
    handleMajorField,
    handleSearchTab,
    selectedProvinceId,
    handleProvince,
  } = useMobileFilterState()

  const selectedProvince = useMemo(() => {
    return provinces?.filter(
      province => province.id.toString() === selectedProvinceId,
    )[0]
  }, [selectedProvinceId, provinces])

  const selectedMajor = useMemo(() => {
    return majorGroups?.filter(major => major.nameEn === selectedMajorField)[0]
  }, [selectedMajorField, majorGroups])

  return (
    <div className="relative mx-4 flex flex-col rounded border lg:hidden">
      <div className="grid grid-cols-2 text-sm text-main">
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
          {selectedMajorField ? selectedMajor?.nameKo : "분야"}
        </button>
      </div>

      {mobileSearchTab === SearchType.REGION && (
        <MobileProvinceFilter
          provinces={provinces}
          handleProvince={handleProvince}
        />
      )}
      {mobileSearchTab === SearchType.MAJOR && (
        <MobilePartTimeMajorFilter
          partTimeMajors={majorGroups}
          handleMajor={handleMajorField}
        />
      )}
    </div>
  )
}

export default MobilePartTimeTab
