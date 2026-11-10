const CompetitionListSkeleton = () => (
  <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 md:mt-6 md:grid-cols-4 md:gap-x-4 md:gap-y-7">
    {Array.from({ length: 8 }, (_, index) => index).map(index => (
      <li key={index} className="list-none">
        <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-[#F2F4F6]" />
        <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-[#F2F4F6]" />
        <div className="mt-1.5 h-3 w-1/2 animate-pulse rounded bg-[#F2F4F6]" />
      </li>
    ))}
  </ul>
)

export default CompetitionListSkeleton
