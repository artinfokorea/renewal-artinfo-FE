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
      <div className="max-w-screen-md rounded-xl border-2 border-whitesmoke shadow-lg">
        <div className="relative flex h-14 items-center justify-center">
          <h5 className="flex-1 text-center text-sm font-bold md:text-lg">
            채용 선택
          </h5>
          <Button
            className="absolute right-0 top-2 text-silver"
            onClick={() =>
              router.push(pathname.slice(0, pathname.lastIndexOf("/")))
            }
          >
            <CloseIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="border-b-[3px] border-whitesmoke" />
        <div className="px-4 py-12 md:px-12">
          {JobTypeList.map(type => (
            <Button
              key={type.value}
              className="mx-1 h-10 w-[72px] rounded-3xl bg-main text-xs text-white md:mx-4 md:w-[100px] md:text-sm"
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
