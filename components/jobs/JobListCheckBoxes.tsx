import { MAJOR, MajorCategory, MajorCategoryValues } from "@/types";
import JobTypeCheckBoxes from "./JobTypeCheckBoxes";
import MajorCheckBoxes from "../common/MajorCheckBoxes";

interface Props {
  majors?: MAJOR[];
}

const ListCheckBoxes = ({ majors }: Props) => {
  return (
    <form className="hidden lg:flex flex-col text-gray-400 min-w-[180px]">
      <JobTypeCheckBoxes />
      <MajorCheckBoxes majors={majors} />
    </form>
  );
};

export default ListCheckBoxes;
