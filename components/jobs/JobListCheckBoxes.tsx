import JobTypeCheckBoxes from "./JobTypeCheckBoxes"
import ProfessionalCheckBoxes from "../common/ProfessionalCheckBoxes"
import { ArtField } from "@/types/majors"

interface Props {
  artFields?: ArtField[]
}

const ListCheckBoxes = ({ artFields }: Props) => {
  return (
    <form className="hidden lg:flex flex-col text-gray-400 min-w-[180px]">
      <JobTypeCheckBoxes />
      <ProfessionalCheckBoxes artFields={artFields} />
    </form>
  )
}

export default ListCheckBoxes
