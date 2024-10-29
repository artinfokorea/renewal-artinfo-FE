import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { JobType, PartTimeMajor, SearchType } from "@/types/jobs"
import { ProfessionalFieldTypes } from "@/types/majors"

export const useMobileFilterState = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [mobileSearchTab, setMobileSearchTab] = useState<SearchType>()
  const [selectedRecruit, setSelectedRecruit] = useState<JobType | "">(
    (searchParams.get("recruit") as JobType) || "",
  )
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(
    searchParams.get("provinceId") || "",
  )
  const [selectedProfessional, setSelectedProfessional] = useState<
    ProfessionalFieldTypes | ""
  >((searchParams.get("professional") as ProfessionalFieldTypes) || "")
  const [selectedPartTimeMajor, setSelectedPartTimeMajor] = useState<
    PartTimeMajor | ""
  >("")

  const handleSearchTab = (searchType: SearchType) => {
    if (mobileSearchTab === searchType) {
      setMobileSearchTab(undefined)
    } else {
      setMobileSearchTab(searchType)
    }
  }

  const handlePartTimeMajor = (major: PartTimeMajor | "") => {
    setSelectedPartTimeMajor(major)
    setMobileSearchTab(undefined)
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

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)
    const currentPartTimeMajor = locationParams.get("partTimeMajor")
    if (currentPartTimeMajor !== selectedPartTimeMajor) {
      locationParams.delete("partTimeMajor")
      if (selectedPartTimeMajor)
        locationParams.append("partTimeMajor", selectedPartTimeMajor)
      const newUrl = `${window.location.pathname}?${locationParams.toString()}`
      router.push(newUrl, {
        scroll: false,
      })
    }
  }, [selectedPartTimeMajor])

  useEffect(() => {
    const locationParams = new URLSearchParams(window.location.search)
    const currentRecruit = locationParams.get("recruit")
    if (currentRecruit !== selectedRecruit) {
      locationParams.delete("recruit")
      if (selectedRecruit) locationParams.append("recruit", selectedRecruit)
      const newUrl = `${window.location.pathname}?${locationParams.toString()}`
      router.push(newUrl, {
        scroll: false,
      })
    }
  }, [selectedRecruit])

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
    const currentProfessional = locationParams.get("professional")
    if (currentProfessional !== selectedProfessional) {
      locationParams.delete("professional")
      if (selectedProfessional)
        locationParams.append("professional", selectedProfessional)
      const newUrl = `${window.location.pathname}?${locationParams.toString()}`
      router.push(newUrl, {
        scroll: false,
      })
    }
  }, [selectedProfessional])

  return {
    mobileSearchTab,
    selectedPartTimeMajor,
    selectedRecruit,
    selectedProvinceId,
    selectedProfessional,
    handleSearchTab,
    handlePartTimeMajor,
    handleRecruit,
    handleProvince,
    handleProfessional,
  }
}
