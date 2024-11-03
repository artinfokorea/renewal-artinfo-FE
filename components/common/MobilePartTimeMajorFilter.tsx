import { PartTimeMajor } from "@/types/jobs"
import { PartTimeMajorGroup } from "@/types/majors"

interface Props {
  partTimeMajors?: PartTimeMajorGroup[]
  handleMajor: (major: PartTimeMajor | "") => void
}

const MobilePartTimeMajorFilter = ({ partTimeMajors, handleMajor }: Props) => {
  return (
    <div className="flex flex-col gap-1 px-2 py-4">
      <button
        onClick={() => handleMajor("")}
        className="rounded-lg px-4 py-1 text-left font-semibold text-coolgray"
      >
        전체
      </button>
      {partTimeMajors?.map(({ nameEn, nameKo }) => {
        return (
          <div key={nameEn}>
            <div className="flex items-center">
              <button
                className="flex w-full items-center gap-2 rounded-lg px-4 py-1 text-left font-semibold text-coolgray"
                onClick={() => handleMajor(nameEn)}
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

export default MobilePartTimeMajorFilter