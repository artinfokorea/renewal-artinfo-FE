import JobTypeCheckBoxes from "./JobTypeCheckBoxes"
import ProfessionalCheckBoxes from "../common/ProfessionalCheckBoxes"
import { ArtField, PartTimeMajorGroup } from "@/types/majors"
import { JobTimeType } from "@/types/jobs"
import { PartTimeCategoriesCheckBoxes } from "./PartTimeCategoriesCheckBoxes"

interface Props {
  artFields?: ArtField[]
  jobTimeType: JobTimeType
  majorGroups?: PartTimeMajorGroup[]
}

const ListCheckBoxes = ({
  artFields,
  jobTimeType,
  majorGroups,
}: Props) => {
  return (
    <form className="min-w-[180px] flex-col px-4 text-gray-400">
      {jobTimeType !== JobTimeType.PART_TIME ? (
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
