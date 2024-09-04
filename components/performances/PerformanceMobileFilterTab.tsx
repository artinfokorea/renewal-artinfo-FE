import { PROVINCE } from "@/types"
import { SearchType } from "@/types/jobs"
import React, { useEffect, useMemo, useState } from "react"
import MobileProvinceFilter from "../common/MobileProvinceFilter"
import { useRouter, useSearchParams } from "next/navigation"
import PerformanceCategoryFilter from "./PerformanceCategoryFIlter"
import {
  PerformanceCategory,
  PerformanceCategoryValues,
} from "@/types/performances"

interface Props {
  provinces?: PROVINCE[]
}

const PerformanceMobileFilterTab = ({ provinces }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const provinceId = searchParams.get("provinceId") as string
  const category = searchParams.get("category") as PerformanceCategory
  const [mobileSearchTab, setMobileSearchTab] = useState<SearchType>()
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(
    provinceId || "",
  )
  const [selectedCategory, setSelectedCategory] = useState<
    PerformanceCategory | ""
  >(category || "")

  const handleSearchTab = (searchType: SearchType) => {
    if (mobileSearchTab === searchType) {
      setMobileSearchTab(undefined)
    } else {
      setMobileSearchTab(searchType)
    }
  }

  const handleProvince = (provinceId: string | "") => {
    setSelectedProvinceId(provinceId)
    setMobileSearchTab(undefined)
  }

  const handleCategory = (category: PerformanceCategory | "") => {
    setSelectedCategory(category)
    setMobileSearchTab(undefined)
  }

  const selectedProvince = useMemo(() => {
    return provinces?.filter(
      province => province.id.toString() === selectedProvinceId,
    )[0]
  }, [selectedProvinceId, provinces])

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)
    const currentProvinceId = locationParams.get("provinceId")

    if (currentProvinceId !== selectedProvinceId) {
      locationParams.delete("provinceId")
      if (selectedProvinceId)
        locationParams.append("provinceId", selectedProvinceId)
      const newUrl = `${window.location.pathname}?${locationParams.toString()}`
      router.push(newUrl, {
        scroll: false,
      })
    }
  }, [selectedProvinceId])

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)
    const currentCategory = locationParams.get("category")
    if (currentCategory !== selectedCategory) {
      locationParams.delete("category")
      if (selectedCategory) locationParams.append("category", selectedCategory)
      const newUrl = `${window.location.pathname}?${locationParams.toString()}`
      router.push(newUrl, {
        scroll: false,
      })
    }
  }, [selectedCategory])

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
          onClick={() => handleSearchTab(SearchType.CATEGORY)}
          className={`rounded py-2 ${
            mobileSearchTab === SearchType.CATEGORY && "bg-whitesmoke"
          }`}
        >
          {selectedCategory
            ? PerformanceCategoryValues[selectedCategory]
            : "분야"}
        </button>
      </div>

      {mobileSearchTab === SearchType.REGION && (
        <MobileProvinceFilter
          provinces={provinces}
          handleProvince={handleProvince}
        />
      )}
      {mobileSearchTab === SearchType.CATEGORY && (
        <PerformanceCategoryFilter handleCategory={handleCategory} />
      )}
    </div>
  )
}

export default PerformanceMobileFilterTab
