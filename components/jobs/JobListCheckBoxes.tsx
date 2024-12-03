import JobTypeCheckBoxes from "./JobTypeCheckBoxes"
import ProfessionalCheckBoxes from "../common/ProfessionalCheckBoxes"
import { ArtField, PartTimeMajorGroup } from "@/types/majors"
import { JobTimeType } from "@/types/jobs"
import { JobTimeTypeCheckBoxes } from "./JobTimeTypeCheckBoxes"
import { PartTimeCategoriesCheckBoxes } from "./PartTimeCategoriesCheckBoxes"

interface Props {
  artFields?: ArtField[]
  jobTimeType: JobTimeType
  handleJobTimeType: (jobTime: JobTimeType) => void
  majorGroups?: PartTimeMajorGroup[]
}

const ListCheckBoxes = ({
  artFields,
  handleJobTimeType,
  jobTimeType,
  majorGroups,
}: Props) => {
  return (
    <form className="min-w-[180px] flex-col px-4 text-gray-400">
      <JobTimeTypeCheckBoxes
        jobTimeType={jobTimeType}
        handleJobTimeType={handleJobTimeType}
      />
      {jobTimeType === JobTimeType.PART_TIME ? (
        <>
          <JobTypeCheckBoxes />
          <ProfessionalCheckBoxes artFields={artFields} />
        </>
      ) : (
        <PartTimeCategoriesCheckBoxes majorGroups={majorGroups} />
      )}
    </form>
  )
}

export default ListCheckBoxes
