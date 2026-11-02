const JobListSkeleton = () => {
  return (
    <ul className="mt-4 md:mt-6">
      {Array.from({ length: 8 }, (_, index) => index).map(index => (
        <li
          key={index}
          className="flex gap-3.5 border-t border-[#F2F4F6] py-4 first:border-t-0 md:items-center md:gap-5 md:py-[18px]"
        >
          <div className="h-[66px] w-[110px] shrink-0 animate-pulse rounded-lg bg-[#F2F4F6] md:h-24 md:w-40 md:rounded-[10px]" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-5 w-4/5 animate-pulse rounded bg-[#F2F4F6]" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-[#F2F4F6]" />
            <div className="h-6 w-32 animate-pulse rounded bg-[#F2F4F6]" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default JobListSkeleton
