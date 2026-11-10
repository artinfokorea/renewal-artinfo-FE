import CompetitionListSkeleton from "@/components/skeleton/CompetitionListSkeleton"

const loading = () => (
  <div className="mx-auto max-w-[1040px] px-4 pt-6 md:px-6 md:pt-14">
    <div className="h-8 w-28 animate-pulse rounded bg-[#F2F4F6]" />
    <div className="mt-6 h-11 w-full animate-pulse rounded-xl bg-[#F2F4F6]" />
    <CompetitionListSkeleton />
  </div>
)

export default loading
