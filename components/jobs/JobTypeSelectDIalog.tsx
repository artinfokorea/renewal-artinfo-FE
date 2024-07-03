import { JobType, JobTypeList } from "@/types/jobs"
import { Button } from "../ui/button"
import CloseIcon from "../icons/CloseIcon"
import { usePathname, useRouter } from "next/navigation"

interface Props {
  handleSelectedJobType: (jobType: JobType) => void
}

const JobTypeSelectDialog = ({ handleSelectedJobType }: Props) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="shadow-lg max-w-screen-md rounded-xl border-whitesmoke border-2">
        <div className="flex justify-center items-center relative h-14">
          <h5 className="font-bold text-center flex-1 text-sm md:text-lg">
            채용 선택
          </h5>
          <Button
            className="absolute top-2 right-0 text-silver"
            onClick={() =>
              router.push(pathname.slice(0, pathname.lastIndexOf("/")))
            }
          >
            <CloseIcon className="w-5 h-5" />
          </Button>
        </div>
        <div className="border-whitesmoke border-b-[3px]" />
        <div className="px-4 md:px-12 py-12">
          {JobTypeList.map(type => (
            <Button
              key={type.value}
              className="text-white text-xs md:text-sm bg-main w-[72px] md:w-[100px] h-10 rounded-3xl mx-1 md:mx-4"
              onClick={() => handleSelectedJobType(type.value)}
            >
              {type.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default JobTypeSelectDialog
