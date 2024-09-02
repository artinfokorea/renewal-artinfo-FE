import {
  PerformanceCategory,
  PerformanceCategoryList,
  PerformanceCategoryValues,
} from "@/types/performances"

interface Props {
  handleCategory: (category: PerformanceCategory | "") => void
}

const PerformanceCategoryFilter = ({ handleCategory }: Props) => {
  return (
    <div className="flex flex-col gap-1 px-2 py-4">
      <button
        onClick={() => handleCategory("")}
        className="rounded-lg px-4 py-1 text-left font-semibold text-coolgray"
      >
        전체
      </button>
      {PerformanceCategoryList?.map(category => {
        return (
          <div key={category}>
            <div className="flex items-center">
              <button
                className="flex w-full items-center gap-2 rounded-lg px-4 py-1 text-left font-semibold text-coolgray"
                onClick={() => handleCategory(category)}
              >
                {PerformanceCategoryValues[category]}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PerformanceCategoryFilter
