import { JobType, JobTypeList } from "@/types/jobs"

interface Props {
  handleRecruit: (recruit: JobType | "") => void
}

const MobileRecruitTypeFilter = ({ handleRecruit }: Props) => {
  return (
    <div className="py-4 px-2 flex flex-col gap-1">
      <button
        onClick={() => handleRecruit("")}
        className="text-coolgray font-semibold py-2 px-4 text-left rounded-lg"
      >
        전체
      </button>
      {JobTypeList.map(({ title, value }) => (
        <button
          key={value}
          onClick={() => handleRecruit(value)}
          className="text-coolgray font-semibold py-2 px-4 text-left rounded-lg"
        >
          {title}
        </button>
      ))}
    </div>
  )
}

export default MobileRecruitTypeFilter
