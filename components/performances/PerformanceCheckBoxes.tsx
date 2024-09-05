import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  PerformanceCategory,
  PerformanceCategoryValues,
} from "@/types/performances"
import CheckboxField from "../common/CheckboxField"

const PerformanceCheckBoxes = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categories = searchParams.getAll("category") as PerformanceCategory[]
  const [checkedCategories, setCheckedCategories] = useState(categories)

  useEffect(() => {
    const isDesktop = window.innerWidth > 959

    if (!isDesktop) return

    const locationParams = new URLSearchParams(window.location.search)
    const currentCategories = searchParams.getAll(
      "category",
    ) as PerformanceCategory[]

    if (
      JSON.stringify(currentCategories) !== JSON.stringify(checkedCategories)
    ) {
      locationParams.delete("category")
      checkedCategories.forEach(v => locationParams.append("category", v))
      const newUrl = `${window.location.pathname}?${locationParams.toString()}`
      router.push(newUrl, {
        scroll: false,
      })
    }
  }, [checkedCategories, searchParams, router])

  const handleCategory = (key: PerformanceCategory) => {
    if (checkedCategories.includes(key)) {
      setCheckedCategories(checkedCategories.filter(v => v !== key))
    } else {
      setCheckedCategories([...checkedCategories, key])
    }
  }

  return (
    <div className="mt-12">
      <h4 className="text-lg font-semibold">분야</h4>
      <CheckboxField
        title="전체"
        checked={checkedCategories.length === 0}
        handleChange={() => setCheckedCategories([])}
      />
      <CheckboxField
        title={PerformanceCategoryValues.CLASSIC}
        checked={checkedCategories.includes(PerformanceCategory.CLASSIC)}
        handleChange={() => handleCategory(PerformanceCategory.CLASSIC)}
      />
      <CheckboxField
        title={PerformanceCategoryValues.MUSICAL}
        checked={checkedCategories.includes(PerformanceCategory.MUSICAL)}
        handleChange={() => handleCategory(PerformanceCategory.MUSICAL)}
      />
      <CheckboxField
        title={PerformanceCategoryValues.DANCE}
        checked={checkedCategories.includes(PerformanceCategory.DANCE)}
        handleChange={() => handleCategory(PerformanceCategory.DANCE)}
      />
      <CheckboxField
        title={PerformanceCategoryValues.TRADITIONAL_MUSIC}
        checked={checkedCategories.includes(
          PerformanceCategory.TRADITIONAL_MUSIC,
        )}
        handleChange={() =>
          handleCategory(PerformanceCategory.TRADITIONAL_MUSIC)
        }
      />
    </div>
  )
}

export default PerformanceCheckBoxes
