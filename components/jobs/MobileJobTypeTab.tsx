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
      <div className="grid grid-cols-4 text-sm text-main">
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
        <button
          onClick={() => handleJobTimeType(JobTimeType.AMATEUR)}
          className={`rounded py-2 ${
            jobTimeType === JobTimeType.AMATEUR && "bg-main text-white"
          }`}
        >
          아마추어
        </button>
        <button
          onClick={() => handleJobTimeType(JobTimeType.YOUTH)}
          className={`rounded py-2 ${
            jobTimeType === JobTimeType.YOUTH && "bg-main text-white"
          }`}
        >
          소년 ∙ 소녀
        </button>
      </div>
    </div>
  )
}
