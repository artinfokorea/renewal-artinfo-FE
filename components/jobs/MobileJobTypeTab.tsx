import { JobTimeType } from "@/types/jobs"

interface MobileJobTypeTabProps {
  jobTimeType: JobTimeType
  handleJobTimeType: (jobTime: JobTimeType) => void
}

export const MobileJobTypeTab = ({
  jobTimeType,
  handleJobTimeType,
}: MobileJobTypeTabProps) => {
  return (
    <div className="relative mx-4 mb-2 flex flex-col rounded border lg:hidden">
      <div className="grid grid-cols-2 text-sm text-main">
        <button
          onClick={() => handleJobTimeType(JobTimeType.FULL_TIME)}
          className={`rounded py-2 ${
            jobTimeType === JobTimeType.FULL_TIME && "bg-main text-white"
          }`}
        >
          정규직
        </button>
        <button
          onClick={() => handleJobTimeType(JobTimeType.PART_TIME)}
          className={`rounded py-2 ${
            jobTimeType === JobTimeType.PART_TIME && "bg-main text-white"
          }`}
        >
          단기직
        </button>
      </div>
    </div>
  )
}
