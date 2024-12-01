import React from "react"
import CheckboxField from "../common/CheckboxField"
import { JobTimeType } from "@/types/jobs"

interface JobTimeTypeCheckBoxesProps {
  jobTimeType: JobTimeType
  handleJobTimeType: (jobTime: JobTimeType) => void
}

export const JobTimeTypeCheckBoxes = ({
  jobTimeType,
  handleJobTimeType,
}: JobTimeTypeCheckBoxesProps) => {
  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold">유형</h4>
      <CheckboxField
        title="정규"
        value={jobTimeType}
        checked={jobTimeType === JobTimeType.FULL_TIME}
        handleChange={() => handleJobTimeType(JobTimeType.FULL_TIME)}
      />
      <CheckboxField
        title="단기"
        value={jobTimeType}
        checked={jobTimeType === JobTimeType.PART_TIME}
        handleChange={() => handleJobTimeType(JobTimeType.PART_TIME)}
      />
      <CheckboxField
        title="아마추어"
        value={jobTimeType}
        checked={jobTimeType === JobTimeType.AMATEUR}
        handleChange={() => handleJobTimeType(JobTimeType.AMATEUR)}
      />
      <CheckboxField
        title="소년 ∙ 소녀"
        value={jobTimeType}
        checked={jobTimeType === JobTimeType.YOUTH}
        handleChange={() => handleJobTimeType(JobTimeType.YOUTH)}
      />
    </div>
  )
}
