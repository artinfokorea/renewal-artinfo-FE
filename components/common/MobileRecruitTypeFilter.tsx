import { JobType, JobTypeList } from "@/types/jobs"

interface Props {
  handleRecruit: (recruit: JobType | "") => void
}

const MobileRecruitTypeFilter = ({ handleRecruit }: Props) => {
  return (
    <div className="flex flex-col gap-1 px-2 py-4">
      <button
        onClick={() => handleRecruit("")}
        className="rounded-lg px-4 py-2 text-left font-semibold text-coolgray"
      >
        전체
      </button>
      {JobTypeList.map(({ title, value }) => (
        <button
          key={value}
          onClick={() => handleRecruit(value)}
          className="rounded-lg px-4 py-2 text-left font-semibold text-coolgray"
        >
          {title}
        </button>
      ))}
    </div>
  )
}

export default MobileRecruitTypeFilter
